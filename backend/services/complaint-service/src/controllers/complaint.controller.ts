import { Request, Response, NextFunction } from 'express';
import { complaintService } from '../services/complaint.service';
import {
  CreateComplaintRequest,
  UpdateStatusRequest,
  FeedbackRequest,
  ComplaintSearchFilters,
  ComplaintStatus,
  ComplaintPriority,
  ApiResponse,
} from '../types';
import { logger } from '../utils/logger';

export class ComplaintController {
  /**
   * POST /api/complaints
   * Create new complaint
   */
  async createComplaint(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user } = req as any; // Attached by auth middleware
      
      const complaintData: CreateComplaintRequest = req.body;
      const files = (req.files as Express.Multer.File[]) || [];

      // Validation
      if (!complaintData.title || !complaintData.description || !complaintData.category) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: 'Title, description, and category are required',
          },
        } as ApiResponse);
        return;
      }

      if (complaintData.title.length < 10) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_TITLE',
            message: 'Title must be at least 10 characters',
          },
        } as ApiResponse);
        return;
      }

      if (complaintData.description.length < 50) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_DESCRIPTION',
            message: 'Description must be at least 50 characters',
          },
        } as ApiResponse);
        return;
      }

      const complaint = await complaintService.createComplaint(user.userId, complaintData, files);

      res.status(201).json({
        success: true,
        message: 'Complaint created successfully',
        data: complaint,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Create complaint error', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'CREATE_FAILED',
          message: error.message || 'Failed to create complaint',
        },
      } as ApiResponse);
    }
  }

  /**
   * GET /api/complaints/:id
   * Get complaint by ID
   */
  async getComplaint(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const complaint = await complaintService.getComplaintById(id);

      if (!complaint) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Complaint not found',
          },
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: complaint,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Get complaint error', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'GET_FAILED',
          message: 'Failed to retrieve complaint',
        },
      } as ApiResponse);
    }
  }

  /**
   * GET /api/complaints
   * Search complaints
   */
  async searchComplaints(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user } = req as any;

      const filters: ComplaintSearchFilters = {
        ...req.query,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        status: req.query.status ? (req.query.status as string).split(',') as ComplaintStatus[] : undefined,
        category: req.query.category ? (req.query.category as string).split(',') : undefined,
        priority: req.query.priority ? (req.query.priority as string).split(',') as ComplaintPriority[] : undefined,
      };

      // If citizen, filter by their own complaints
      if (user.role === 'CITIZEN') {
        filters.citizenId = user.userId;
      }

      const result = await complaintService.searchComplaints(filters);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          pages: result.pages,
        },
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Search complaints error', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'SEARCH_FAILED',
          message: 'Failed to search complaints',
        },
      } as ApiResponse);
    }
  }

  /**
   * PUT /api/complaints/:id/status
   * Update complaint status (Officers only)
   */
  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { user } = req as any;
      const statusUpdate: UpdateStatusRequest = req.body;

      if (!statusUpdate.status) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_STATUS',
            message: 'Status is required',
          },
        } as ApiResponse);
        return;
      }

      const complaint = await complaintService.updateStatus(id, statusUpdate, user.userId);

      res.status(200).json({
        success: true,
        message: 'Complaint status updated',
        data: complaint,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Update status error', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_FAILED',
          message: error.message || 'Failed to update complaint status',
        },
      } as ApiResponse);
    }
  }

  /**
   * POST /api/complaints/:id/assign
   * Assign complaint to officer (Admins only)
   */
  async assignComplaint(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { officerId } = req.body;

      if (!officerId) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_OFFICER',
            message: 'Officer ID is required',
          },
        } as ApiResponse);
        return;
      }

      const complaint = await complaintService.assignComplaint(id, officerId);

      res.status(200).json({
        success: true,
        message: 'Complaint assigned successfully',
        data: complaint,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Assign complaint error', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'ASSIGN_FAILED',
          message: error.message || 'Failed to assign complaint',
        },
      } as ApiResponse);
    }
  }

  /**
   * POST /api/complaints/:id/escalate
   * Escalate complaint
   */
  async escalateComplaint(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const complaint = await complaintService.escalateComplaint(id);

      res.status(200).json({
        success: true,
        message: 'Complaint escalated successfully',
        data: complaint,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Escalate complaint error', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'ESCALATE_FAILED',
          message: error.message || 'Failed to escalate complaint',
        },
      } as ApiResponse);
    }
  }

  /**
   * POST /api/complaints/:id/feedback
   * Submit feedback (Citizens only)
   */
  async submitFeedback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const feedback: FeedbackRequest = req.body;

      if (!feedback.rating) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_RATING',
            message: 'Rating is required',
          },
        } as ApiResponse);
        return;
      }

      const complaint = await complaintService.submitFeedback(id, feedback);

      res.status(200).json({
        success: true,
        message: 'Feedback submitted successfully',
        data: complaint,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Submit feedback error', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'FEEDBACK_FAILED',
          message: error.message || 'Failed to submit feedback',
        },
      } as ApiResponse);
    }
  }

  /**
   * POST /api/complaints/:id/evidence
   * Upload additional evidence
   */
  async uploadEvidence(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const files = (req.files as Express.Multer.File[]) || [];

      if (files.length === 0) {
        res.status(400).json({
          success: false,
          error: {
            code: 'NO_FILES',
            message: 'No files provided',
          },
        } as ApiResponse);
        return;
      }

      const evidence = await complaintService.uploadEvidence(id, files);

      res.status(200).json({
        success: true,
        message: 'Evidence uploaded successfully',
        data: evidence,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Upload evidence error', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'UPLOAD_FAILED',
          message: error.message || 'Failed to upload evidence',
        },
      } as ApiResponse);
    }
  }

  /**
   * GET /api/complaints/stats
   * Get complaint statistics
   */
  async getStatistics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user } = req as any;
      
      const filters: Partial<ComplaintSearchFilters> = {};
      
      // If citizen, show only their stats
      if (user.role === 'CITIZEN') {
        filters.citizenId = user.userId;
      }

      // If officer, optionally filter by district/state
      if (req.query.district) {
        filters.district = req.query.district as string;
      }

      if (req.query.state) {
        filters.state = req.query.state as string;
      }

      const stats = await complaintService.getStatistics(filters);

      res.status(200).json({
        success: true,
        data: stats,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Get statistics error', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'STATS_FAILED',
          message: 'Failed to retrieve statistics',
        },
      } as ApiResponse);
    }
  }
}

export const complaintController = new ComplaintController();
