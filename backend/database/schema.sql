-- India One-Gov Platform - Database Schema
-- PostgreSQL DDL for all microservices

-- ============================================
-- AUTH SERVICE TABLES
-- ============================================

-- Users table
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

-- Auth audit logs table
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

-- Indexes for auth service
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_aadhaar ON users(aadhaar_hash);
CREATE INDEX IF NOT EXISTS idx_audit_user_id ON auth_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON auth_audit_logs(created_at);

-- ============================================
-- COMPLAINT SERVICE TABLES
-- ============================================

-- Complaints table
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_number VARCHAR(50) UNIQUE NOT NULL,
    citizen_id UUID NOT NULL,
    category VARCHAR(100) NOT NULL,
    sub_category VARCHAR(100),
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
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

-- Complaint status history
CREATE TABLE IF NOT EXISTS complaint_status_history (
    id BIGSERIAL PRIMARY KEY,
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    previous_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_by UUID,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for complaint service
CREATE INDEX IF NOT EXISTS idx_complaints_citizen ON complaints(citizen_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(category);
CREATE INDEX IF NOT EXISTS idx_complaints_district ON complaints(district);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_complaints_assigned_to ON complaints(assigned_to) WHERE assigned_to IS NOT NULL;

-- ============================================
-- CRIME SERVICE TABLES
-- ============================================

-- FIRs table
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

-- Criminal records table
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

-- Indexes for crime service
CREATE INDEX IF NOT EXISTS idx_firs_crime_type ON firs(crime_type);
CREATE INDEX IF NOT EXISTS idx_firs_status ON firs(status);
CREATE INDEX IF NOT EXISTS idx_firs_district ON firs(district);
CREATE INDEX IF NOT EXISTS idx_firs_incident_date ON firs(incident_date DESC);
CREATE INDEX IF NOT EXISTS idx_firs_created_at ON firs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_criminals_status ON criminal_records(status);
CREATE INDEX IF NOT EXISTS idx_criminals_most_wanted ON criminal_records(is_most_wanted) WHERE is_most_wanted = TRUE;

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_firs_updated_at BEFORE UPDATE ON firs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_criminals_updated_at BEFORE UPDATE ON criminal_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate complaint number
CREATE OR REPLACE FUNCTION generate_complaint_number()
RETURNS TRIGGER AS $$
DECLARE
    sequence_num INTEGER;
    year INTEGER;
BEGIN
    year := EXTRACT(YEAR FROM CURRENT_DATE);
    
    SELECT COUNT(*) + 1 INTO sequence_num
    FROM complaints
    WHERE EXTRACT(YEAR FROM created_at) = year;
    
    NEW.complaint_number := 'CMP/' || 
                           UPPER(SUBSTRING(NEW.state FROM 1 FOR 2)) || '/' ||
                           UPPER(SUBSTRING(NEW.district FROM 1 FOR 3)) || '/' ||
                           year || '/' ||
                           LPAD(sequence_num::TEXT, 6, '0');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for complaint number generation
CREATE TRIGGER generate_complaint_number_trigger
    BEFORE INSERT ON complaints
    FOR EACH ROW
    WHEN (NEW.complaint_number IS NULL)
    EXECUTE FUNCTION generate_complaint_number();

-- ============================================
-- INITIAL DATA (Optional)
-- ============================================

-- Insert a super admin user (password: Admin@123456)
INSERT INTO users (
    phone_number, 
    email, 
    aadhaar_hash, 
    full_name, 
    password_hash, 
    role, 
    is_verified,
    is_active
) VALUES (
    '+919999999999',
    '[email protected]',
    '9b74c9897bac770ffc029102a200c5de' || 
    'a4fd0f6aaa6b7db7aad3e6c033409585',
    'System Administrator',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeB0Rq2L7swZwxKDy',
    'SUPER_ADMIN',
    TRUE,
    TRUE
) ON CONFLICT (phone_number) DO NOTHING;

-- Create database info view
CREATE OR REPLACE VIEW database_info AS
SELECT 
    'users' as table_name,
    COUNT(*) as record_count
FROM users
UNION ALL
SELECT 'complaints', COUNT(*) FROM complaints
UNION ALL
SELECT 'firs', COUNT(*) FROM firs
UNION ALL
SELECT 'criminal_records', COUNT(*) FROM criminal_records;

-- Grant permissions (adjust username as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO iog_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO iog_user;
