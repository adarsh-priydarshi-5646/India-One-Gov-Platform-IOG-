import { Request, Response, NextFunction } from 'express';
import { crimeService } from '../services/crime.service';
import { CreateFIRRequest, UpdateFIRStatusRequest, SearchFilters, ApiResponse } from '../types';
import { logger } from '../utils/logger';

export class CrimeController {
  /**
   * POST /api/firs
   * Register FIR
   */
  async registerFIR(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user } = req as any;
      const firData: CreateFIRRequest = req.body;

      if (!firData.crimeType || !firData.description || !firData.incidentDate) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: 'Crime type, description, and incident date are required',
          },
        } as ApiResponse);
        return;
      }

      const isAnonymous = req.body.isAnonymous === true;
      const fir = await crimeService.registerFIR(user?.userId || 'ANONYMOUS', firData, isAnonymous);

      res.status(201).json({
        success: true,
        message: 'FIR registered successfully',
        data: fir,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Register FIR error', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'REGISTER_FAILED',
          message: error.message || 'Failed to register FIR',
        },
      } as ApiResponse);
    }
  }

  /**
   * GET /api/firs/:id
   * Get FIR details
   */
  async getFIR(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const fir = await crimeService.getFIRById(id);

      if (!fir) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'FIR not found',
          },
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: fir,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Get FIR error', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'GET_FAILED',
          message: 'Failed to retrieve FIR',
        },
      } as ApiResponse);
    }
  }

  /**
   * GET /api/firs
   * Search FIRs
   */
  async searchFIRs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: SearchFilters = {
        ...req.query,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
      };

      const result = await crimeService.searchFIRs(filters);

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
      logger.error('Search FIRs error', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'SEARCH_FAILED',
          message: 'Failed to search FIRs',
        },
      } as ApiResponse);
    }
  }

  /**
   * PUT /api/firs/:id/status
   * Update FIR status
   */
  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { user } = req as any;
      const statusUpdate: UpdateFIRStatusRequest = req.body;

      const fir = await crimeService.updateStatus(id, statusUpdate, user.userId);

      res.status(200).json({
        success: true,
        message: 'FIR status updated',
        data: fir,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Update status error', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_FAILED',
          message: error.message || 'Failed to update FIR status',
        },
      } as ApiResponse);
    }
  }

  /**
   * POST /api/firs/:id/assign
   * Assign investigating officer
   */
  async assignOfficer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { officerId } = req.body;

      const fir = await crimeService.assignOfficer(id, officerId);

      res.status(200).json({
        success: true,
        message: 'Officer assigned successfully',
        data: fir,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Assign officer error', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'ASSIGN_FAILED',
          message: error.message || 'Failed to assign officer',
        },
      } as ApiResponse);
    }
  }

  /**
   * GET /api/firs/stats
   * Get crime statistics
   */
  async getStatistics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: Partial<SearchFilters> = {};

      if (req.query.district) {
        filters.district = req.query.district as string;
      }

      if (req.query.state) {
        filters.state = req.query.state as string;
      }

      const stats = await crimeService.getStatistics(filters);

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

export const crimeController = new CrimeController();
