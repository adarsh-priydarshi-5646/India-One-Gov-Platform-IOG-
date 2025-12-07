import bcrypt from 'bcrypt';
import { config } from '../config';
import { logger } from '../utils/logger';

export class PasswordService {
  /**
   * Hash password using bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(config.security.bcryptRounds);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (error) {
      logger.error('Password hashing failed', error);
      throw new Error('Failed to hash password');
    }
  }

  /**
   * Compare password with hash
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      logger.error('Password comparison failed', error);
      return false;
    }
  }

  /**
   * Verify password meets security requirements
   */
  verifyPasswordStrength(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (password.length > 128) {
      errors.push('Password must not exceed 128 characters');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check for common weak passwords
    const commonPasswords = [
      'password', 'password123', '12345678', 'qwerty', 'abc123',
      'letmein', 'welcome', 'monkey', 'dragon', 'master'
    ];

    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('This password is too common and easy to guess');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const passwordService = new PasswordService();
