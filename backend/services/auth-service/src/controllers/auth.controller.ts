import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { RegisterRequest, LoginRequest, ApiResponse } from '../types';
import {
  isValidAadhaar,
  isValidPhoneNumber,
  isValidEmail,
  isValidPassword,
} from '../utils/validators';
import { logger } from '../utils/logger';

export class AuthController {
  /**
   * POST /api/auth/register
   * Register a new user
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        aadhaarNumber,
        phoneNumber,
        email,
        password,
        role,
      }: RegisterRequest = req.body;

      // Validate inputs
      if (!isValidAadhaar(aadhaarNumber)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_AADHAAR',
            message: 'Invalid Aadhaar number',
          },
        } as ApiResponse);
        return;
      }

      if (!isValidPhoneNumber(phoneNumber)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_PHONE',
            message: 'Invalid phone number',
          },
        } as ApiResponse);
        return;
      }

      if (email && !isValidEmail(email)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_EMAIL',
            message: 'Invalid email address',
          },
        } as ApiResponse);
        return;
      }

      const passwordValidation = isValidPassword(password);
      if (!passwordValidation.valid) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_PASSWORD',
            message: 'Password does not meet security requirements',
            details: passwordValidation.errors,
          },
        } as ApiResponse);
        return;
      }

      // Register user
      const result = await authService.register({
        aadhaarNumber,
        phoneNumber,
        email,
        password,
        role,
      });

      res.status(201).json({
        success: true,
        message: 'OTP sent to registered mobile number',
        data: result,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Registration error', error);
      res.status(400).json({
        success: false,
        error: {
          code: 'REGISTRATION_FAILED',
          message: error.message || 'Registration failed',
        },
      } as ApiResponse);
    }
  }

  /**
   * POST /api/auth/verify-otp
   * Verify OTP and complete registration
   */
  async verifyOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, otp } = req.body;

      if (!userId || !otp) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: 'User ID and OTP are required',
          },
        } as ApiResponse);
        return;
      }

      const result = await authService.verifyOTP(userId, otp);

      res.status(200).json({
        success: true,
        message: 'Account verified successfully',
        data: result,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('OTP verification error', error);
      res.status(400).json({
        success: false,
        error: {
          code: 'VERIFICATION_FAILED',
          message: error.message || 'OTP verification failed',
        },
      } as ApiResponse);
    }
  }

  /**
   * POST /api/auth/login
   * Login user
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { identifier, password, deviceId }: LoginRequest = req.body;

      if (!identifier || !password || !deviceId) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: 'Identifier, password, and device ID are required',
          },
        } as ApiResponse);
        return;
      }

      const ipAddress = req.ip || req.socket.remoteAddress || '';
      const userAgent = req.headers['user-agent'] || '';

      const result = await authService.login(
        { identifier, password, deviceId },
        ipAddress,
        userAgent
      );

      res.status(200).json({
        success: true,
        data: result,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Login error', error);
      res.status(401).json({
        success: false,
        error: {
          code: 'LOGIN_FAILED',
          message: error.message || 'Login failed',
        },
      } as ApiResponse);
    }
  }

  /**
   * POST /api/auth/refresh
   * Refresh access token
   */
  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          error: {
            code: 'MISSING_TOKEN',
            message: 'Refresh token is required',
          },
        } as ApiResponse);
        return;
      }

      const refreshToken = authHeader.substring(7);
      const result = await authService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        data: result,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Token refresh error', error);
      res.status(401).json({
        success: false,
        error: {
          code: 'REFRESH_FAILED',
          message: error.message || 'Token refresh failed',
        },
      } as ApiResponse);
    }
  }

  /**
   * POST /api/auth/logout
   * Logout user
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, deviceId } = req.body;

      if (!userId || !deviceId) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: 'User ID and device ID are required',
          },
        } as ApiResponse);
        return;
      }

      await authService.logout(userId, deviceId);

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Logout error', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'LOGOUT_FAILED',
          message: error.message || 'Logout failed',
        },
      } as ApiResponse);
    }
  }

  /**
   * GET /api/auth/me
   * Get current user profile
   */
  async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // User will be attached by auth middleware
      const { user } = req as any;

      if (!user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Not authenticated',
          },
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Get current user error', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to get user information',
        },
      } as ApiResponse);
    }
  }
}

export const authController = new AuthController();
