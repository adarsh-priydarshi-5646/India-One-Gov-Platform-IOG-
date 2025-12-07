import { Request, Response, NextFunction } from 'express';
import { tokenService } from '../services/token.service';
import { userRepository } from '../repositories/user.repository';
import { AuthRequest, JWTPayload, ApiResponse } from '../types';
import { logger } from '../utils/logger';

/**
 * Middleware to authenticate requests using JWT
 */
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

    // Verify token
    const payload: JWTPayload = tokenService.verifyAccessToken(token);

    // Attach user info to request
    (req as AuthRequest).user = payload;

    next();
  } catch (error: any) {
    logger.error('Authentication error', error);
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: error.message || 'Invalid or expired token',
      },
    } as ApiResponse);
  }
}

/**
 * Middleware to check if user has required role
 */
export function authorize(...allowedRoles: string[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user } = req as AuthRequest;

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

/**
 * Middleware to attach full user object to request
 */
export async function attachUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { user: jwtPayload } = req as AuthRequest;

    if (!jwtPayload) {
      next();
      return;
    }

    // Fetch full user from database
    const user = await userRepository.findById(jwtPayload.userId);

    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      } as ApiResponse);
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_INACTIVE',
          message: 'Account is inactive',
        },
      } as ApiResponse);
      return;
    }

    // Attach user to request
    (req as any).user = user;

    next();
  } catch (error: any) {
    logger.error('Attach user error', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to load user information',
      },
    } as ApiResponse);
  }
}
