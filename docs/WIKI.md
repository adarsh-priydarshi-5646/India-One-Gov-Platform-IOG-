# 📚 India One-Gov Platform - Complete Wiki

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Architecture](#architecture)
4. [Features](#features)
5. [API Documentation](#api-documentation)
6. [Database Schema](#database-schema)
7. [Security](#security)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)
10. [FAQ](#faq)

## Introduction

### What is IOG Platform?

India One-Gov Platform (IOG) is a comprehensive unified e-governance platform designed to provide seamless access to government services, schemes, and information for every Indian citizen.

### Key Features

- **22 Fully Functional Pages**
- **30+ Real Government Schemes**
- **16+ Government Services**
- **6 Indian Languages**
- **RBAC Security System**
- **Real-time Notifications**
- **Location-based Services**

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Material-UI (MUI)
- Redux Toolkit
- React Router v6
- i18next
- Vite

**Backend:**
- Node.js with Express
- TypeScript
- PostgreSQL
- MongoDB
- Redis
- JWT Authentication

**DevOps:**
- Docker & Docker Compose
- GitHub Actions CI/CD
- Nginx
- PM2

## Getting Started

### Prerequisites

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Check PostgreSQL
psql --version

# Check MongoDB
mongod --version

# Check Redis
redis-cli --version
```

### Quick Start

```bash
# Clone repository
git clone https://github.com/adarsh-priydarshi-5646/India-One-Gov-Platform-IOG-.git
cd India-One-Gov-Platform-IOG-

# Install dependencies
npm install

# Setup databases
createdb iog_db

# Start services
npm run dev:all

# Access platform
# Frontend: http://localhost:3000
# API Gateway: http://localhost:4000
```

### Test Credentials

```
Phone: +919876543213
Password: Test@123456
```

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                    (React + TypeScript)                      │
│                     Port: 3000                               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway                             │
│                    (Express + TS)                            │
│                     Port: 4000                               │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┬──────────────┐
        ▼              ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Auth Service │ │  Complaint   │ │    Crime     │ │  Corruption  │
│   Port 3001  │ │   Service    │ │   Service    │ │   Service    │
│              │ │  Port 3002   │ │  Port 3003   │ │  Port 3004   │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │                │
       └────────────────┴────────────────┴────────────────┘
                       │
        ┌──────────────┼──────────────┬──────────────┐
        ▼              ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  PostgreSQL  │ │   MongoDB    │ │    Redis     │ │   Storage    │
│   Port 5432  │ │  Port 27017  │ │  Port 6379   │ │    (S3)      │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

### Microservices

#### 1. Auth Service (Port 3001)
- User registration
- Login/Logout
- JWT token management
- Password reset
- OTP verification

#### 2. Complaint Service (Port 3002)
- File complaints
- Track complaints
- Update status
- Evidence upload
- Location-based routing

#### 3. Crime Service (Port 3003)
- File FIR
- Track FIR status
- Investigation updates
- Evidence management

#### 4. Corruption Service (Port 3004)
- Anonymous reporting
- Secure evidence submission
- ACB routing

#### 5. Employment Service (Port 3005)
- Job listings
- Application management
- Skill matching

#### 6. Notification Service (Port 3006)
- Email notifications
- SMS notifications
- Push notifications
- WhatsApp notifications

## Features

### 1. User Authentication

**Registration:**
```typescript
POST /api/auth/register
{
  "phoneNumber": "+919876543210",
  "email": "user@example.com",
  "password": "SecurePass@123",
  "fullName": "John Doe",
  "aadhaarNumber": "123456789012",
  "state": "Delhi",
  "district": "New Delhi"
}
```

**Login:**
```typescript
POST /api/auth/login
{
  "phoneNumber": "+919876543210",
  "password": "SecurePass@123"
}
```

### 2. Complaint Management

**File Complaint:**
```typescript
POST /api/complaints
{
  "category": "WATER_SUPPLY",
  "title": "No water supply for 3 days",
  "description": "Detailed description...",
  "location": {
    "state": "Delhi",
    "district": "New Delhi",
    "address": "123 Main Street",
    "pincode": "110001",
    "coordinates": {
      "latitude": 28.6139,
      "longitude": 77.2090
    }
  },
  "priority": "HIGH"
}
```

**Track Complaint:**
```typescript
GET /api/complaints/:id
```

### 3. FIR Management

**File FIR:**
```typescript
POST /api/crime/firs
{
  "crimeType": "THEFT",
  "incidentDate": "2024-01-15",
  "incidentTime": "14:30",
  "location": {
    "state": "Delhi",
    "district": "New Delhi",
    "policeStation": "Connaught Place PS",
    "address": "123 Main Street"
  },
  "description": "Detailed incident description...",
  "suspects": [
    {
      "name": "Unknown",
      "description": "Male, 5'8\", wearing black jacket"
    }
  ]
}
```

### 4. Multi-Language Support

Supported Languages:
- English (en)
- Hindi (hi)
- Tamil (ta)
- Telugu (te)
- Bengali (bn)
- Marathi (mr)

**Change Language:**
```typescript
i18n.changeLanguage('hi');
```

### 5. RBAC System

**User Roles:**
- `CITIZEN` - Regular users
- `OFFICER` - Government officers
- `POLITICIAN` - Elected representatives
- `ADMIN` - System administrators
- `SUPER_ADMIN` - Super administrators

**Role Hierarchy:**
```
SUPER_ADMIN (5) > ADMIN (4) > OFFICER (3) > POLITICIAN (2) > CITIZEN (1)
```

**Permission Matrix:**
```typescript
{
  complaint: {
    create: ['CITIZEN', 'OFFICER', 'ADMIN', 'SUPER_ADMIN'],
    read: ['CITIZEN', 'OFFICER', 'POLITICIAN', 'ADMIN', 'SUPER_ADMIN'],
    update: ['OFFICER', 'ADMIN', 'SUPER_ADMIN'],
    delete: ['ADMIN', 'SUPER_ADMIN'],
  },
  fir: {
    create: ['CITIZEN', 'OFFICER', 'ADMIN', 'SUPER_ADMIN'],
    read: ['CITIZEN', 'OFFICER', 'ADMIN', 'SUPER_ADMIN'],
    update: ['OFFICER', 'ADMIN', 'SUPER_ADMIN'],
    delete: ['ADMIN', 'SUPER_ADMIN'],
  }
}
```

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

Request:
{
  "phoneNumber": "+919876543210",
  "email": "user@example.com",
  "password": "SecurePass@123",
  "fullName": "John Doe",
  "aadhaarNumber": "123456789012"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "user_id",
    "message": "OTP sent to your phone"
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "phoneNumber": "+919876543210",
  "password": "SecurePass@123"
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "user": {
      "id": "user_id",
      "fullName": "John Doe",
      "role": "CITIZEN"
    }
  }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer {accessToken}

Response:
{
  "success": true,
  "data": {
    "id": "user_id",
    "fullName": "John Doe",
    "phoneNumber": "+919876543210",
    "email": "user@example.com",
    "role": "CITIZEN"
  }
}
```

### Complaint Endpoints

#### Create Complaint
```
POST /api/complaints
Authorization: Bearer {accessToken}
Content-Type: application/json

Request:
{
  "category": "WATER_SUPPLY",
  "title": "No water supply",
  "description": "Description...",
  "location": {
    "state": "Delhi",
    "district": "New Delhi",
    "address": "123 Main Street",
    "pincode": "110001"
  }
}

Response:
{
  "success": true,
  "data": {
    "id": "complaint_id",
    "complaintNumber": "CMP2024001",
    "status": "SUBMITTED"
  }
}
```

#### Get All Complaints
```
GET /api/complaints?page=1&limit=10&status=PENDING
Authorization: Bearer {accessToken}

Response:
{
  "success": true,
  "data": {
    "complaints": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

#### Get Complaint by ID
```
GET /api/complaints/:id
Authorization: Bearer {accessToken}

Response:
{
  "success": true,
  "data": {
    "id": "complaint_id",
    "complaintNumber": "CMP2024001",
    "category": "WATER_SUPPLY",
    "status": "IN_PROGRESS",
    "timeline": [...]
  }
}
```

## Database Schema

### Users Table (PostgreSQL)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  aadhaar_hash VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'CITIZEN',
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  state VARCHAR(100),
  district VARCHAR(100),
  profile_photo_url TEXT,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### Complaints Table (PostgreSQL)

```sql
CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  category VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'SUBMITTED',
  priority VARCHAR(20) DEFAULT 'MEDIUM',
  state VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  address TEXT,
  pincode VARCHAR(10),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  assigned_to UUID REFERENCES users(id),
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_complaints_user ON complaints(user_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_location ON complaints(state, district);
```

## Security

### Authentication

- JWT-based authentication
- Access token (7 days)
- Refresh token (30 days)
- Secure password hashing (bcrypt)

### Authorization

- Role-Based Access Control (RBAC)
- Permission matrix
- Resource ownership validation
- Jurisdiction-based access

### Data Protection

- HTTPS only
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting
- Input validation

### Privacy

- Aadhaar hashing
- Anonymous corruption reporting
- Data encryption at rest
- Secure file storage

## Deployment

### Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Deployment

```bash
# Build frontend
cd frontend
npm run build

# Build backend services
cd backend/services/auth-service
npm run build

# Start with PM2
pm2 start ecosystem.config.js
```

### Environment Variables

```bash
# Production
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
MONGODB_URI=mongodb://host:27017/db
REDIS_URL=redis://host:6379
JWT_SECRET=your-production-secret
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Error

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -U postgres -h localhost
```

#### 2. Redis Connection Error

```bash
# Check Redis is running
redis-cli ping

# Should return: PONG
```

#### 3. Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

#### 4. Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## FAQ

### General Questions

**Q: Is this platform free to use?**
A: Yes, the platform is completely free and open source.

**Q: How do I contribute?**
A: Check our [CONTRIBUTING.md](CONTRIBUTING.md) guide.

**Q: Which languages are supported?**
A: Currently 6 Indian languages: English, Hindi, Tamil, Telugu, Bengali, and Marathi.

### Technical Questions

**Q: What databases are used?**
A: PostgreSQL for structured data, MongoDB for documents, and Redis for caching.

**Q: How is security handled?**
A: JWT authentication, RBAC authorization, encrypted data, and regular security audits.

**Q: Can I self-host this platform?**
A: Yes, complete deployment instructions are provided.

### Feature Questions

**Q: How many government schemes are included?**
A: 30+ real government schemes with accurate data.

**Q: Can I track my complaint status?**
A: Yes, real-time tracking with notifications.

**Q: Is corruption reporting anonymous?**
A: Yes, completely anonymous with secure evidence submission.

---

**Need more help?** [Open an issue](https://github.com/adarsh-priydarshi-5646/India-One-Gov-Platform-IOG-/issues) or [start a discussion](https://github.com/adarsh-priydarshi-5646/India-One-Gov-Platform-IOG-/discussions)
