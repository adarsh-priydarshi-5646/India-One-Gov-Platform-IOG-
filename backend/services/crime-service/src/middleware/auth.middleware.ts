import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';

// Simple auth middleware - verifies token with Auth Service
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: {
          code: 'MISSING_TOKEN',
          message: 'Authentication token is required',
        },
      } as ApiResponse);
      return;
    }

    const token = authHeader.substring(7);

    // Verify token with Auth Service
    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
    
    try {
      const response = await axios.get(`${authServiceUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 3000,
      });

      if (response.data.success) {
        // Attach user to request
        (req as any).user = response.data.data;
        next();
        return;
      }
    } catch (error) {
      throw new Error('Token verification failed');
    }
  } catch (error: any) {
    logger.error('Authentication error', error);
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token',
      },
    } as ApiResponse);
  }
}

// Authorization middleware - check user role
export function authorize(...allowedRoles: string[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user } = req as any;

      if (!user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        } as ApiResponse);
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Insufficient permissions',
          },
        } as ApiResponse);
        return;
      }

      next();
    } catch (error: any) {
      logger.error('Authorization error', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Authorization check failed',
        },
      } as ApiResponse);
    }
  };
}
