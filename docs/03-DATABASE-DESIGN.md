# 📘 MODULE 3: DATABASE DESIGN

## Complete Database Architecture

**Document Version**: 1.0  
**Classification**: Technical Design  
**Database Systems**: PostgreSQL, MongoDB, Redis, Elasticsearch

---

## Table of Contents

1. [Database Architecture Overview](#1-database-architecture-overview)
2. [PostgreSQL Schema](#2-postgresql-schema)
3. [MongoDB Collections](#3-mongodb-collections)
4. [Redis Caching Strategy](#4-redis-caching-strategy)
5. [Elasticsearch Indices](#5-elasticsearch-indices)
6. [Data Migration Strategy](#6-data-migration-strategy)
7. [Backup & Recovery](#7-backup--recovery)

---

## 1. Database Architecture Overview

### 1.1 Database Selection Rationale

| Database | Use Case | Justification |
|----------|----------|---------------|
| **PostgreSQL 15** | Primary transactional data | ACID compliance, complex queries, government-grade reliability |
| **MongoDB 6** | Unstructured evidence/documents | Flexible schema, large file metadata, rapid development |
| **Redis 7** | Caching & sessions | In-memory speed, pub/sub, rate limiting |
| **Elasticsearch 8** | Full-text & geo search | Full-text search, analytics, geo-queries for crime hotspots |

### 1.2 Data Distribution Strategy

```
┌────────────────────────────────────────────────────────┐
│                    PostgreSQL                          │
│  • User accounts                                       │
│  • Complaints, FIRs, corruption reports               │
│  • Jobs, applications, skills                         │
│  • Projects, funds, politician profiles               │
│  • Audit logs, status history                         │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│                    MongoDB                             │
│  • Evidence files metadata                             │
│  • Investigation documents                             │
│  • Project documents                                   │
│  • AI model metadata                                   │
│  • Archived records                                    │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│                     Redis                              │
│  • Session tokens (TTL: 7 days)                       │
│  • OTP codes (TTL: 10 minutes)                        │
│  • Rate limit counters                                 │
│  • Dashboard cache (TTL: 5 minutes)                   │
│  • Job matching cache                                  │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│                  Elasticsearch                         │
│  • Complaint full-text search                         │
│  • Crime geo-spatial search                            │
│  • Job search with ranking                             │
│  • Politician transparency search                      │
└────────────────────────────────────────────────────────┘
```

---

## 2. PostgreSQL Schema

### 2.1 Complete DDL (Data Definition Language)

```sql
-- ============================================================================
-- INDIA ONE-GOV PLATFORM - PostgreSQL Database Schema
-- Version: 1.0
-- Database: iog_production
-- ============================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Trigram indexing for fuzzy search
CREATE EXTENSION IF NOT EXISTS "postgis";  -- Geospatial queries

-- ============================================================================
-- 1. USER MANAGEMENT
-- ============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aadhaar_hash VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20) CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
    address TEXT,
    state VARCHAR(100),
    district VARCHAR(100),
    pincode VARCHAR(6),
    role VARCHAR(50) NOT NULL CHECK (role IN ('CITIZEN', 'OFFICER', 'POLITICIAN', 'ADMIN', 'SUPER_ADMIN')),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    password_hash VARCHAR(255) NOT NULL,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    profile_photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_email ON users(email) WHERE email IS NOT NULL;
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_state_district ON users(state, district);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 2. AUTHENTICATION & SESSIONS
-- ============================================================================

CREATE TABLE auth_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    status VARCHAR(20) CHECK (status IN ('SUCCESS', 'FAILURE')),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_user_id ON auth_audit_logs(user_id);
CREATE INDEX idx_audit_created_at ON auth_audit_logs(created_at);
CREATE INDEX idx_audit_action ON auth_audit_logs(action);

-- ============================================================================
-- 3. COMPLAINT MANAGEMENT
-- ============================================================================

CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_number VARCHAR(20) UNIQUE NOT NULL,
    citizen_id UUID NOT NULL REFERENCES users(id),
    category VARCHAR(100) NOT NULL,
    sub_category VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location_point GEOGRAPHY(POINT, 4326),  -- PostGIS geography type
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    address TEXT NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    pincode VARCHAR(6),
    department VARCHAR(100),
    priority VARCHAR(20) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    status VARCHAR(50) DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED')),
    assigned_to UUID REFERENCES users(id),
    assigned_at TIMESTAMP,
    resolved_at TIMESTAMP,
    closed_at TIMESTAMP,
    resolution_notes TEXT,
    citizen_rating INTEGER CHECK (citizen_rating BETWEEN 1 AND 5),
    citizen_feedback TEXT,
    estimated_resolution_days INTEGER,
    is_escalated BOOLEAN DEFAULT FALSE,
    escalated_at TIMESTAMP,
    sentiment_score DECIMAL(3, 2),
    urgency_score DECIMAL(3, 2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT check_resolved_dates CHECK (resolved_at IS NULL OR resolved_at >= created_at),
    CONSTRAINT check_closed_dates CHECK (closed_at IS NULL OR closed_at >= created_at)
);

-- Indexes
CREATE INDEX idx_complaints_citizen ON complaints(citizen_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_district ON complaints(district);
CREATE INDEX idx_complaints_created_at ON complaints(created_at DESC);
CREATE INDEX idx_complaints_assigned_to ON complaints(assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX idx_complaints_category ON complaints(category);
CREATE INDEX idx_complaints_priority ON complaints(priority);
CREATE INDEX idx_complaints_location ON complaints USING GIST (location_point);

CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate complaint number
CREATE OR REPLACE FUNCTION generate_complaint_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.complaint_number := 'IOG-CMP-' || 
                           TO_CHAR(NOW(), 'YYYY') || '-' ||
                           LPAD(NEXTVAL('complaint_number_seq')::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE complaint_number_seq START WITH 1;
CREATE TRIGGER set_complaint_number BEFORE INSERT ON complaints
    FOR EACH ROW EXECUTE FUNCTION generate_complaint_number();

-- Complaint status history
CREATE TABLE complaint_status_history (
    id BIGSERIAL PRIMARY KEY,
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by UUID REFERENCES users(id),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_status_history_complaint ON complaint_status_history(complaint_id);

-- ============================================================================
-- 4. CRIME & FIR MANAGEMENT
-- ============================================================================

CREATE TABLE firs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fir_number VARCHAR(30) UNIQUE NOT NULL,
    complainant_id UUID NOT NULL REFERENCES users(id),
    complainant_name VARCHAR(255) NOT NULL,
    complainant_phone VARCHAR(15) NOT NULL,
    complainant_address TEXT,
    crime_type VARCHAR(100) NOT NULL,
    crime_category VARCHAR(50) NOT NULL,  -- IPC Section
    incident_description TEXT NOT NULL,
    incident_date TIMESTAMP NOT NULL,
    incident_time TIME,
    incident_point GEOGRAPHY(POINT, 4326),
    incident_location_lat DECIMAL(10, 8) NOT NULL,
    incident_location_lng DECIMAL(11, 8) NOT NULL,
    incident_address TEXT NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    police_station VARCHAR(255) NOT NULL,
    fir_status VARCHAR(50) DEFAULT 'REGISTERED' CHECK (fir_status IN ('REGISTERED', 'UNDER_INVESTIGATION', 'CHARGE_SHEET_FILED', 'CLOSED')),
    investigating_officer_id UUID REFERENCES users(id),
    assigned_at TIMESTAMP,
    closed_at TIMESTAMP,
    closure_reason TEXT,
    suspect_details JSONB,
    witness_details JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_firs_complainant ON firs(complainant_id);
CREATE INDEX idx_firs_status ON firs(fir_status);
CREATE INDEX idx_firs_crime_type ON firs(crime_type);
CREATE INDEX idx_firs_district ON firs(district);
CREATE INDEX idx_firs_incident_date ON firs(incident_date DESC);
CREATE INDEX idx_firs_location ON firs USING GIST (incident_point);

CREATE TRIGGER update_firs_updated_at BEFORE UPDATE ON firs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate FIR number
CREATE OR REPLACE FUNCTION generate_fir_number()
RETURNS TRIGGER AS $$
DECLARE
    state_code VARCHAR(2);
    district_code VARCHAR(3);
BEGIN
    -- Simplified state/district codes (enhance with lookup table)
    state_code := LEFT(NEW.state, 2);
    district_code := LEFT(NEW.district, 3);
    
    NEW.fir_number := 'IOG-FIR-' || 
                      UPPER(state_code) || '-' ||
                      UPPER(district_code) || '-' ||
                      TO_CHAR(NOW(), 'YYYY') || '-' ||
                      LPAD(NEXTVAL('fir_number_seq')::TEXT, 5, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE fir_number_seq START WITH 1;
CREATE TRIGGER set_fir_number BEFORE INSERT ON firs
    FOR EACH ROW EXECUTE FUNCTION generate_fir_number();

-- Police stations reference table
CREATE TABLE police_stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    station_code VARCHAR(20) UNIQUE NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    location_point GEOGRAPHY(POINT, 4326),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address TEXT,
    phone VARCHAR(15),
    email VARCHAR(255),
    jurisdiction_area TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_police_stations_location ON police_stations USING GIST (location_point);
CREATE INDEX idx_police_stations_district ON police_stations(district);

-- ============================================================================
-- 5. CORRUPTION REPORTS
-- ============================================================================

CREATE TABLE corruption_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_number VARCHAR(30) UNIQUE NOT NULL,
    reporter_id UUID REFERENCES users(id),
    is_anonymous BOOLEAN DEFAULT FALSE,
    anonymous_reporter_token VARCHAR(255),
    corruption_type VARCHAR(100) NOT NULL,
    accused_name VARCHAR(255),
    accused_designation VARCHAR(255),
    accused_department VARCHAR(255),
    incident_description TEXT NOT NULL,
    incident_date DATE,
    incident_location TEXT,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    monetary_value DECIMAL(15, 2),
    report_status VARCHAR(50) DEFAULT 'SUBMITTED' CHECK (report_status IN ('SUBMITTED', 'UNDER_REVIEW', 'INVESTIGATING', 'CLOSED')),
    assigned_to UUID REFERENCES users(id),
    priority VARCHAR(20) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    fraud_risk_score DECIMAL(3, 2),
    pattern_match_id UUID,
    investigation_outcome TEXT,
    closed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_corruption_reporter ON corruption_reports(reporter_id) WHERE reporter_id IS NOT NULL;
CREATE INDEX idx_corruption_status ON corruption_reports(report_status);
CREATE INDEX idx_corruption_department ON corruption_reports(accused_department);
CREATE INDEX idx_corruption_district ON corruption_reports(district);
CREATE INDEX idx_corruption_anonymous_token ON corruption_reports(anonymous_reporter_token) WHERE is_anonymous = TRUE;

CREATE TRIGGER update_corruption_updated_at BEFORE UPDATE ON corruption_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 6. EMPLOYMENT & SKILLS
-- ============================================================================

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_number VARCHAR(30) UNIQUE NOT NULL,
    employer_id UUID REFERENCES users(id),
    employer_name VARCHAR(255) NOT NULL,
    employer_type VARCHAR(50) CHECK (employer_type IN ('GOVERNMENT', 'PRIVATE', 'NGO', 'STARTUP')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    job_type VARCHAR(50) NOT NULL CHECK (job_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE')),
    category VARCHAR(100),
    required_skills TEXT[],
    min_experience_years INTEGER DEFAULT 0,
    max_experience_years INTEGER,
    education_required VARCHAR(100),
    salary_min DECIMAL(10, 2),
    salary_max DECIMAL(10, 2),
    salary_currency VARCHAR(3) DEFAULT 'INR',
    location_type VARCHAR(50) CHECK (location_type IN ('ON_SITE', 'REMOTE', 'HYBRID')),
    work_location_state VARCHAR(100),
    work_location_district VARCHAR(100),
    work_location_address TEXT,
    vacancies INTEGER DEFAULT 1,
    application_deadline DATE,
    job_status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (job_status IN ('ACTIVE', 'CLOSED', 'FILLED', 'EXPIRED')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_jobs_status ON jobs(job_status);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_location ON jobs(work_location_district);
CREATE INDEX idx_jobs_type ON jobs(job_type);
CREATE INDEX idx_jobs_deadline ON jobs(application_deadline);

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- User skills
CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    proficiency_level VARCHAR(50) CHECK (proficiency_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT')),
    years_of_experience INTEGER,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by VARCHAR(100),
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, skill_name)
);

CREATE INDEX idx_user_skills_user ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill ON user_skills(skill_name);

-- Job applications
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES users(id),
    match_score DECIMAL(3, 2),
    resume_url VARCHAR(500),
    cover_letter TEXT,
    application_status VARCHAR(50) DEFAULT 'SUBMITTED' CHECK (
        application_status IN ('SUBMITTED', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'ACCEPTED')
    ),
    applied_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP,
    status_updated_at TIMESTAMP,
    
    UNIQUE(job_id, applicant_id)
);

CREATE INDEX idx_applications_job ON job_applications(job_id);
CREATE INDEX idx_applications_applicant ON job_applications(applicant_id);
CREATE INDEX idx_applications_status ON job_applications(application_status);

-- ============================================================================
-- 7. POLITICIAN TRANSPARENCY
-- ============================================================================

CREATE TABLE politician_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    designation VARCHAR(100) NOT NULL,
    constituency_name VARCHAR(255) NOT NULL,
    constituency_type VARCHAR(50),
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    party_name VARCHAR(255),
    term_start_date DATE NOT NULL,
    term_end_date DATE NOT NULL,
    total_funds_allocated DECIMAL(15, 2) DEFAULT 0,
    total_funds_utilized DECIMAL(15, 2) DEFAULT 0,
    photo_url VARCHAR(500),
    bio TEXT,
    election_promises JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT check_term_dates CHECK (term_end_date > term_start_date)
);

CREATE INDEX idx_politician_user ON politician_profiles(user_id);
CREATE INDEX idx_politician_constituency ON politician_profiles(constituency_name);
CREATE INDEX idx_politician_state ON politician_profiles(state);

CREATE TRIGGER update_politician_updated_at BEFORE UPDATE ON politician_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Government projects
CREATE TABLE government_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name VARCHAR(255) NOT NULL,
    project_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100),
    politician_id UUID REFERENCES politician_profiles(id),
    constituency VARCHAR(255),
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    budget_allocated DECIMAL(15, 2) NOT NULL,
    budget_utilized DECIMAL(15, 2) DEFAULT 0,
    start_date DATE NOT NULL,
    expected_completion_date DATE NOT NULL,
    actual_completion_date DATE,
    project_status VARCHAR(50) DEFAULT 'PLANNED' CHECK (
        project_status IN ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'DELAYED', 'CANCELLED')
    ),
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
    contractor_name VARCHAR(255),
    beneficiaries_count INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT check_project_dates CHECK (expected_completion_date >= start_date),
    CONSTRAINT check_budget CHECK (budget_utilized <= budget_allocated)
);

CREATE INDEX idx_projects_politician ON government_projects(politician_id);
CREATE INDEX idx_projects_status ON government_projects(project_status);
CREATE INDEX idx_projects_district ON government_projects(district);

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON government_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fund allocations
CREATE TABLE fund_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    politician_id UUID NOT NULL REFERENCES politician_profiles(id),
    fund_type VARCHAR(100),
    fiscal_year VARCHAR(10) NOT NULL,
    allocated_amount DECIMAL(15, 2) NOT NULL,
    utilized_amount DECIMAL(15, 2) DEFAULT 0,
    allocation_date DATE NOT NULL,
    purpose TEXT,
    project_id UUID REFERENCES government_projects(id),
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT check_fund_amounts CHECK (utilized_amount <= allocated_amount)
);

CREATE INDEX idx_funds_politician ON fund_allocations(politician_id);
CREATE INDEX idx_funds_fiscal_year ON fund_allocations(fiscal_year);

-- ============================================================================
-- 8. NOTIFICATIONS
-- ============================================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    channels TEXT[],
    priority VARCHAR(20) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SENT', 'DELIVERED', 'FAILED')),
    email_status VARCHAR(20),
    sms_status VARCHAR(20),
    push_status VARCHAR(20),
    metadata JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- ============================================================================
-- 9. ANALYTICS & REPORTING
-- ============================================================================

-- Materialized view for dashboard analytics
CREATE MATERIALIZED VIEW dashboard_analytics AS
SELECT 
    state,
    district,
    COUNT(DISTINCT c.id) AS total_complaints,
    COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'RESOLVED') AS resolved_complaints,
    AVG(EXTRACT(EPOCH FROM (c.resolved_at - c.created_at))/86400) AS avg_resolution_days,
    COUNT(DISTINCT f.id) AS total_firs,
    COUNT(DISTINCT cr.id) AS total_corruption_reports,
    COUNT(DISTINCT j.id) AS total_jobs,
    DATE_TRUNC('month', CURRENT_DATE) AS reporting_month
FROM users u
LEFT JOIN complaints c ON c.citizen_id = u.id
LEFT JOIN firs f ON f.complainant_id = u.id
LEFT JOIN corruption_reports cr ON cr.reporter_id = u.id
LEFT JOIN jobs j ON j.work_location_state = u.state
GROUP BY state, district;

CREATE UNIQUE INDEX idx_analytics_state_district ON dashboard_analytics(state, district);

-- Refresh function
CREATE OR REPLACE FUNCTION refresh_dashboard_analytics()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_analytics;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 10. AUDIT & COMPLIANCE
-- ============================================================================

CREATE TABLE system_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_system_audit_user ON system_audit_logs(user_id);
CREATE INDEX idx_system_audit_entity ON system_audit_logs(entity_type, entity_id);
CREATE INDEX idx_system_audit_created_at ON system_audit_logs(created_at);

-- ============================================================================
-- 11. DATA RETENTION & ARCHIVAL
-- ============================================================================

-- Partition complaints table by year for better performance
CREATE TABLE complaints_archive (
    LIKE complaints INCLUDING ALL
) PARTITION BY RANGE (created_at);

-- Create partitions for each year
CREATE TABLE complaints_2025 PARTITION OF complaints_archive
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE complaints_2026 PARTITION OF complaints_archive
    FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');

-- ============================================================================
-- END OF POSTGRESQL SCHEMA
-- ============================================================================
```

### 2.2 Sample Data Seeding

```sql
-- Insert sample states and districts
INSERT INTO users (aadhaar_hash, phone_number, email, full_name, state, district, role, password_hash, is_verified) VALUES
('hash1', '+919876543210', '[email protected]', 'John Doe', 'Maharashtra', 'Mumbai', 'CITIZEN', '$2b$12$...', TRUE),
('hash2', '+919876543211', '[email protected]', 'Officer Smith', 'Maharashtra', 'Mumbai', 'OFFICER', '$2b$12$...', TRUE);

-- Insert sample police stations
INSERT INTO police_stations (name, station_code, state, district, latitude, longitude, address, phone) VALUES
('Colaba Police Station', 'MH-MUM-COL', 'Maharashtra', 'Mumbai', 18.9067, 72.8147, 'Colaba, Mumbai', '+912222163333');
```

---

## 3. MongoDB Collections

### 3.1 Evidence Files Collection

```javascript
// Collection: evidence_files
db.createCollection("evidence_files", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["complaintId", "files"],
      properties: {
        complaintId: {
          bsonType: "string",
          description: "UUID of complaint/FIR"
        },
        entityType: {
          enum: ["COMPLAINT", "FIR", "CORRUPTION_REPORT"],
          description: "Type of entity"
        },
        files: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["fileId", "fileName", "fileType", "s3Key"],
            properties: {
              fileId: { bsonType: "string" },
              fileName: { bsonType: "string" },
              fileType: { bsonType: "string" },
              fileSize: { bsonType: "int" },
              s3Key: { bsonType: "string" },
              s3Url: { bsonType: "string" },
              thumbnail: { bsonType: "string" },
              uploadedAt: { bsonType: "date" }
            }
          }
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

// Indexes
db.evidence_files.createIndex({ "complaintId": 1 });
db.evidence_files.createIndex({ "entityType": 1 });
db.evidence_files.createIndex({ "createdAt": -1 });
```

### 3.2 Investigation Documents Collection

```javascript
// Collection: investigation_documents
db.createCollection("investigation_documents");

// Indexes
db.investigation_documents.createIndex({ "firId": 1 });
db.investigation_documents.createIndex({ "firNumber": 1 });
db.investigation_documents.createIndex({ "timeline.timestamp": -1 });
```

### 3.3 AI Model Metadata Collection

```javascript
// Collection: ai_model_metadata
db.createCollection("ai_model_metadata", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["modelName", "modelVersion", "modelType"],
      properties: {
        modelName: {
          enum: ["fraud_detection", "crime_hotspot", "skill_matching", "sentiment_analysis"]
        },
        modelVersion: { bsonType: "string" },
        modelType: { bsonType: "string" },
        accuracy: { bsonType: "double" },
        trainingDate: { bsonType: "date" },
        trainingDataSize: { bsonType: "int" },
        hyperparameters: { bsonType: "object" },
        mlflowRunId: { bsonType: "string" },
        s3ModelPath: { bsonType: "string" },
        isProduction: { bsonType: "bool" }
      }
    }
  }
});

db.ai_model_metadata.createIndex({ "modelName": 1, "modelVersion": 1 }, { unique: true });
db.ai_model_metadata.createIndex({ "isProduction": 1 });
```

---

## 4. Redis Caching Strategy

### 4.1 Key Patterns

```redis
# Session Management
session:{userId}:{deviceId} -> JSON (TTL: 7 days)

# OTP Codes
otp:{phoneNumber}:registration -> "123456" (TTL: 10 minutes)
otp:{phoneNumber}:password_reset -> "654321" (TTL: 10 minutes)

# Rate Limiting
ratelimit:{endpoint}:{userId}:minute -> count (TTL: 60s)
ratelimit:{endpoint}:{ip}:hour -> count (TTL: 3600s)

# Dashboard Cache
dashboard:{level}:{state}:{district}:summary -> JSON (TTL: 5 minutes)

# Job Matching Cache
job_matches:{userId} -> JSON array (TTL: 1 hour)

# Crime Hotspots Cache
crime_hotspots:{state}:{district}:{crimeType} -> JSON (TTL: 1 hour)
```

### 4.2 Redis Data Structures

```javascript
// Session example
await redis.setex(
  `session:${userId}:${deviceId}`,
  604800,  // 7 days
  JSON.stringify({
    userId,
    deviceId,
    refreshToken,
    expiresAt: Date.now() + 604800000
  })
);

// Rate limiting example
const key = `ratelimit:complaints:${userId}:minute`;
const current = await redis.incr(key);
if (current === 1) {
  await redis.expire(key, 60);
}
if (current > 5) {
  throw new RateLimitError('Too many requests');
}
```

---

## 5. Elasticsearch Indices

### 5.1 Complaints Index

```json
PUT /complaints
{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 2,
    "analysis": {
      "analyzer": {
        "hindi_english_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": ["lowercase", "stop", "snowball"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "id": { "type": "keyword" },
      "complaintNumber": { "type": "keyword" },
      "title": {
        "type": "text",
        "analyzer": "hindi_english_analyzer",
        "fields": {
          "keyword": { "type": "keyword" }
        }
      },
      "description": {
        "type": "text",
        "analyzer": "hindi_english_analyzer"
      },
      "category": { "type": "keyword" },
      "status": { "type": "keyword" },
      "state": { "type": "keyword" },
      "district": { "type": "keyword" },
      "location": { "type": "geo_point" },
      "createdAt": { "type": "date" }
    }
  }
}
```

### 5.2 Crime Geo-Index

```json
PUT /crime_locations
{
  "mappings": {
    "properties": {
      "firId": { "type": "keyword" },
      "crimeType": { "type": "keyword" },
      "location": { "type": "geo_point" },
      "incidentDate": { "type": "date" },
      "state": { "type": "keyword" },
      "district": { "type": "keyword" }
    }
  }
}
```

### 5.3 Search Query Examples

```javascript
// Full-text search complaints
GET /complaints/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "description": "water supply" } }
      ],
      "filter": [
        { "term": { "state": "Maharashtra" } },
        { "term": { "district": "Mumbai" } },
        { "range": { "createdAt": { "gte": "2025-01-01" } } }
      ]
    }
  }
}

// Geo-spatial crime search (within 5km radius)
GET /crime_locations/_search
{
  "query": {
    "bool": {
      "filter": {
        "geo_distance": {
          "distance": "5km",
          "location": {
            "lat": 19.0760,
            "lon": 72.8777
          }
        }
      }
    }
  }
}
```

---

## 6. Data Migration Strategy

### 6.1 Migration Tools

- **Flyway** or **Liquibase** for PostgreSQL schema versioning
- **MongoDB Migration** scripts for collection changes
- **Zero-downtime migrations** using blue-green deployment

### 6.2 Sample Migration Script

```sql
-- V2__add_complaint_escalation.sql
ALTER TABLE complaints 
ADD COLUMN escalation_level INTEGER DEFAULT 0,
ADD COLUMN escalation_reason TEXT;

CREATE INDEX idx_complaints_escalation ON complaints(escalation_level) 
WHERE escalation_level > 0;
```

---

## 7. Backup & Recovery

### 7.1 Backup Strategy

| Database | Frequency | Retention | Method |
|----------|-----------|-----------|--------|
| PostgreSQL | Daily full + Hourly incremental | 30 days | pg_dump + WAL archiving |
| MongoDB | Daily | 30 days | mongodump |
| Redis | Hourly RDB snapshots | 7 days | RDB persistence |
| Elasticsearch | Daily snapshots | 14 days | Snapshot API |

### 7.2 Recovery Procedures

```bash
# PostgreSQL recovery
pg_restore -d iog_production backup_file.dump

# MongoDB recovery
mongorestore --db iog_production backup_directory/

# Redis recovery (automatic from RDB file)
redis-server --dbfilename dump.rdb
```

---

**End of Module 3 - Database Design**
