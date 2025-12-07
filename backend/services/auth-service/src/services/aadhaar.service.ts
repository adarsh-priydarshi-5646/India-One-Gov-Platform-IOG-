import axios from 'axios';
import crypto from 'crypto';
import { config } from '../config';
import { logger } from '../utils/logger';
import { isValidAadhaar } from '../utils/validators';
import { AadhaarVerificationResponse } from '../types';

export class AadhaarService {
  /**
   * Verify Aadhaar number and fetch eKYC data
   * Note: This is a mock implementation. In production, integrate with actual UIDAI API
   */
  async verifyAadhaar(
    aadhaarNumber: string,
    consent: boolean
  ): Promise<AadhaarVerificationResponse> {
    try {
      // Validate Aadhaar number
      if (!isValidAadhaar(aadhaarNumber)) {
        return {
          success: false,
          error: 'Invalid Aadhaar number',
        };
      }

      // Check consent
      if (!consent) {
        return {
          success: false,
          error: 'Aadhaar verification requires user consent',
        };
      }

      // In production environment, call actual UIDAI API
      if (config.server.env === 'production' && config.aadhaar.apiKey) {
        return await this.callUidaiAPI(aadhaarNumber);
      }

      // Mock implementation for development
      logger.warn('Using mock Aadhaar verification (development mode)');
      return this.mockAadhaarVerification(aadhaarNumber);
    } catch (error) {
      logger.error('Aadhaar verification error', error);
      return {
        success: false,
        error: 'Aadhaar verification service unavailable',
      };
    }
  }

  /**
   * Call actual UIDAI eKYC API (Production)
   */
  private async callUidaiAPI(aadhaarNumber: string): Promise<AadhaarVerificationResponse> {
    try {
      const response = await axios.post(
        `${config.aadhaar.apiUrl}/verify`,
        {
          aadhaar: aadhaarNumber,
          // Add required UIDAI parameters
        },
        {
          headers: {
            'Authorization': `Bearer ${config.aadhaar.apiKey}`,
            'X-License-Key': config.aadhaar.licenseKey,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      if (response.data.success) {
        return {
          success: true,
          data: {
            name: response.data.name,
            dob: response.data.dob,
            gender: response.data.gender,
            address: response.data.address,
            photo: response.data.photo,
          },
        };
      }

      return {
        success: false,
        error: response.data.error || 'Verification failed',
      };
    } catch (error: any) {
      logger.error('UIDAI API call failed', error);
      throw new Error('Failed to connect to Aadhaar verification service');
    }
  }

  /**
   * Mock Aadhaar verification for development/testing
   */
  private mockAadhaarVerification(aadhaarNumber: string): AadhaarVerificationResponse {
    // Generate deterministic mock data based on Aadhaar number
    const mockNames = [
      'Rajesh Kumar',
      'Priya Sharma',
      'Amit Patel',
      'Sunita Verma',
      'Vikram Singh',
    ];
    const lastDigit = parseInt(aadhaarNumber.slice(-1), 10);

    return {
      success: true,
      data: {
        name: mockNames[lastDigit % mockNames.length],
        dob: '1990-01-15',
        gender: lastDigit % 2 === 0 ? 'MALE' : 'FEMALE',
        address: '123, MG Road, Andheri West, Mumbai, Maharashtra - 400058',
      },
    };
  }

  /**
   * Hash Aadhaar number for storage (SHA-256)
   * Never store Aadhaar in plain text!
   */
  hashAadhaar(aadhaarNumber: string): string {
    return crypto.createHash('sha256').update(aadhaarNumber).digest('hex');
  }

  /**
   * Verify hashed Aadhaar
   */
  verifyAadhaarHash(aadhaarNumber: string, hash: string): boolean {
    return this.hashAadhaar(aadhaarNumber) === hash;
  }
}

export const aadhaarService = new AadhaarService();
