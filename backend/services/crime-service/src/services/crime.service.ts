import { firRepository } from '../repositories/fir.repository';
import { CreateFIRRequest, FIR, SearchFilters, UpdateFIRStatusRequest, CasePriority, CrimeType } from '../types';
import { logger } from '../utils/logger';

export class CrimeService {
  /**
   * Register FIR
   */
  async registerFIR(userId: string, data: CreateFIRRequest, isAnonymous: boolean = false): Promise<FIR> {
    try {
      // Determine priority based on crime type
      let priority = CasePriority.MEDIUM;
      const highPriorityCrimes = [
        CrimeType.MURDER,
        CrimeType.KIDNAPPING,
        CrimeType.RAPE,
        CrimeType.TERRORISM,
        CrimeType.HUMAN_TRAFFICKING,
      ];

      if (highPriorityCrimes.includes(data.crimeType)) {
        priority = CasePriority.CRITICAL;
      } else if ([CrimeType.ROBBERY, CrimeType.ASSAULT].includes(data.crimeType)) {
        priority = CasePriority.HIGH;
      }

      const fir = await firRepository.create({
        reportedBy: isAnonymous ? 'ANONYMOUS' : userId,
        reporterName: data.reporterName || 'Anonymous',
        reporterContact: data.reporterContact || '',
        crimeType: data.crimeType,
        description: data.description,
        incidentDate: new Date(data.incidentDate),
        incidentTime: data.incidentTime,
        locationLat: data.locationLat,
        locationLng: data.locationLng,
        address: data.address,
        state: data.state,
        district: data.district,
        policeStation: data.policeStation,
        priority,
        isAnonymous,
      });

      logger.info('FIR registered', { firId: fir.id, firNumber: fir.firNumber });

      // Send notifications to police and authorities (async)
      this.sendFIRNotifications(fir, data).catch((error) => {
        logger.error('FIR notification failed', error);
      });

      return fir;
    } catch (error) {
      logger.error('Failed to register FIR', error);
      throw error;
    }
  }

  /**
   * Get FIR by ID
   */
  async getFIRById(id: string): Promise<FIR | null> {
    return await firRepository.findById(id);
  }

  /**
   * Search FIRs
   */
  async searchFIRs(filters: SearchFilters): Promise<{
    data: FIR[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const { data, total } = await firRepository.search(filters);

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const pages = Math.ceil(total / limit);

    return { data, total, page, limit, pages };
  }

  /**
   * Update FIR status
   */
  async updateStatus(firId: string, statusUpdate: UpdateFIRStatusRequest, userId?: string): Promise<FIR> {
    const fir = await firRepository.update(firId, {
      status: statusUpdate.status,
    });

    logger.info('FIR status updated', { firId, status: statusUpdate.status });

    return fir;
  }

  /**
   * Assign investigating officer
   */
  async assignOfficer(firId: string, officerId: string): Promise<FIR> {
    const fir = await firRepository.assignOfficer(firId, officerId);

    logger.info('Officer assigned to FIR', { firId, officerId });

    return fir;
  }

  /**
   * Get statistics
   */
  async getStatistics(filters: Partial<SearchFilters> = {}): Promise<any> {
    return await firRepository.getStatistics(filters);
  }
  /**
   * Send FIR notifications to police and authorities
   */
  private async sendFIRNotifications(fir: FIR, data: CreateFIRRequest): Promise<void> {
    try {
      const { sendFIRNotifications } = await import('../utils/notification.util');
      
      const notificationPayload = {
        type: 'FIR' as const,
        firId: fir.id,
        firNumber: fir.firNumber,
        crimeType: fir.crimeType,
        description: fir.description,
        location: {
          state: fir.state,
          district: fir.district,
          policeStation: fir.policeStation,
          address: fir.address,
          lat: fir.locationLat,
          lng: fir.locationLng,
        },
        priority: fir.priority,
        reporterName: fir.reporterName,
        reporterContact: fir.reporterContact,
        incidentDate: fir.incidentDate.toISOString(),
        incidentTime: fir.incidentTime,
        isAnonymous: fir.isAnonymous,
      };

      await sendFIRNotifications(notificationPayload);
      
      logger.info('FIR notifications sent', { firId: fir.id });
    } catch (error) {
      logger.error('Failed to send FIR notifications', error);
      // Don't throw - notification failure shouldn't block FIR registration
    }
  }
}

export const crimeService = new CrimeService();
