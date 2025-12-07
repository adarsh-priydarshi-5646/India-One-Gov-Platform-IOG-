-- Sample Data for IOG Platform Testing
-- Run this after running the main schema.sql

-- Insert sample citizens
INSERT INTO users (phone_number, email, aadhaar_hash, full_name, password_hash, role, is_verified, is_active, state, district)
VALUES 
  ('+919876543210', '[email protected]', '5f8c7f3d8e6a9b4c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c', 'Raj Kumar', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeB0Rq2L7swZwxKDy', 'CITIZEN', TRUE, TRUE, 'Maharashtra', 'Mumbai'),
  ('+919988776655', '[email protected]', '6a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b', 'Priya Sharma', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeB0Rq2L7swZwxKDy', 'CITIZEN', TRUE, TRUE, 'Karnataka', 'Bangalore'),
  ('+919123456789', '[email protected]', '7b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c', 'Amit Patel', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeB0Rq2L7swZwxKDy', 'CITIZEN', TRUE, TRUE, 'Gujarat', 'Ahmedabad')
ON CONFLICT (phone_number) DO NOTHING;

-- Insert sample officers
INSERT INTO users (phone_number, email, aadhaar_hash, full_name, password_hash, role, is_verified, is_active, state, district)
VALUES 
  ('+919111222333', '[email protected]', '8c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d', 'Inspector Verma', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeB0Rq2L7swZwxKDy', 'OFFICER', TRUE, TRUE, 'Maharashtra', 'Mumbai'),
  ('+919222333444', '[email protected]', '9d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e', 'Officer Singh', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeB0Rq2L7swZwxKDy', 'OFFICER', TRUE, TRUE, 'Karnataka', 'Bangalore')
ON CONFLICT (phone_number) DO NOTHING;

-- Get user IDs for reference
DO $$
DECLARE
  raj_id UUID;
  priya_id UUID;
  amit_id UUID;
BEGIN
  SELECT id INTO raj_id FROM users WHERE phone_number = '+919876543210';
  SELECT id INTO priya_id FROM users WHERE phone_number = '+919988776655';
  SELECT id INTO amit_id FROM users WHERE phone_number = '+919123456789';

  -- Insert sample complaints
  IF raj_id IS NOT NULL THEN
    INSERT INTO complaints (
      complaint_number, citizen_id, category, title, description,
      location_lat, location_lng, address, state, district, pincode,
      department, priority, status, sentiment_score, urgency_score
    ) VALUES 
    (
      'CMP/MH/MUM/' || EXTRACT(YEAR FROM CURRENT_DATE) || '/000001',
      raj_id,
      'Water Supply',
      'No water supply for 3 days',
      'There has been no water supply in our area for the past 3 days. This is causing severe inconvenience to all residents. We have tried contacting the local municipal office but have not received any response.',
      19.0760, 72.8777,
      'Andheri West, Mumbai, Maharashtra',
      'Maharashtra', 'Mumbai', '400058',
      'Water Department',
      'HIGH',
      'SUBMITTED',
      0.75, 0.82
    ),
    (
      'CMP/MH/MUM/' || EXTRACT(YEAR FROM CURRENT_DATE) || '/000002',
      raj_id,
      'Road & Infrastructure',
      'Large pothole on main road',
      'A large pothole has developed on the main road near the market. It is causing accidents and traffic jams. Immediate action is required.',
      19.0820, 72.8850,
      'Bandra West, Mumbai, Maharashtra',
      'Maharashtra', 'Mumbai', '400050',
      'Public Works Department',
      'MEDIUM',
      'ASSIGNED',
      0.68, 0.65
    )
    ON CONFLICT (complaint_number) DO NOTHING;
  END IF;

  IF priya_id IS NOT NULL THEN
    INSERT INTO complaints (
      complaint_number, citizen_id, category, title, description,
      location_lat, location_lng, address, state, district,
      priority, status, sentiment_score, urgency_score
    ) VALUES 
    (
      'CMP/KA/BAN/' || EXTRACT(YEAR FROM CURRENT_DATE) || '/000001',
      priya_id,
      'Street Lights',
      'Street lights not working',
      'Street lights in our locality have not been working for over a week. This is creating safety concerns, especially for women and children.',
      12.9716, 77.5946,
      'Koramangala, Bangalore, Karnataka',
      'Karnataka', 'Bangalore',
      'URGENT',
      'IN_PROGRESS',
      0.82, 0.88
    )
    ON CONFLICT (complaint_number) DO NOTHING;
  END IF;

  IF amit_id IS NOT NULL THEN
    INSERT INTO complaints (
      complaint_number, citizen_id, category, title, description,
      location_lat, location_lng, address, state, district,
      priority, status, resolved_at, resolution_notes, citizen_rating, citizen_feedback
    ) VALUES 
    (
      'CMP/GJ/AHM/' || EXTRACT(YEAR FROM CURRENT_DATE) || '/000001',
      amit_id,
      'Garbage Collection',
      'Irregular garbage collection',
      'Garbage collection in our area has become very irregular. Sometimes the truck does not come for 2-3 days.',
      23.0225, 72.5714,
      'Satellite, Ahmedabad, Gujarat',
      'Gujarat', 'Ahmedabad',
      'LOW',
      'RESOLVED',
      CURRENT_TIMESTAMP - INTERVAL '2 days',
      'Garbage collection schedule has been regularized. New truck assigned to the area.',
      5,
      'Very satisfied with the quick resolution. Thank you!'
    )
    ON CONFLICT (complaint_number) DO NOTHING;
  END IF;

  -- Insert sample FIRs
  IF raj_id IS NOT NULL THEN
    INSERT INTO firs (
      fir_number, reported_by, reporter_name, reporter_contact,
      crime_type, description, incident_date, incident_time,
      location_lat, location_lng, address, state, district, police_station,
      status, priority, is_anonymous
    ) VALUES 
    (
      'FIR/MH/MUM/' || EXTRACT(YEAR FROM CURRENT_DATE) || '/000001',
      'CITIZEN',
      'Raj Kumar',
      '+919876543210',
      'Theft',
      'Mobile phone stolen from auto rickshaw. Brand: iPhone 15 Pro, Color: Black, IMEI: 123456789012345',
      CURRENT_DATE - 1,
      '18:30:00',
      19.0760, 72.8777,
      'Andheri Railway Station, Mumbai',
      'Maharashtra', 'Mumbai', 'Andheri Police Station',
      'UNDER_INVESTIGATION',
      'MEDIUM',
      FALSE
    )
    ON CONFLICT (fir_number) DO NOTHING;
  END IF;
END $$;

-- Insert audit logs for testing
INSERT INTO auth_audit_logs (user_id, action, ip_address, status, metadata)
SELECT 
  id,
  'LOGIN_SUCCESS',
  '127.0.0.1'::inet,
  'SUCCESS',
  '{"device": "web", "browser": "Chrome"}'::jsonb
FROM users 
WHERE role = 'CITIZEN'
LIMIT 3;

-- Display summary
SELECT 
  'Users' as table_name,
  COUNT(*) as count
FROM users
UNION ALL
SELECT 'Complaints', COUNT(*) FROM complaints
UNION ALL
SELECT 'FIRs', COUNT(*) FROM firs
UNION ALL
SELECT 'Audit Logs', COUNT(*) FROM auth_audit_logs;

-- Display sample users for testing
SELECT 
  phone_number,
  email,
  full_name,
  role,
  'Test@123456' as password_hint
FROM users
WHERE role = 'CITIZEN'
ORDER BY created_at DESC;
