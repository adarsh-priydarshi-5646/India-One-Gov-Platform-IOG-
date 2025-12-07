import jwt from 'jsonwebtoken';
import { config } from '../config';
import { JWTPayload } from '../types';
import { logger } from '../utils/logger';

export class TokenService {
  /**
   * Generate access token
   */
  generateAccessToken(payload: JWTPayload): string {
    const options = { expiresIn: config.jwt.accessExpiry };
    // @ts-ignore - JWT types issue with expiresIn
    return jwt.sign(payload, config.jwt.secret, options);
  }

  /**
   * Generate refresh token
   */
  generateRefreshToken(payload: JWTPayload): string {
    const options = { expiresIn: config.jwt.refreshExpiry };
    // @ts-ignore - JWT types issue with expiresIn
    return jwt.sign(payload, config.jwt.secret, options);
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
      return decoded;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      }
      throw error;
    }
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
      return decoded;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid refresh token');
      }
      throw error;
    }
  }

  /**
   * Decode token without verification
   */
  decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch (error) {
      logger.error('Failed to decode token', error);
      return null;
    }
  }

  /**
   * Generate token pair
   */
  generateTokenPair(payload: JWTPayload): { accessToken: string; refreshToken: string } {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }
}

export const tokenService = new TokenService();

