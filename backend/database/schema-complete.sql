-- IOG Platform - Complete Database Schema
-- PostgreSQL DDL for all microservices

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================
-- AUTH SERVICE TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    aadhaar_hash VARCHAR(64) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('CITIZEN', 'OFFICER', 'POLITICIAN', 'ADMIN', 'SUPER_ADMIN')),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    state VARCHAR(100),
    district VARCHAR(100),
    profile_photo_url TEXT,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS auth_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    status VARCHAR(20) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- COMPLAINT SERVICE TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_number VARCHAR(50) UNIQUE NOT NULL,
    citizen_id UUID NOT NULL,
    category VARCHAR(100) NOT NULL,
    sub_category VARCHAR(100),
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lng DECIMAL(11, 8) NOT NULL,
    address TEXT NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    pincode VARCHAR(10),
    department VARCHAR(100),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED')),
    assigned_to UUID,
    assigned_at TIMESTAMP,
    resolved_at TIMESTAMP,
    closed_at TIMESTAMP,
    resolution_notes TEXT,
    citizen_rating INTEGER CHECK (citizen_rating >= 1 AND citizen_rating <= 5),
    citizen_feedback TEXT,
    estimated_resolution_days INTEGER,
    is_escalated BOOLEAN DEFAULT FALSE,
    escalated_at TIMESTAMP,
    sentiment_score DECIMAL(3, 2),
    urgency_score DECIMAL(3, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS complaint_status_history (
    id BIGSERIAL PRIMARY KEY,
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    previous_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_by UUID,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CRIME SERVICE TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS firs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fir_number VARCHAR(50) UNIQUE NOT NULL,
    reported_by VARCHAR(50) DEFAULT 'ANONYMOUS',
    reporter_name VARCHAR(255) NOT NULL,
    reporter_contact VARCHAR(20),
    crime_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    incident_date DATE NOT NULL,
    incident_time TIME,
    location GEOGRAPHY(POINT, 4326),
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lng DECIMAL(11, 8) NOT NULL,
    address TEXT NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    police_station VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL CHECK (status IN ('REGISTERED', 'UNDER_INVESTIGATION', 'CHARGE_SHEET_FILED', 'TRIAL', 'CLOSED', 'CANCELLED')),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    assigned_officer UUID,
    investigating_officer_id UUID,
    suspects JSONB DEFAULT '[]',
    victims JSONB DEFAULT '[]',
    witnesses JSONB DEFAULT '[]',
    is_anonymous BOOLEAN DEFAULT FALSE,
    evidence_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS criminal_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_number VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    aliases JSONB DEFAULT '[]',
    aadhaar_hash VARCHAR(64),
    photo_url TEXT,
    fingerprints TEXT,
    date_of_birth DATE,
    gender VARCHAR(20),
    address TEXT,
    state VARCHAR(100),
    district VARCHAR(100),
    crimes_committed JSONB DEFAULT '[]',
    status VARCHAR(20) NOT NULL CHECK (status IN ('WANTED', 'ARRESTED', 'JAILED', 'RELEASED', 'ACQUITTED', 'CONVICTED')),
    arrest_date DATE,
    release_date DATE,
    is_most_wanted BOOLEAN DEFAULT FALSE,
    danger_level VARCHAR(20) NOT NULL CHECK (danger_level IN ('LOW', 'MEDIUM', 'HIGH', 'EXTREME')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CORRUPTION SERVICE TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS corruption_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_number VARCHAR(50) UNIQUE NOT NULL,
    reporter_id UUID,
    is_anonymous BOOLEAN DEFAULT TRUE,
    corruption_type VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    official_name VARCHAR(255),
    official_designation VARCHAR(100),
    bribe_amount DECIMAL(12, 2),
    incident_date DATE NOT NULL,
    location TEXT NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    evidence_urls JSONB DEFAULT '[]',
    witness_details JSONB DEFAULT '[]',
    status VARCHAR(30) NOT NULL CHECK (status IN ('SUBMITTED', 'UNDER_REVIEW', 'INVESTIGATING', 'ACTION_TAKEN', 'CLOSED', 'DISMISSED')),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    assigned_to UUID,
    ai_risk_score DECIMAL(3, 2),
    verification_status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- EMPLOYMENT SERVICE TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_type VARCHAR(50),
    description TEXT NOT NULL,
    requirements TEXT,
    skills_required JSONB DEFAULT '[]',
    experience_min INTEGER,
    experience_max INTEGER,
    salary_min DECIMAL(12, 2),
    salary_max DECIMAL(12, 2),
    location VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    job_type VARCHAR(50) CHECK (job_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP')),
    category VARCHAR(100),
    vacancies INTEGER DEFAULT 1,
    application_deadline DATE,
    status VARCHAR(20) CHECK (status IN ('ACTIVE', 'CLOSED', 'FILLED', 'CANCELLED')),
    posted_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL,
    resume_url TEXT,
    cover_letter TEXT,
    skills JSONB DEFAULT '[]',
    experience_years INTEGER,
    status VARCHAR(30) CHECK (status IN ('APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED', 'REJECTED', 'WITHDRAWN')),
    ai_match_score DECIMAL(3, 2),
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    proficiency_level VARCHAR(20) CHECK (proficiency_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT')),
    years_of_experience INTEGER,
    certification_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- POLITICIAN SERVICE TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS politicians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    party VARCHAR(100),
    position VARCHAR(100) NOT NULL,
    constituency VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    term_start_date DATE,
    term_end_date DATE,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    office_address TEXT,
    photo_url TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    constituency VARCHAR(255),
    budget_allocated DECIMAL(15, 2) NOT NULL,
    budget_spent DECIMAL(15, 2) DEFAULT 0,
    start_date DATE,
    expected_completion_date DATE,
    actual_completion_date DATE,
    status VARCHAR(30) CHECK (status IN ('PROPOSED', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'DELAYED', 'CANCELLED')),
    progress_percentage INTEGER DEFAULT 0,
    politician_id UUID REFERENCES politicians(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fund_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    allocation_number VARCHAR(50) UNIQUE NOT NULL,
    project_id UUID REFERENCES projects(id),
    politician_id UUID REFERENCES politicians(id),
    amount DECIMAL(15, 2) NOT NULL,
    purpose TEXT NOT NULL,
    allocation_date DATE NOT NULL,
    utilization_amount DECIMAL(15, 2) DEFAULT 0,
    utilization_percentage DECIMAL(5, 2) DEFAULT 0,
    status VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ADMIN SERVICE TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS admin_logs (
    id BIGSERIAL PRIMARY KEY,
    admin_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    changes JSONB,
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS system_metrics (
    id BIGSERIAL PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15, 2),
    metric_type VARCHAR(50),
    state VARCHAR(100),
    district VARCHAR(100),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================

-- Users
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_email ON users(email) WHERE email IS NOT NULL;
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_state_district ON users(state, district);

-- Complaints
CREATE INDEX idx_complaints_citizen ON complaints(citizen_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_category ON complaints(category);
CREATE INDEX idx_complaints_district ON complaints(district);
CREATE INDEX idx_complaints_created_at ON complaints(created_at DESC);
CREATE INDEX idx_complaints_location ON complaints USING GIST(location);

-- FIRs
CREATE INDEX idx_firs_crime_type ON firs(crime_type);
CREATE INDEX idx_firs_status ON firs(status);
CREATE INDEX idx_firs_district ON firs(district);
CREATE INDEX idx_firs_incident_date ON firs(incident_date DESC);
CREATE INDEX idx_firs_location ON firs USING GIST(location);

-- Corruption Reports
CREATE INDEX idx_corruption_status ON corruption_reports(status);
CREATE INDEX idx_corruption_district ON corruption_reports(district);
CREATE INDEX idx_corruption_type ON corruption_reports(corruption_type);

-- Jobs
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_location ON jobs(state, district);
CREATE INDEX idx_jobs_category ON jobs(category);

-- Projects
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_politician ON projects(politician_id);
CREATE INDEX idx_projects_district ON projects(state, district);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_firs_updated_at BEFORE UPDATE ON firs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_corruption_updated_at BEFORE UPDATE ON corruption_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
