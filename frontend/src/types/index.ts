export interface User {
  id: string;
  phoneNumber: string;
  email?: string;
  fullName: string;
  role: 'CITIZEN' | 'OFFICER' | 'POLITICIAN' | 'ADMIN' | 'SUPER_ADMIN';
  isVerified: boolean;
  state?: string;
  district?: string;
  profilePhotoUrl?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginRequest {
  identifier: string;
  password: string;
  deviceId: string;
}

export interface RegisterRequest {
  aadhaarNumber: string;
  phoneNumber: string;
  email?: string;
  password: string;
  role: string;
}

export interface Complaint {
  id: string;
  complaintNumber: string;
  citizenId: string;
  category: string;
  subCategory?: string;
  title: string;
  description: string;
  locationLat: number;
  locationLng: number;
  address: string;
  state: string;
  district: string;
  pincode?: string;
  department?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'SUBMITTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED';
  assignedTo?: string;
  assignedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  resolutionNotes?: string;
  citizenRating?: number;
  citizenFeedback?: string;
  estimatedResolutionDays?: number;
  isEscalated?: boolean;
  escalatedAt?: string;
  sentimentScore?: number;
  urgencyScore?: number;
  createdAt: string;
  updatedAt: string;
  evidence?: EvidenceFile[];
}

export interface EvidenceFile {
  fileId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  s3Url: string;
  uploadedAt: string;
}

export interface CreateComplaintRequest {
  category: string;
  subCategory?: string;
  title: string;
  description: string;
  locationLat: number;
  locationLng: number;
  address: string;
  state: string;
  district: string;
  pincode?: string;
}

export interface ComplaintFilters {
  status?: string[];
  category?: string[];
  priority?: string[];
  searchQuery?: string;
  page?: number;
  limit?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any[];
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface DashboardStats {
  total: number;
  submitted: number;
  assigned: number;
  in_progress: number;
  resolved: number;
  closed: number;
  rejected: number;
  escalated: number;
  avg_resolution_days: number;
}
