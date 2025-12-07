import { userRepository } from '../repositories/user.repository';
import { auditRepository } from '../repositories/audit.repository';
import { passwordService } from './password.service';
import { tokenService } from './token.service';
import { aadhaarService } from './aadhaar.service';
import { redis } from '../config/redis';
import { 
  User, 
  RegisterRequest, 
  LoginRequest, 
  JWTPayload,
  SessionData,
  UserRole 
} from '../types';
import { generateOTP, normalizePhoneNumber } from '../utils/validators';
import { logger } from '../utils/logger';

export class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<{ userId: string; otpSent: boolean }> {
    // Normalize phone number
    const phoneNumber = normalizePhoneNumber(data.phoneNumber);

    // Verify Aadhaar
    const aadhaarVerification = await aadhaarService.verifyAadhaar(
      data.aadhaarNumber,
      true // consent
    );

    if (!aadhaarVerification.success) {
      throw new Error(aadhaarVerification.error || 'Aadhaar verification failed');
    }

    // Hash Aadhaar
    const aadhaarHash = aadhaarService.hashAadhaar(data.aadhaarNumber);

    // Check if Aadhaar already registered
    const existingUser = await userRepository.findByAadhaarHash(aadhaarHash);
    if (existingUser) {
      throw new Error('This Aadhaar number is already registered');
    }

    // Check if phone number already registered
    const existingPhone = await userRepository.findByPhoneNumber(phoneNumber);
    if (existingPhone) {
      throw new Error('This phone number is already registered');
    }

    // Hash password
    const passwordHash = await passwordService.hashPassword(data.password);

    // Create user
    const user = await userRepository.create({
      aadhaarHash,
      phoneNumber,
      email: data.email,
      fullName: aadhaarVerification.data!.name,
      dateOfBirth: new Date(aadhaarVerification.data!.dob),
      gender: aadhaarVerification.data!.gender,
      address: aadhaarVerification.data!.address,
      role: data.role || UserRole.CITIZEN,
      passwordHash,
      isVerified: false, // Will be verified after OTP
      isActive: true,
    });

    // Generate and send OTP
    const otp = generateOTP();
    await redis.setOTP(phoneNumber, 'registration', otp, 600); // 10 minutes

    logger.info('User registered, OTP sent', { userId: user.id, phoneNumber });

    // TODO: Send actual SMS with OTP
    logger.info(`OTP for ${phoneNumber}: ${otp}`);

    return {
      userId: user.id,
      otpSent: true,
    };
  }

  /**
   * Verify OTP and complete registration
   */
  async verifyOTP(userId: string, otp: string): Promise<{ 
    accessToken: string; 
    refreshToken: string; 
    user: Partial<User> 
  }> {
    const user = await userRepository.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    if (user.isVerified) {
      throw new Error('User already verified');
    }

    // Verify OTP
    const storedOTP = await redis.getOTP(user.phoneNumber, 'registration');
    
    if (!storedOTP) {
      throw new Error('OTP expired or not found');
    }

    if (storedOTP !== otp) {
      throw new Error('Invalid OTP');
    }

    // Mark user as verified
    await userRepository.markAsVerified(userId);
    await redis.deleteOTP(user.phoneNumber, 'registration');

    // Generate tokens
    const deviceId = 'web'; // TODO: Get from request
    const tokens = tokenService.generateTokenPair({
      userId: user.id,
      role: user.role,
      deviceId,
    });

    // Create session
    await this.createSession(user.id, deviceId, tokens.refreshToken, {
      ipAddress: '127.0.0.1', // TODO: Get from request
      userAgent: 'Unknown', // TODO: Get from request
    });

    logger.info('User verified successfully', { userId });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: this.sanitizeUser(user),
    };
  }

  /**
   * Login user
   */
  async login(data: LoginRequest, ipAddress: string, userAgent: string): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Partial<User>;
  }> {
    // Check for too many failed attempts
    const failedAttempts = await auditRepository.getFailedLoginAttempts(ipAddress);
    if (failedAttempts >= 5) {
      await auditRepository.createLog({
        action: 'LOGIN',
        ipAddress,
        userAgent,
        status: 'FAILURE',
        metadata: { reason: 'Too many failed attempts' },
      });
      throw new Error('Too many failed login attempts. Please try again after 15 minutes.');
    }

    // Find user
    const user = await userRepository.findByIdentifier(data.identifier);
    
    if (!user) {
      await auditRepository.createLog({
        action: 'LOGIN',
        ipAddress,
        userAgent,
        status: 'FAILURE',
        metadata: { identifier: data.identifier, reason: 'User not found' },
      });
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is inactive');
    }

    if (!user.isVerified) {
      throw new Error('Account not verified. Please verify your phone number.');
    }

    // Verify password
    const passwordMatch = await passwordService.comparePassword(data.password, user.passwordHash);
    
    if (!passwordMatch) {
      await auditRepository.createLog({
        userId: user.id,
        action: 'LOGIN',
        ipAddress,
        userAgent,
        status: 'FAILURE',
        metadata: { reason: 'Invalid password' },
      });
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const tokens = tokenService.generateTokenPair({
      userId: user.id,
      role: user.role,
      deviceId: data.deviceId,
    });

    // Create session
    await this.createSession(user.id, data.deviceId, tokens.refreshToken, {
      ipAddress,
      userAgent,
    });

    // Update last login
    await userRepository.updateLastLogin(user.id);

    // Log successful login
    await auditRepository.createLog({
      userId: user.id,
      action: 'LOGIN',
      ipAddress,
      userAgent,
      status: 'SUCCESS',
    });

    logger.info('User logged in successfully', { userId: user.id });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: this.sanitizeUser(user),
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    // Verify refresh token
    const payload = tokenService.verifyRefreshToken(refreshToken);

    // Check if session exists
    const session = await redis.getSession(payload.userId, payload.deviceId);
    
    if (!session || session.refreshToken !== refreshToken) {
      throw new Error('Invalid or expired refresh token');
    }

    // Generate new access token
    const accessToken = tokenService.generateAccessToken({
      userId: payload.userId,
      role: payload.role,
      deviceId: payload.deviceId,
    });

    return { accessToken };
  }

  /**
   * Logout user
   */
  async logout(userId: string, deviceId: string): Promise<void> {
    await redis.deleteSession(userId, deviceId);
    logger.info('User logged out', { userId, deviceId });
  }

  /**
   Create session in Redis
   */
  private async createSession(
    userId: string,
    deviceId: string,
    refreshToken: string,
    metadata: { ipAddress: string; userAgent: string }
  ): Promise<void> {
    const sessionData: SessionData = {
      userId,
      deviceId,
      refreshToken,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      createdAt: Date.now(),
    };

    await redis.setSession(userId, deviceId, sessionData);
  }

  /**
   * Remove sensitive data from user object
   */
  private sanitizeUser(user: User): Partial<User> {
    const { passwordHash, twoFactorSecret, ...sanitized } = user;
    return sanitized;
  }
}

export const authService = new AuthService();
