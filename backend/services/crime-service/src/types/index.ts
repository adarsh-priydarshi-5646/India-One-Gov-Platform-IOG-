// Crime types
export enum CrimeType {
  MURDER = 'Murder',
  THEFT = 'Theft',
  ROBBERY = 'Robbery',
  ASSAULT = 'Assault',
  KIDNAPPING = 'Kidnapping',
  RAPE = 'Rape',
  CYBERCRIME = 'Cybercrime',
  FRAUD = 'Fraud',
  DOMESTIC_VIOLENCE = 'Domestic Violence',
  DRUG_TRAFFICKING = 'Drug Trafficking',
  HUMAN_TRAFFICKING = 'Human Trafficking',
  TERRORISM = 'Terrorism',
  OTHER = 'Other',
}

// FIR status
export enum FIRStatus {
  REGISTERED = 'REGISTERED',
  UNDER_INVESTIGATION = 'UNDER_INVESTIGATION',
  CHARGE_SHEET_FILED = 'CHARGE_SHEET_FILED',
  TRIAL = 'TRIAL',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

// Case priority
export enum CasePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// Criminal record status
export enum CriminalStatus {
  WANTED = 'WANTED',
  ARRESTED = 'ARRESTED',
  JAILED = 'JAILED',
  RELEASED = 'RELEASED',
  ACQUITTED = 'ACQUITTED',
  CONVICTED = 'CONVICTED',
}

// FIR (First Information Report)
export interface FIR {
  id: string;
  firNumber: string;
  reportedBy: string; // Citizen ID or Anonymous
  reporterName: string;
  reporterContact: string;
  crimeType: CrimeType;
  description: string;
  incidentDate: Date;
  incidentTime?: string;
  locationLat: number;
  locationLng: number;
  address: string;
  state: string;
  district: string;
  policeStation: string;
  status: FIRStatus;
  priority: CasePriority;
  assignedOfficer?: string;
  investigatingOfficerId?: string;
  suspects?: string[];
  victims?: string[];
  witnesses?: string[];
  isAnonymous: boolean;
  evidenceCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Criminal Record
export interface CriminalRecord {
  id: string;
  recordNumber: string;
  fullName: string;
  aliases?: string[];
  aadhaarHash?: string;
  photoUrl?: string;
  fingerprints?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  state?: string;
  district?: string;
  crimesCommitted: string[]; // Crime IDs
  status: CriminalStatus;
  arrestDate?: Date;
  releaseDate?: Date;
  isMostWanted: boolean;
  dangerLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  createdAt: Date;
  updatedAt: Date;
}

// Evidence
export interface CrimeEvidence {
  fileId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  s3Key: string;
  s3Url: string;
  evidenceType: 'PHOTO' | 'VIDEO' | 'DOCUMENT' | 'AUDIO';
  description?: string;
  uploadedBy: string;
  uploadedAt: Date;
}

// API Requests
export interface CreateFIRRequest {
  crimeType: CrimeType;
  description: string;
  incidentDate: string;
  incidentTime?: string;
  locationLat: number;
  locationLng: number;
  address: string;
  state: string;
  district: string;
  policeStation: string;
  reporterName?: string;
  reporterContact?: string;
  isAnonymous?: boolean;
}

export interface UpdateFIRStatusRequest {
  status: FIRStatus;
  notes?: string;
}

export interface CreateCriminalRecordRequest {
  fullName: string;
  aliases?: string[];
  aadhaarNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  state?: string;
  district?: string;
  dangerLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
}

export interface SearchFilters {
  crimeType?: CrimeType[];
  status?: FIRStatus[];
  priority?: CasePriority[];
  district?: string;
  state?: string;
  dateFrom?: Date;
  dateTo?: Date;
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
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CrimeStats {
  total: number;
  registered: number;
  underInvestigation: number;
  chargeSheetFiled: number;
  trial: number;
  closed: number;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
}
