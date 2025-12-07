# 📘 MODULE 2: MICROSERVICES ARCHITECTURE

## Complete Backend Architecture Specification

**Document Version**: 1.0  
**Classification**: Technical Design  
**Target Audience**: Backend Engineers, DevOps, System Architects

---

## Table of Contents

1. [Microservices Overview](#1-microservices-overview)
2. [Auth Service](#2-auth-service)
3. [Complaint Service](#3-complaint-service)
4. [Crime Service](#4-crime-service)
5. [Corruption Service](#5-corruption-service)
6. [Fraud AI Service](#6-fraud-ai-service)
7. [Employment Service](#7-employment-service)
8. [Politician Service](#8-politician-service)
9. [Admin Service](#9-admin-service)
10. [Notification Service](#10-notification-service)
11. [API Gateway](#11-api-gateway)
12. [Inter-Service Communication](#12-inter-service-communication)
13. [Service Discovery & Load Balancing](#13-service-discovery--load-balancing)

---

## 1. Microservices Overview

### 1.1 Architecture Pattern

Each microservice follows **Domain-Driven Design (DDD)** principles with:
- **Clear bounded contexts**
- **Independent data stores**
- **Event-driven communication**
- **RESTful APIs**
- **Service-to-service authentication**

### 1.2 Common Structure

```
service-name/
├── src/
│   ├── controllers/       # HTTP request handlers
│   ├── services/          # Business logic
│   ├── models/            # Data models
│   ├── repositories/      # Data access layer
│   ├── middleware/        # Express middleware
│   ├── validators/        # Request validation
│   ├── utils/             # Utility functions
│   ├── config/            # Configuration
│   ├── events/            # Event publishers/consumers
│   └── app.js             # Express app setup
├── tests/
│   ├── unit/
│   └── integration/
├── Dockerfile
├── package.json
└── README.md
```

### 1.3 Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | 18 LTS |
| Framework | Express.js | 4.18+ |
| Language | TypeScript | 5.0+ |
| Validation | Joi / Zod | Latest |
| ORM (SQL) | Prisma | 5.0+ |
| ODM (Mongo) | Mongoose | 7.0+ |
| Testing | Jest | 29.0+ |
| API Docs | Swagger/OpenAPI | 3.0 |

---

## 2. Auth Service

### 2.1 Purpose

Centralized authentication and authorization service handling:
- User registration and login
- Aadhaar eKYC verification
- JWT token generation and validation
- Session management
- Role-based access control (RBAC)
- Password management
- Multi-factor authentication (MFA)

### 2.2 Technology Stack

- **Runtime**: Node.js + Express
- **Database**: PostgreSQL (user data), Redis (sessions)
- **Auth Library**: Passport.js, jsonwebtoken
- **Password Hashing**: bcrypt
- **Aadhaar Integration**: UIDAI eKYC API

### 2.3 Data Models

#### 2.3.1 User Model (PostgreSQL)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aadhaar_hash VARCHAR(255) UNIQUE NOT NULL,  -- Hashed Aadhaar number
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    address TEXT,
    state VARCHAR(100),
    district VARCHAR(100),
    pincode VARCHAR(6),
    role VARCHAR(50) NOT NULL,  -- CITIZEN, OFFICER, POLITICIAN, ADMIN
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    password_hash VARCHAR(255) NOT NULL,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### 2.3.2 Session Model (Redis)

```javascript
// Redis key: session:{userId}
{
  "userId": "uuid",
  "deviceId": "string",
  "ipAddress": "string",
  "userAgent": "string",
  "refreshToken": "jwt",
  "expiresAt": "timestamp",
  "createdAt": "timestamp"
}
// TTL: 7 days
```

#### 2.3.3 Audit Log Model (PostgreSQL)

```sql
CREATE TABLE auth_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL,  -- LOGIN, LOGOUT, PASSWORD_CHANGE, etc.
    ip_address INET,
    user_agent TEXT,
    status VARCHAR(20),  -- SUCCESS, FAILURE
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_user_id ON auth_audit_logs(user_id);
CREATE INDEX idx_audit_created_at ON auth_audit_logs(created_at);
```

### 2.4 API Endpoints

#### 2.4.1 POST /api/auth/register
**Description**: Register new user with Aadhaar verification

**Request Body**:
```json
{
  "aadhaarNumber": "123456789012",
  "phoneNumber": "+919876543210",
  "email": "[email protected]",
  "password": "SecureP@ssw0rd",
  "role": "CITIZEN"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "OTP sent to registered mobile number",
  "data": {
    "userId": "uuid",
    "verificationRequired": true
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid Aadhaar or validation errors
- `409 Conflict`: User already exists
- `503 Service Unavailable`: Aadhaar service down

---

#### 2.4.2 POST /api/auth/verify-otp
**Description**: Verify OTP sent during registration

**Request Body**:
```json
{
  "userId": "uuid",
  "otp": "123456"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Account verified successfully",
  "data": {
    "accessToken": "jwt-token",
    "refreshToken": "jwt-refresh-token",
    "user": {
      "id": "uuid",
      "fullName": "John Doe",
      "role": "CITIZEN",
      "email": "[email protected]"
    }
  }
}
```

---

#### 2.4.3 POST /api/auth/login
**Description**: Login with phone/email and password

**Request Body**:
```json
{
  "identifier": "+919876543210",  // Phone or email
  "password": "SecureP@ssw0rd",
  "deviceId": "device-fingerprint"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt-token",
    "refreshToken": "jwt-refresh-token",
    "user": {
      "id": "uuid",
      "fullName": "John Doe",
      "role": "CITIZEN",
      "twoFactorRequired": false
    }
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid credentials
- `403 Forbidden`: Account suspended
- `429 Too Many Requests`: Rate limit exceeded

---

#### 2.4.4 POST /api/auth/refresh
**Description**: Refresh access token using refresh token

**Request Headers**:
```
Authorization: Bearer {refreshToken}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "accessToken": "new-jwt-token"
  }
}
```

---

#### 2.4.5 POST /api/auth/logout
**Description**: Logout and invalidate session

**Request Headers**:
```
Authorization: Bearer {accessToken}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### 2.4.6 POST /api/auth/forgot-password
**Description**: Initiate password reset

**Request Body**:
```json
{
  "phoneNumber": "+919876543210"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "OTP sent to registered mobile number"
}
```

---

#### 2.4.7 POST /api/auth/reset-password
**Description**: Reset password with OTP

**Request Body**:
```json
{
  "phoneNumber": "+919876543210",
  "otp": "123456",
  "newPassword": "NewSecureP@ssw0rd"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

#### 2.4.8 GET /api/auth/me
**Description**: Get current user profile

**Request Headers**:
```
Authorization: Bearer {accessToken}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "[email protected]",
    "phoneNumber": "+919876543210",
    "role": "CITIZEN",
    "state": "Maharashtra",
    "district": "Mumbai",
    "isVerified": true,
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

---

### 2.5 Business Logic

#### 2.5.1 Aadhaar eKYC Integration

```typescript
interface AadhaarVerificationRequest {
  aadhaarNumber: string;
  consent: boolean;
}

interface AadhaarVerificationResponse {
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

class AadhaarService {
  async verifyAadhaar(request: AadhaarVerificationRequest): Promise<AadhaarVerificationResponse> {
    // 1. Validate Aadhaar number (12 digits, Verhoeff algorithm)
    if (!this.isValidAadhaar(request.aadhaarNumber)) {
      throw new Error('Invalid Aadhaar number');
    }

    // 2. Check consent
    if (!request.consent) {
      throw new Error('Aadhaar verification requires user consent');
    }

    // 3. Call UIDAI eKYC API
    const response = await axios.post(UIDAI_API_ENDPOINT, {
      aadhaarNumber: request.aadhaarNumber,
      // Include digital signature and encryption
    }, {
      headers: {
        'Authorization': `Bearer ${UIDAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    // 4. Decrypt response and return
    return this.decryptAadhaarResponse(response.data);
  }

  private isValidAadhaar(aadhaar: string): boolean {
    // Implement Verhoeff algorithm validation
    return /^\d{12}$/.test(aadhaar) && this.verhoeffCheck(aadhaar);
  }
}
```

#### 2.5.2 JWT Token Generation

```typescript
interface TokenPayload {
  userId: string;
  role: string;
  deviceId: string;
}

class TokenService {
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '15m',
      issuer: 'iog-platform',
      audience: 'iog-services'
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
      issuer: 'iog-platform',
      audience: 'iog-services'
    });
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired token');
    }
  }
}
```

#### 2.5.3 RBAC Implementation

```typescript
enum Role {
  CITIZEN = 'CITIZEN',
  OFFICER = 'OFFICER',
  POLITICIAN = 'POLITICIAN',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

enum Permission {
  // Complaint permissions
  CREATE_COMPLAINT = 'CREATE_COMPLAINT',
  VIEW_OWN_COMPLAINT = 'VIEW_OWN_COMPLAINT',
  VIEW_ALL_COMPLAINTS = 'VIEW_ALL_COMPLAINTS',
  UPDATE_COMPLAINT_STATUS = 'UPDATE_COMPLAINT_STATUS',
  
  // Crime permissions
  FILE_FIR = 'FILE_FIR',
  MANAGE_CASES = 'MANAGE_CASES',
  
  // Admin permissions
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  MANAGE_USERS = 'MANAGE_USERS',
}

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.CITIZEN]: [
    Permission.CREATE_COMPLAINT,
    Permission.VIEW_OWN_COMPLAINT,
    Permission.FILE_FIR
  ],
  [Role.OFFICER]: [
    Permission.VIEW_ALL_COMPLAINTS,
    Permission.UPDATE_COMPLAINT_STATUS,
    Permission.MANAGE_CASES
  ],
  [Role.POLITICIAN]: [
    Permission.VIEW_ANALYTICS
  ],
  [Role.ADMIN]: [
    Permission.VIEW_ALL_COMPLAINTS,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_USERS
  ],
  [Role.SUPER_ADMIN]: Object.values(Permission)
};

class RBACService {
  hasPermission(role: Role, permission: Permission): boolean {
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
  }

  async checkPermission(userId: string, permission: Permission): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    return this.hasPermission(user.role as Role, permission);
  }
}
```

### 2.6 Security Considerations

1. **Password Storage**: bcrypt with salt rounds = 12
2. **Token Storage**: 
   - Access tokens: Client-side (memory/state, not localStorage)
   - Refresh tokens: HTTP-only secure cookies
3. **Rate Limiting**:
   - Login attempts: 5 per 15 minutes per IP
   - OTP requests: 3 per hour per phone number
4. **Aadhaar Security**:
   - Store only hashed Aadhaar (SHA-256)
   - Never log Aadhaar numbers
   - Comply with UIDAI regulations
5. **Audit Logging**: Log all auth events

### 2.7 Message Queue Events

**Published Events**:
- `user.registered`: When new user signs up
- `user.verified`: When user completes verification
- `user.logged_in`: When user logs in
- `user.password_changed`: When password is reset

**Event Schema**:
```json
{
  "eventType": "user.registered",
  "timestamp": "2025-12-07T20:00:00Z",
  "data": {
    "userId": "uuid",
    "role": "CITIZEN",
    "phoneNumber": "+919876543210"
  }
}
```

---

## 3. Complaint Service

### 3.1 Purpose

Manage citizen complaints with:
- Complaint filing and tracking
- Evidence upload and management
- Department routing
- Status updates
- Escalation workflows
- Satisfaction surveys

### 3.2 Technology Stack

- **Runtime**: Node.js + Express
- **Database**: PostgreSQL (complaints), MongoDB (evidence metadata), Elasticsearch (search)
- **Storage**: AWS S3 (evidence files)
- **Queue**: Bull (background jobs)

### 3.3 Data Models

#### 3.3.1 Complaint Model (PostgreSQL)

```sql
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_number VARCHAR(20) UNIQUE NOT NULL,  -- AUTO-GENERATED: IOG-CMP-2025-000001
    citizen_id UUID NOT NULL REFERENCES users(id),
    category VARCHAR(100) NOT NULL,  -- Water, Roads, Electricity, Sanitation, etc.
    sub_category VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    address TEXT NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    pincode VARCHAR(6),
    department VARCHAR(100),  -- Auto-assigned based on category
    priority VARCHAR(20) DEFAULT 'MEDIUM',  -- LOW, MEDIUM, HIGH, URGENT
    status VARCHAR(50) DEFAULT 'SUBMITTED',  -- SUBMITTED, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED, REJECTED
    assigned_to UUID REFERENCES users(id),
    assigned_at TIMESTAMP,
    resolved_at TIMESTAMP,
    closed_at TIMESTAMP,
    resolution_notes TEXT,
    citizen_rating INTEGER,  -- 1-5 stars
    citizen_feedback TEXT,
    estimated_resolution_days INTEGER,
    is_escalated BOOLEAN DEFAULT FALSE,
    escalated_at TIMESTAMP,
    sentiment_score DECIMAL(3, 2),  -- AI-generated sentiment (-1 to 1)
    urgency_score DECIMAL(3, 2),  -- AI-generated urgency (0 to 1)
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_complaints_citizen ON complaints(citizen_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_district ON complaints(district);
CREATE INDEX idx_complaints_created_at ON complaints(created_at);
```

#### 3.3.2 Complaint Evidence (MongoDB)

```javascript
{
  "_id": ObjectId,
  "complaintId": "uuid",
  "files": [
    {
      "fileId": "uuid",
      "fileName": "pothole-photo.jpg",
      "fileType": "image/jpeg",
      "fileSize": 2048576,  // bytes
      "s3Key": "complaints/2025/12/uuid/filename.jpg",
      "s3Url": "https://s3.amazonaws.com/...",
      "uploadedAt": ISODate,
      "thumbnail": "https://s3.amazonaws.com/.../thumbnail.jpg"
    }
  ],
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

#### 3.3.3 Complaint Status History (PostgreSQL)

```sql
CREATE TABLE complaint_status_history (
    id BIGSERIAL PRIMARY KEY,
    complaint_id UUID NOT NULL REFERENCES complaints(id),
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by UUID REFERENCES users(id),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_status_history_complaint ON complaint_status_history(complaint_id);
```

### 3.4 API Endpoints

#### 3.4.1 POST /api/complaints
**Description**: File a new complaint

**Request Headers**:
```
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data
```

**Request Body** (multipart/form-data):
```
category: Water Supply
title: No water supply for 3 days
description: Water supply has been disrupted...
address: 123 MG Road, Andheri West
state: Maharashtra
district: Mumbai
pincode: 400058
locationLat: 19.1334
locationLng: 72.8326
files[]: [file1.jpg, file2.jpg]
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Complaint filed successfully",
  "data": {
    "id": "uuid",
    "complaintNumber": "IOG-CMP-2025-000001",
    "status": "SUBMITTED",
    "department": "Water Supply Department",
    "estimatedResolutionDays": 7,
    "createdAt": "2025-12-07T20:00:00Z"
  }
}
```

---

#### 3.4.2 GET /api/complaints
**Description**: Get user's complaints (citizens) or assigned complaints (officers)

**Request Headers**:
```
Authorization: Bearer {accessToken}
```

**Query Parameters**:
```
?page=1&limit=20&status=IN_PROGRESS&category=Water&sortBy=createdAt&order=desc
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "complaints": [
      {
        "id": "uuid",
        "complaintNumber": "IOG-CMP-2025-000001",
        "category": "Water Supply",
        "title": "No water supply for 3 days",
        "status": "IN_PROGRESS",
        "priority": "HIGH",
        "createdAt": "2025-12-07T20:00:00Z",
        "estimatedResolutionDays": 7
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalPages": 5,
      "totalItems": 95
    }
  }
}
```

---

#### 3.4.3 GET /api/complaints/:id
**Description**: Get complaint details

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "complaintNumber": "IOG-CMP-2025-000001",
    "citizen": {
      "id": "uuid",
      "name": "John Doe",
      "phoneNumber": "+919876543210"
    },
    "category": "Water Supply",
    "title": "No water supply for 3 days",
    "description": "Detailed description...",
    "location": {
      "lat": 19.1334,
      "lng": 72.8326,
      "address": "123 MG Road, Andheri West"
    },
    "department": "Water Supply Department",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "assignedTo": {
      "id": "uuid",
      "name": "Officer Name"
    },
    "evidence": [
      {
        "fileId": "uuid",
        "fileName": "evidence1.jpg",
        "url": "https://s3....",
        "thumbnail": "https://s3.../thumb.jpg"
      }
    ],
    "statusHistory": [
      {
        "status": "SUBMITTED",
        "timestamp": "2025-12-07T20:00:00Z",
        "comment": null
      },
      {
        "status": "ASSIGNED",
        "timestamp": "2025-12-07T21:00:00Z",
        "comment": "Assigned to field officer"
      }
    ],
    "createdAt": "2025-12-07T20:00:00Z",
    "updatedAt": "2025-12-07T21:00:00Z"
  }
}
```

---

#### 3.4.4 PUT /api/complaints/:id/status
**Description**: Update complaint status (Officers only)

**Request Body**:
```json
{
  "status": "RESOLVED",
  "comment": "Water supply has been restored",
  "resolutionNotes": "Repaired main pipeline"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Complaint status updated",
  "data": {
    "id": "uuid",
    "status": "RESOLVED",
    "resolvedAt": "2025-12-10T15:00:00Z"
  }
}
```

---

#### 3.4.5 POST /api/complaints/:id/feedback
**Description**: Submit complaint feedback (Citizens only, after resolution)

**Request Body**:
```json
{
  "rating": 5,
  "feedback": "Issue resolved quickly. Great service!"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Feedback submitted. Thank you!"
}
```

---

#### 3.4.6 POST /api/complaints/:id/escalate
**Description**: Escalate complaint (Auto or manual)

**Request Body**:
```json
{
  "reason": "No response for 10 days"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Complaint escalated to senior authority"
}
```

---

#### 3.4.7 GET /api/complaints/search
**Description**: Search complaints (Elasticsearch)

**Query Parameters**:
```
?q=water+supply&state=Maharashtra&district=Mumbai&from=2025-01-01&to=2025-12-31
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "uuid",
        "complaintNumber": "IOG-CMP-2025-000001",
        "title": "No water supply for 3 days",
        "status": "RESOLVED",
        "score": 0.95  // Elasticsearch relevance score
      }
    ],
    "totalResults": 45
  }
}
```

---

### 3.5 Business Logic

#### 3.5.1 Auto Department Routing

```typescript
class ComplaintRoutingService {
  private categoryDepartmentMap: Record<string, string> = {
    'Water Supply': 'Municipal Water Department',
    'Roads & Infrastructure': 'Public Works Department',
    'Electricity': 'State Electricity Board',
    'Sanitation': 'Sanitation Department',
    'Street Lights': 'Municipal Corporation',
    'Pollution': 'Pollution Control Board'
  };

  assignDepartment(category: string, district: string): string {
    const department = this.categoryDepartmentMap[category];
    if (!department) {
      throw new Error(`No department mapped for category: ${category}`);
    }
    return `${department} - ${district}`;
  }

  async assignToOfficer(complaintId: string, department: string): Promise<void> {
    // Load balancing: Assign to officer with least pending cases
    const officer = await this.userRepository.findOfficerWithLeastLoad(department);
    
    await this.complaintRepository.update(complaintId, {
      assignedTo: officer.id,
      assignedAt: new Date(),
      status: 'ASSIGNED'
    });

    // Send notification to officer
    await this.notificationService.send({
      userId: officer.id,
      type: 'COMPLAINT_ASSIGNED',
      data: { complaintId }
    });
  }
}
```

#### 3.5.2 Escalation Logic

```typescript
class ComplaintEscalationService {
  async checkAndEscalate(): Promise<void> {
    // Run as cron job every 6 hours
    const escalationRules = [
      { priority: 'URGENT', hours: 24 },
      { priority: 'HIGH', hours: 72 },
      { priority: 'MEDIUM', hours: 168 },  // 7 days
      { priority: 'LOW', hours: 336 }      // 14 days
    ];

    for (const rule of escalationRules) {
      const complaints = await this.complaintRepository.findStaleComplaints(
        rule.priority,
        rule.hours
      );

      for (const complaint of complaints) {
        await this.escalateComplaint(complaint.id);
      }
    }
  }

  private async escalateComplaint(complaintId: string): Promise<void> {
    // Mark as escalated
    await this.complaintRepository.update(complaintId, {
      isEscalated: true,
      escalatedAt: new Date(),
      priority: this.increasePriority(complaint.priority)
    });

    // Notify senior officials
    await this.notificationService.sendEscalationAlert(complaintId);
  }
}
```

#### 3.5.3 Sentiment & Urgency Scoring (AI Integration)

```typescript
class ComplaintAIService {
  async analyzeComplaint(description: string): Promise<{
    sentimentScore: number;
    urgencyScore: number;
    suggestedPriority: string;
  }> {
    // Call AI/ML service
    const response = await axios.post('http://fraud-ai-service/api/sentiment', {
      text: description
    });

    const { sentiment, urgency } = response.data;

    // Determine priority based on scores
    let priority = 'MEDIUM';
    if (urgency > 0.8 || sentiment < -0.6) priority = 'URGENT';
    else if (urgency > 0.6 || sentiment < -0.4) priority = 'HIGH';
    else if (urgency < 0.3 && sentiment > 0) priority = 'LOW';

    return {
      sentimentScore: sentiment,
      urgencyScore: urgency,
      suggestedPriority: priority
    };
  }
}
```

### 3.6 Message Queue Events

**Published Events**:
- `complaint.created`
- `complaint.assigned`
- `complaint.status_updated`
- `complaint.resolved`
- `complaint.escalated`
- `complaint.feedback_submitted`

---

## 4. Crime Service

### 4.1 Purpose

Manage crime reporting and FIR system:
- Online FIR registration
- Case investigation tracking
- Evidence management
- Crime analytics and hotspot mapping
- Officer case assignment

### 4.2 Technology Stack

- **Runtime**: Node.js + Express
- **Database**: PostgreSQL (FIRs, cases), MongoDB (investigation docs), Elasticsearch (geo-search)
- **Storage**: AWS S3 (evidence)
- **Maps**: Mapbox API (crime heatmaps)

### 4.3 Data Models

#### 4.3.1 FIR Model (PostgreSQL)

```sql
CREATE TABLE firs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fir_number VARCHAR(30) UNIQUE NOT NULL,  -- IOG-FIR-MH-MUM-2025-00001
    complainant_id UUID NOT NULL REFERENCES users(id),
    complainant_name VARCHAR(255) NOT NULL,
    complainant_phone VARCHAR(15) NOT NULL,
    complainant_address TEXT,
    crime_type VARCHAR(100) NOT NULL,  -- Theft, Assault, Fraud, etc.
    crime_category VARCHAR(50) NOT NULL,  -- IPC Section
    incident_description TEXT NOT NULL,
    incident_date TIMESTAMP NOT NULL,
    incident_time TIME,
    incident_location_lat DECIMAL(10, 8) NOT NULL,
    incident_location_lng DECIMAL(11, 8) NOT NULL,
    incident_address TEXT NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    police_station VARCHAR(255) NOT NULL,
    fir_status VARCHAR(50) DEFAULT 'REGISTERED',  -- REGISTERED, UNDER_INVESTIGATION, CHARGE_SHEET_FILED, CLOSED
    investigating_officer_id UUID REFERENCES users(id),
    assigned_at TIMESTAMP,
    closed_at TIMESTAMP,
    closure_reason TEXT,
    suspect_details JSONB,  -- Array of suspect information
    witness_details JSONB,  -- Array of witness information
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_firs_complainant ON firs(complainant_id);
CREATE INDEX idx_firs_status ON firs(fir_status);
CREATE INDEX idx_firs_crime_type ON firs(crime_type);
CREATE INDEX idx_firs_location ON firs USING GIST (
    ll_to_earth(incident_location_lat, incident_location_lng)
);
```

#### 4.3.2 Case Investigation (MongoDB)

```javascript
{
  "_id": ObjectId,
  "firId": "uuid",
  "firNumber": "IOG-FIR-MH-MUM-2025-00001",
  "timeline": [
    {
      "timestamp": ISODate,
      "event": "Witness interrogated",
      "description": "Statement recorded from witness A",
      "officerId": "uuid",
      "evidenceAttached": ["evidence-id-1"]
    }
  ],
  "evidence": [
    {
      "evidenceId": "uuid",
      "type": "PHOTOGRAPH",
      "description": "Crime scene photo",
      "s3Url": "https://s3...",
      "collectedBy": "uuid",
      "collectedAt": ISODate,
      "chainOfCustody": [
        {
          "transferredFrom": "uuid",
          "transferredTo": "uuid",
          "timestamp": ISODate,
          "reason": "Lab analysis"
        }
      ]
    }
  ],
  "suspects": [
    {
      "suspectId": "uuid",
      "name": "Suspect Name",
      "age": 30,
      "description": "...",
      "arrested": true,
      "arrestDate": ISODate
    }
  ],
  "notes": [
    {
      "noteId": "uuid",
      "content": "Investigation update...",
      "createdBy": "uuid",
      "createdAt": ISODate,
      "isConfidential": true
    }
  ],
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### 4.4 API Endpoints

#### 4.4.1 POST /api/crime/fir
**Description**: File FIR online

**Request Body**:
```json
{
  "crimeType": "Theft",
  "crimeCategory": "IPC 379",
  "incidentDescription": "My motorcycle was stolen...",
  "incidentDate": "2025-12-07T18:00:00Z",
  "incidentLocation": {
    "lat": 19.0760,
    "lng": 72.8777,
    "address": "Near Gateway of India, Colaba"
  },
  "policeStation": "Colaba Police Station",
  "witnessDetails": [
    {
      "name": "Witness Name",
      "phone": "+919876543210",
      "statement": "I saw..."
    }
  ]
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "FIR registered successfully",
  "data": {
    "id": "uuid",
    "firNumber": "IOG-FIR-MH-MUM-2025-00001",
    "status": "REGISTERED",
    "policeStation": "Colaba Police Station",
    "createdAt": "2025-12-07T20:00:00Z"
  }
}
```

---

#### 4.4.2 GET /api/crime/fir/:id
**Description**: Get FIR details

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firNumber": "IOG-FIR-MH-MUM-2025-00001",
    "complainant": {
      "name": "John Doe",
      "phone": "+919876543210"
    },
    "crimeType": "Theft",
    "incidentDate": "2025-12-07T18:00:00Z",
    "incidentLocation": {
      "lat": 19.0760,
      "lng": 72.8777,
      "address": "Near Gateway of India"
    },
    "status": "UNDER_INVESTIGATION",
    "investigatingOfficer": {
      "id": "uuid",
      "name": "Inspector Sharma",
      "badgeNumber": "MUM-12345"
    },
    "timeline": [
      {
        "timestamp": "2025-12-07T20:00:00Z",
        "event": "FIR Registered"
      },
      {
        "timestamp": "2025-12-08T10:00:00Z",
        "event": "Assigned to investigating officer"
      }
    ]
  }
}
```

---

#### 4.4.3 GET /api/crime/hotspots
**Description**: Get crime hotspots for heatmap

**Query Parameters**:
```
?state=Maharashtra&district=Mumbai&crimeType=Theft&from=2025-01-01&to=2025-12-31&radius=10
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "hotspots": [
      {
        "location": {
          "lat": 19.0760,
          "lng": 72.8777
        },
        "crimeCount": 45,
        "intensity": 0.85,  // 0-1 scale
        "predominantCrimeType": "Theft"
      }
    ],
    "heatmapData": [
      {
        "lat": 19.0760,
        "lng": 72.8777,
        "weight": 45
      }
    ]
  }
}
```

---

#### 4.4.4 POST /api/crime/cases/:id/update
**Description**: Update investigation (Officers only)

**Request Body**:
```json
{
  "event": "Witness interrogated",
  "description": "Statement recorded",
  "evidenceFiles": ["file1.jpg"],
  "isConfidential": false
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Investigation updated successfully"
}
```

---

### 4.5 Business Logic

#### 4.5.1 Auto Police Station Assignment

```typescript
class PoliceStationService {
  async findNearestPoliceStation(lat: number, lng: number): Promise<{
    name: string;
    jurisdiction: string;
    phone: string;
  }> {
    // Query PostgreSQL with PostGIS extension
    const result = await this.db.query(`
      SELECT name, jurisdiction, phone, 
             earth_distance(
               ll_to_earth($1, $2),
               ll_to_earth(latitude, longitude)
             ) AS distance
      FROM police_stations
      ORDER BY distance
      LIMIT 1
    `, [lat, lng]);

    return result.rows[0];
  }
}
```

#### 4.5.2 Crime Hotspot Analysis

```typescript
class CrimeAnalyticsService {
  async generateHotspots(filters: {
    state: string;
    district: string;
    crimeType?: string;
    fromDate: Date;
    toDate: Date;
  }): Promise<Hotspot[]> {
    // Fetch crimes in date range
    const crimes = await this.firRepository.findByFilters(filters);

    // DBSCAN clustering
    const clusters = this.dbscanCluster(crimes.map(c => ({
      lat: c.incidentLocationLat,
      lng: c.incidentLocationLng
    })), {
      epsilon: 0.5,  // 500m radius
      minPoints: 3
    });

    // Calculate intensity
    return clusters.map(cluster => ({
      location: cluster.centroid,
      crimeCount: cluster.points.length,
      intensity: this.calculateIntensity(cluster.points.length),
      predominantCrimeType: this.getMostCommonType(cluster.crimes)
    }));
  }

  private calculateIntensity(count: number): number {
    // Normalize to 0-1 scale using sigmoid
    const maxExpected = 100;
    return 1 / (1 + Math.exp(-(count - maxExpected/2) / 10));
  }
}
```

### 4.6 Message Queue Events

**Published Events**:
- `fir.registered`
- `fir.assigned`
- `case.updated`
- `case.closed`
- `evidence.uploaded`

---

## 5. Corruption Service

### 5.1 Purpose

Enable corruption reporting with:
- Anonymous reporting capability
- Evidence collection
- Whistleblower protection
- AI fraud pattern detection
- Investigation tracking

### 5.2 Technology Stack

- **Runtime**: Node.js + Express
- **Database**: PostgreSQL (reports), MongoDB (anonymous evidence)
- **Encryption**: AES-256 for anonymous reporter protection
- **AI**: Integration with Fraud AI Service

### 5.3 Data Models

#### 5.3.1 Corruption Report (PostgreSQL)

```sql
CREATE TABLE corruption_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_number VARCHAR(30) UNIQUE NOT NULL,
    reporter_id UUID REFERENCES users(id),  -- NULL for anonymous
    is_anonymous BOOLEAN DEFAULT FALSE,
    anonymous_reporter_token VARCHAR(255),  -- Encrypted token for anonymous tracking
    corruption_type VARCHAR(100) NOT NULL,  -- Bribery, Embezzlement, Nepotism, etc.
    accused_name VARCHAR(255),
    accused_designation VARCHAR(255),
    accused_department VARCHAR(255),
    incident_description TEXT NOT NULL,
    incident_date DATE,
    incident_location TEXT,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    monetary_value DECIMAL(15, 2),  -- Estimated bribe/loss amount
    report_status VARCHAR(50) DEFAULT 'SUBMITTED',  -- SUBMITTED, UNDER_REVIEW, INVESTIGATING, CLOSED
    assigned_to UUID REFERENCES users(id),  -- Anti-corruption bureau officer
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    fraud_risk_score DECIMAL(3, 2),  -- AI-generated risk score (0-1)
    pattern_match_id UUID,  -- If matched with existing fraud pattern
    investigation_outcome TEXT,
    closed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_corruption_reporter ON corruption_reports(reporter_id);
CREATE INDEX idx_corruption_status ON corruption_reports(report_status);
CREATE INDEX idx_corruption_accused_dept ON corruption_reports(accused_department);
```

#### 5.3.2 Anonymous Evidence (MongoDB)

```javascript
{
  "_id": ObjectId,
  "reportId": "uuid",
  "encryptedMetadata": "...",  // Encrypted to protect anonymity
  "files": [
    {
      "fileId": "uuid",
      "s3Key": "encrypted-evidence/uuid/file.enc",
      "fileHash": "sha256-hash",
      "uploadedAt": ISODate
    }
  ],
  "accessLog": [
    {
      "accessedBy": "uuid",
      "accessedAt": ISODate,
      "purpose": "Investigation"
    }
  ]
}
```

### 5.4 API Endpoints

#### 5.4.1 POST /api/corruption/report
**Description**: File corruption report (authenticated or anonymous)

**Request Body**:
```json
{
  "isAnonymous": true,
  "corruptionType": "Bribery",
  "accusedName": "Officer Name",
  "accusedDesignation": "Municipal Inspector",
  "accusedDepartment": "Building Permission Department",
  "incidentDescription": "Asked for Rs 50,000 bribe...",
  "incidentDate": "2025-12-01",
  "monetaryValue": 50000,
  "evidenceFiles": ["base64-encoded-file"]
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Corruption report filed successfully. Your identity is protected.",
  "data": {
    "reportNumber": "IOG-COR-2025-00001",
    "anonymousToken": "encrypted-token-for-tracking",  // If anonymous
    "status": "SUBMITTED",
    "trackingInstructions": "Save this token to track your report anonymously"
  }
}
```

---

#### 5.4.2 GET /api/corruption/track/:token
**Description**: Track anonymous report

**Request Headers**:
```
X-Anonymous-Token: {encrypted-token}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "reportNumber": "IOG-COR-2025-00001",
    "status": "UNDER_REVIEW",
    "submittedAt": "2025-12-07T20:00:00Z",
    "lastUpdated": "2025-12-08T15:00:00Z",
    "statusMessage": "Your report is being reviewed by anti-corruption bureau"
  }
}
```

---

#### 5.4.3 GET /api/corruption/analytics
**Description**: Get corruption analytics (Admin only)

**Query Parameters**:
```
?state=All&district=All&department=All&from=2025-01-01&to=2025-12-31
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "totalReports": 1250,
    "byStatus": {
      "SUBMITTED": 200,
      "INVESTIGATING": 450,
      "CLOSED": 600
    },
    "byDepartment": {
      "Building Permission": 320,
      "Land Records": 280,
      "Police": 150
    },
    "byType": {
      "Bribery": 780,
      "Embezzlement": 320,
      "Nepotism": 150
    },
    "totalMonetaryValue": 125000000,
    "topAccusedDepartments": [
      {
        "department": "Building Permission",
        "count": 320,
        "totalValue": 45000000
      }
    ]
  }
}
```

---

### 5.5 Business Logic

#### 5.5.1 Anonymous Reporter Protection

```typescript
class AnonymousReportingService {
  async generateAnonymousToken(reportId: string): Promise<string> {
    const crypto = require('crypto');
    
    // Generate random identifier
    const randomId = crypto.randomBytes(32).toString('hex');
    
    // Encrypt with report ID
    const cipher = crypto.createCipher('aes-256-gcm', process.env.ENCRYPTION_KEY!);
    const encrypted = cipher.update(`${reportId}:${randomId}`, 'utf8', 'hex');
    
    return encrypted + cipher.final('hex');
  }

  async verifyAnonymousToken(token: string): Promise<string | null> {
    try {
      const decipher = crypto.createDecipher('aes-256-gcm', process.env.ENCRYPTION_KEY!);
      const decrypted = decipher.update(token, 'hex', 'utf8') + decipher.final('utf8');
      
      const [reportId] = decrypted.split(':');
      return reportId;
    } catch (error) {
      return null;
    }
  }
}
```

#### 5.5.2 Fraud Pattern Detection (AI Integration)

```typescript
class CorruptionAIService {
  async analyzeFraudRisk(report: CorruptionReport): Promise<{
    riskScore: number;
    matchedPattern?: string;
    recommendations: string[];
  }> {
    // Call Fraud AI Service
    const response = await axios.post('http://fraud-ai-service/api/corruption/analyze', {
      description: report.incidentDescription,
      accusedDepartment: report.accusedDepartment,
      monetaryValue: report.monetaryValue,
      location: { state: report.state, district: report.district }
    });

    const { riskScore, patternId, recommendations } = response.data;

    // Update report with AI insights
    await this.corruptionRepository.update(report.id, {
      fraudRiskScore: riskScore,
      patternMatchId: patternId,
      priority: riskScore > 0.8 ? 'URGENT' : riskScore > 0.6 ? 'HIGH' : 'MEDIUM'
    });

    return { riskScore, matchedPattern: patternId, recommendations };
  }

  async detectPatterns(filters: any): Promise<Pattern[]> {
    // Fetch historical corruption data
    const reports = await this.corruptionRepository.findByFilters(filters);

    // Group by accused department, location, type
    const patterns = this.clusterSimilarReports(reports);

    return patterns.map(p => ({
      patternId: p.id,
      description: p.description,
      occurrences: p.reports.length,
      totalValue: p.reports.reduce((sum, r) => sum + r.monetaryValue, 0),
      departments: [...new Set(p.reports.map(r => r.accusedDepartment))]
    }));
  }
}
```

### 5.6 Message Queue Events

**Published Events**:
- `corruption.reported`
- `corruption.high_risk_detected`
- `corruption.pattern_identified`
- `corruption.investigation_started`

---

*Due to length constraints, I'll continue with the remaining services (6-11) in the next section. Would you like me to continue generating the complete documentation for Fraud AI Service, Employment Service, Politician Service, Admin Service, Notification Service, and API Gateway?*

---

**[To be continued with Services 6-11...]**
