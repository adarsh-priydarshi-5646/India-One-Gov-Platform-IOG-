// Complaint statuses
export enum ComplaintStatus {
  SUBMITTED = 'SUBMITTED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  REJECTED = 'REJECTED',
}

// Complaint priorities
export enum ComplaintPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

// Complaint categories
export enum ComplaintCategory {
  WATER_SUPPLY = 'Water Supply',
  ROADS = 'Roads & Infrastructure',
  ELECTRICITY = 'Electricity',
  SANITATION = 'Sanitation',
  STREET_LIGHTS = 'Street Lights',
  DRAINAGE = 'Drainage',
  GARBAGE = 'Garbage Collection',
  PUBLIC_TRANSPORT = 'Public Transport',
  HEALTH = 'Health Services',
  EDUCATION = 'Education',
  OTHER = 'Other',
}

// Complaint interface
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
  priority: ComplaintPriority;
  status: ComplaintStatus;
  assignedTo?: string;
  assignedAt?: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  resolutionNotes?: string;
  citizenRating?: number;
  citizenFeedback?: string;
  estimatedResolutionDays?: number;
  isEscalated: boolean;
  escalatedAt?: Date;
  sentimentScore?: number;
  urgencyScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Evidence file interface
export interface EvidenceFile {
  fileId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  s3Key: string;
  s3Url: string;
  thumbnail?: string;
  uploadedAt: Date;
}

// Evidence document in MongoDB
export interface EvidenceDocument {
  _id?: string;
  complaintId: string;
  entityType: 'COMPLAINT';
  files: EvidenceFile[];
  createdAt: Date;
  updatedAt: Date;
}

// Create complaint request
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

// Update status request
export interface UpdateStatusRequest {
  status: ComplaintStatus;
  notes?: string;
  estimatedResolutionDays?: number;
}

// Feedback request
export interface FeedbackRequest {
  rating: number; // 1-5
  feedback?: string;
}

// Search filters
export interface ComplaintSearchFilters {
  citizenId?: string;
  assignedTo?: string;
  status?: ComplaintStatus[];
  category?: string[];
  district?: string;
  state?: string;
  priority?: ComplaintPriority[];
  isEscalated?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'priority';
  order?: 'asc' | 'desc';
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
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Complaint with evidence
export interface ComplaintWithEvidence extends Complaint {
  evidence?: EvidenceFile[];
}

// Department mapping
export const DEPARTMENT_MAPPING: Record<string, string> = {
  'Water Supply': 'Water Works Department',
  'Roads & Infrastructure': 'Public Works Department',
  'Electricity': 'Electricity Board',
  'Sanitation': 'Health Department',
  'Street Lights': 'Municipal Corporation',
  'Drainage': 'Public Works Department',
  'Garbage Collection': 'Solid Waste Management',
  'Public Transport': 'Transport Department',
  'Health Services': 'Health Department',
  'Education': 'Education Department',
  'Other': 'General Administration',
};
