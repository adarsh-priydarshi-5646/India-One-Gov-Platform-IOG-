import { Request } from 'express';

// User roles
export enum UserRole {
  CITIZEN = 'CITIZEN',
  OFFICER = 'OFFICER',
  POLITICIAN = 'POLITICIAN',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

// User interface
export interface User {
  id: string;
  aadhaarHash: string;
  phoneNumber: string;
  email?: string;
  fullName: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  state?: string;
  district?: string;
  pincode?: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  passwordHash: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  profilePhotoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  role: UserRole;
  deviceId: string;
  iat?: number;
  exp?: number;
}

// Auth Request (extends Express Request with user)
export interface AuthRequest extends Request {
  user?: JWTPayload;
}

// Registration request
export interface RegisterRequest {
  aadhaarNumber: string;
  phoneNumber: string;
  email?: string;
  password: string;
  role: UserRole;
}

// Login request
export interface LoginRequest {
  identifier: string; // Phone or email
  password: string;
  deviceId: string;
}

// OTP verification request
export interface OTPVerificationRequest {
  userId: string;
  otp: string;
}

// Aadhaar verification response
export interface AadhaarVerificationResponse {
  success: boolean;
  data?: {
    name: string;
    dob: string;
    gender: string;
    address: string;
    photo?: string;
  };
  error?: string;
}

// Session data
export interface SessionData {
  userId: string;
  deviceId: string;
  refreshToken: string;
  ipAddress: string;
  userAgent: string;
  expiresAt: number;
  createdAt: number;
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any[];
  };
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// Audit log entry
export interface AuditLogEntry {
  userId?: string;
  action: string;
  ipAddress?: string;
  userAgent?: string;
  status: 'SUCCESS' | 'FAILURE';
  metadata?: any;
}
