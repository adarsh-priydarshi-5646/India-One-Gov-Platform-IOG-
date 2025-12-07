import { complaintRepository } from '../repositories/complaint.repository';
import { evidenceRepository } from '../repositories/evidence.repository';
import { fraudAIService } from './fraudAI.service';
import { s3Service } from '../config/s3';
import axios from 'axios';
import { config } from '../config';
import {
  Complaint,
  ComplaintWithEvidence,
  CreateComplaintRequest,
  ComplaintPriority,
  ComplaintStatus,
  UpdateStatusRequest,
  FeedbackRequest,
  ComplaintSearchFilters,
  EvidenceFile,
  DEPARTMENT_MAPPING,
} from '../types';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export class ComplaintService {
  /**
   * Create new complaint
   */
  async createComplaint(
    citizenId: string,
    data: CreateComplaintRequest,
    files?: Express.Multer.File[]
  ): Promise<ComplaintWithEvidence> {
    try {
      // Analyze sentiment and urgency
      const sentimentAnalysis = await fraudAIService.analyzeSentiment(
        `${data.title}. ${data.description}`
      );

      // Determine priority based on urgency score
      let priority = ComplaintPriority.MEDIUM;
      if (sentimentAnalysis.urgency.score > 0.7) {
        priority = ComplaintPriority.URGENT;
      } else if (sentimentAnalysis.urgency.score > 0.5) {
        priority = ComplaintPriority.HIGH;
      } else if (sentimentAnalysis.urgency.score < 0.3) {
        priority = ComplaintPriority.LOW;
      }

      // Auto-determine department
      const department = DEPARTMENT_MAPPING[data.category] || DEPARTMENT_MAPPING['Other'];

      // Create complaint in database
      const complaint = await complaintRepository.create({
        citizenId,
        ...data,
        department,
        priority,
        sentimentScore: sentimentAnalysis.sentiment.score,
        urgencyScore: sentimentAnalysis.urgency.score,
      });

      logger.info('Complaint created', { complaintId: complaint.id, complaintNumber: complaint.complaintNumber });

      // Upload evidence files if provided
      let evidenceFiles: EvidenceFile[] = [];
      if (files && files.length > 0) {
        evidenceFiles = await this.uploadEvidenceFiles(complaint.id, files);
      }

      // Analyze for fraud (async, don't block)
      this.analyzeFraudAsync(complaint, evidenceFiles.length).catch((error) => {
        logger.error('Fraud analysis failed', error);
      });

      // Auto-assign if enabled (async)
      if (config.assignment.autoAssignEnabled) {
        this.autoAssignComplaint(complaint.id).catch((error) => {
          logger.error('Auto-assignment failed', error);
        });
      }

      // Send notification (async)
      this.sendNotification({
        userId: citizenId,
        type: 'COMPLAINT_CREATED',
        complaintNumber: complaint.complaintNumber,
      }).catch((error) => {
        logger.error('Notification failed', error);
      });

      // Send location-based notifications to authorities (async)
      this.sendAuthorityNotifications(complaint, citizenId, data).catch((error) => {
        logger.error('Authority notification failed', error);
      });

      return { ...complaint, evidence: evidenceFiles };
    } catch (error) {
      logger.error('Failed to create complaint', error);
      throw error;
    }
  }

  /**
   * Get complaint by ID
   */
  async getComplaintById(id: string): Promise<ComplaintWithEvidence | null> {
    const complaint = await complaintRepository.findById(id);
    if (!complaint) return null;

    // Get evidence files
    const evidence = await evidenceRepository.findByComplaintId(id);

    // Generate signed URLs for evidence files
    const evidenceFiles = evidence?.files.map((file) => ({
      ...file,
      s3Url: s3Service.getSignedUrl(file.s3Key),
    })) || [];

    return { ...complaint, evidence: evidenceFiles };
  }

  /**
   * Search complaints
   */
  async searchComplaints(filters: ComplaintSearchFilters): Promise<{
    data: ComplaintWithEvidence[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const { data, total } = await complaintRepository.search(filters);

    // Attach evidence to each complaint
    const complaintsWithEvidence = await Promise.all(
      data.map(async (complaint) => {
        const evidence = await evidenceRepository.findByComplaintId(complaint.id);
        const evidenceFiles = evidence?.files.map((file) => ({
          ...file,
          s3Url: s3Service.getSignedUrl(file.s3Key),
        })) || [];

        return { ...complaint, evidence: evidenceFiles };
      })
    );

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const pages = Math.ceil(total / limit);

    return {
      data: complaintsWithEvidence,
      total,
      page,
      limit,
      pages,
    };
  }

  /**
   * Update complaint status
   */
  async updateStatus(
    complaintId: string,
    statusUpdate: UpdateStatusRequest,
    userId?: string
  ): Promise<Complaint> {
    const complaint = await complaintRepository.updateStatus(complaintId, statusUpdate, userId);

    // Send notification on status change
    this.sendNotification({
      userId: complaint.citizenId,
      type: 'COMPLAINT_STATUS_UPDATE',
      complaintNumber: complaint.complaintNumber,
      status: statusUpdate.status,
    }).catch((error) => {
      logger.error('Notification failed', error);
    });

    return complaint;
  }

  /**
   * Assign complaint to officer
   */
  async assignComplaint(complaintId: string, officerId: string): Promise<Complaint> {
    const complaint = await complaintRepository.assign(complaintId, officerId);

    // Send notification to officer
    this.sendNotification({
      userId: officerId,
      type: 'COMPLAINT_ASSIGNED',
      complaintNumber: complaint.complaintNumber,
    }).catch((error) => {
      logger.error('Notification failed', error);
    });

    return complaint;
  }

  /**
   * Escalate complaint
   */
  async escalateComplaint(complaintId: string): Promise<Complaint> {
    const complaint = await complaintRepository.escalate(complaintId);

    logger.warn('Complaint escalated', { complaintId, complaintNumber: complaint.complaintNumber });

    // Send escalation notification
    this.sendNotification({
      userId: complaint.citizenId,
      type: 'COMPLAINT_ESCALATED',
      complaintNumber: complaint.complaintNumber,
    }).catch((error) => {
      logger.error('Notification failed', error);
    });

    return complaint;
  }

  /**
   * Submit feedback
   */
  async submitFeedback(complaintId: string, feedback: FeedbackRequest): Promise<Complaint> {
    if (feedback.rating < 1 || feedback.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    return await complaintRepository.submitFeedback(complaintId, feedback.rating, feedback.feedback);
  }

  /**
   * Upload evidence files
   */
  async uploadEvidence(complaintId: string, files: Express.Multer.File[]): Promise<EvidenceFile[]> {
    const complaint = await complaintRepository.findById(complaintId);
    if (!complaint) {
      throw new Error('Complaint not found');
    }

    return await this.uploadEvidenceFiles(complaintId, files);
  }

  /**
   * Get complaint statistics
   */
  async getStatistics(filters: Partial<ComplaintSearchFilters> = {}): Promise<any> {
    return await complaintRepository.getStatistics(filters);
  }

  /**
   * Upload evidence files to S3 and save to MongoDB
   */
  private async uploadEvidenceFiles(complaintId: string, files: Express.Multer.File[]): Promise<EvidenceFile[]> {
    const evidenceFiles: EvidenceFile[] = [];

    for (const file of files) {
      const { key, url, size } = await s3Service.uploadFile(file, `complaints/${complaintId}`);

      const evidenceFile: EvidenceFile = {
        fileId: uuidv4(),
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: size,
        s3Key: key,
        s3Url: url,
        uploadedAt: new Date(),
      };

      evidenceFiles.push(evidenceFile);
    }

    // Save to MongoDB
    await evidenceRepository.addFiles(complaintId, evidenceFiles);

    logger.info('Evidence files uploaded', { complaintId, count: evidenceFiles.length });

    return evidenceFiles;
  }

  /**
   * Analyze complaint for fraud (async)
   */
  private async analyzeFraudAsync(complaint: Complaint, evidenceCount: number): Promise<void> {
    try {
      const fraudAnalysis = await fraudAIService.analyzeFraud({
        userId: complaint.citizenId,
        description: complaint.description,
        evidenceCount,
        category: complaint.category,
        location: {
          lat: complaint.locationLat,
          lng: complaint.locationLng,
        },
      });

      // If high fraud risk, flag or escalate
      if (fraudAnalysis.riskLevel === 'HIGH' || fraudAnalysis.riskLevel === 'CRITICAL') {
        logger.warn('High fraud risk detected', {
          complaintId: complaint.id,
          fraudProbability: fraudAnalysis.fraudProbability,
          riskLevel: fraudAnalysis.riskLevel,
        });

        // Auto-escalate high-risk complaints
        await complaintRepository.escalate(complaint.id);
      }
    } catch (error) {
      logger.error('Fraud analysis async error', error);
    }
  }

  /**
   * Auto-assign complaint to available officer
   */
  private async autoAssignComplaint(complaintId: string): Promise<void> {
    try {
      // TODO: Implement intelligent assignment logic
      // - Find officers in the complaint's district/department
      // - Balance workload
      // - Consider officer specialization

      logger.info('Auto-assignment skipped (not implemented)', { complaintId });
    } catch (error) {
      logger.error('Auto-assignment error', error);
    }
  }

  /**
   * Send notification via notification service
   */
  private async sendNotification(data: {
    userId: string;
    type: string;
    complaintNumber?: string;
    status?: ComplaintStatus;
  }): Promise<void> {
    try {
      await axios.post(`${config.services.notification}/api/notifications/send`, {
        userId: data.userId,
        type: data.type,
        data: {
          complaintNumber: data.complaintNumber,
          status: data.status,
        },
      });
    } catch (error) {
      // Don't throw - notifications should not break main flow
      logger.error('Notification service error', error);
    }
  }

  /**
   * Run escalation cron job
   */
  async checkEscalations(): Promise<void> {
    try {
      const complaintsToEscalate = await complaintRepository.getComplaintsForEscalation(
        config.assignment.escalationDays
      );

      for (const complaint of complaintsToEscalate) {
        await this.escalateComplaint(complaint.id);
      }

      logger.info('Escalation check completed', { escalatedCount: complaintsToEscalate.length });
    } catch (error) {
      logger.error('Escalation check failed', error);
    }
  }

  /**
   * Send notifications to relevant authorities based on complaint type and location
   */
  private async sendAuthorityNotifications(
    complaint: Complaint,
    citizenId: string,
    data: CreateComplaintRequest
  ): Promise<void> {
    try {
      const { sendComplaintNotifications } = await import('../utils/notification.util');
      
      // Get citizen details for notification
      let citizenName = 'Citizen';
      let citizenContact = '';
      
      try {
        const authResponse = await axios.get(`${config.services.authService}/api/users/${citizenId}`);
        if (authResponse.data.success) {
          citizenName = authResponse.data.data.fullName || 'Citizen';
          citizenContact = authResponse.data.data.phoneNumber || authResponse.data.data.email || '';
        }
      } catch (error) {
        logger.warn('Failed to fetch citizen details', { citizenId });
      }

      const notificationPayload = {
        type: 'COMPLAINT' as const,
        complaintId: complaint.id,
        complaintNumber: complaint.complaintNumber,
        category: complaint.category,
        subCategory: data.subCategory,
        title: complaint.title,
        description: complaint.description,
        location: {
          state: complaint.state,
          district: complaint.district,
          address: complaint.address,
          lat: complaint.locationLat,
          lng: complaint.locationLng,
        },
        urgencyLevel: complaint.priority,
        citizenId,
        citizenName,
        citizenContact,
        targetPerson: (data as any).officerName || (data as any).politicianName ? {
          name: (data as any).officerName || (data as any).politicianName,
          designation: (data as any).officerDesignation,
          department: (data as any).officerDepartment,
          position: (data as any).politicianPosition,
        } : undefined,
        incidentDate: (data as any).incidentDate,
        estimatedLoss: (data as any).estimatedLoss ? parseFloat((data as any).estimatedLoss) : undefined,
      };

      await sendComplaintNotifications(notificationPayload);
      
      logger.info('Authority notifications sent', { complaintId: complaint.id });
    } catch (error) {
      logger.error('Failed to send authority notifications', error);
      // Don't throw - notification failure shouldn't block complaint creation
    }
  }
}

export const complaintService = new ComplaintService();
