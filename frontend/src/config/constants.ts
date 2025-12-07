// API Configuration - Using Unified API Gateway
export const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:4000';
export const API_BASE_URL = `${API_GATEWAY_URL}/api/auth`;
export const COMPLAINT_SERVICE_URL = `${API_GATEWAY_URL}/api/complaints`;
export const CRIME_SERVICE_URL = `${API_GATEWAY_URL}/api/crime`;
export const EMPLOYMENT_SERVICE_URL = `${API_GATEWAY_URL}/api/employment`;
export const CORRUPTION_SERVICE_URL = `${API_GATEWAY_URL}/api/corruption`;

// App Configuration
export const APP_NAME = 'India One-Gov Platform';
export const APP_SHORT_NAME = 'IOG';

// File Upload Configuration
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'video/mp4'];
export const MAX_FILES = 5;

// Complaint Categories - Comprehensive List
export const COMPLAINT_CATEGORIES = [
  // Infrastructure & Utilities
  'Water Supply',
  'Roads & Infrastructure',
  'Electricity',
  'Sanitation',
  'Street Lights',
  'Drainage',
  'Garbage Collection',
  'Public Transport',
  
  // Public Services
  'Health Services',
  'Education',
  'Ration/PDS',
  'Pension Services',
  'Birth/Death Certificate',
  'Property Tax',
  'Building Permits',
  'Land Records',
  
  // Government Employee Misconduct
  'Government Employee Misconduct',
  'Police Misconduct',
  'Bribery/Corruption',
  'Negligence of Duty',
  'Harassment by Officials',
  
  // Politician Related
  'Politician Misconduct',
  'Misuse of Funds',
  'Unfulfilled Promises',
  'Illegal Activities',
  
  // Social Issues
  'Women Safety',
  'Child Welfare',
  'Senior Citizen Issues',
  'Disability Services',
  
  // Other
  'Environmental Issues',
  'Noise Pollution',
  'Illegal Construction',
  'Other',
];

// Complaint Sub-Categories by Main Category
export const COMPLAINT_SUB_CATEGORIES: Record<string, string[]> = {
  'Government Employee Misconduct': [
    'Rude Behavior',
    'Delay in Service',
    'Demanding Bribe',
    'Unauthorized Absence',
    'Misuse of Power',
    'Document Tampering',
  ],
  'Police Misconduct': [
    'Refusing to File FIR',
    'Custodial Violence',
    'Illegal Detention',
    'Demanding Bribe',
    'Negligence',
    'Abuse of Power',
  ],
  'Bribery/Corruption': [
    'Cash Demand',
    'Favor Demand',
    'Kickback',
    'Embezzlement',
    'Nepotism',
  ],
  'Politician Misconduct': [
    'Corruption',
    'Criminal Activities',
    'Hate Speech',
    'Misuse of Position',
    'Electoral Malpractice',
  ],
  'Misuse of Funds': [
    'Development Fund Misuse',
    'Scheme Fund Diversion',
    'Fake Projects',
    'Inflated Bills',
  ],
};

// Indian States
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

// Complaint Status Colors
export const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: '#1976d2',
  ASSIGNED: '#ed6c02',
  IN_PROGRESS: '#9c27b0',
  RESOLVED: '#2e7d32',
  CLOSED: '#616161',
  REJECTED: '#d32f2f',
};

// Priority Colors
export const PRIORITY_COLORS: Record<string, string> = {
  LOW: '#4caf50',
  MEDIUM: '#ff9800',
  HIGH: '#f44336',
  URGENT: '#9c27b0',
};
