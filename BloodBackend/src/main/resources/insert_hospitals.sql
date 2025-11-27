-- Insert sample hospitals into the hospitals table
-- Make sure to run this SQL script in your MySQL database

USE bloodbank;

-- Insert sample hospitals
INSERT INTO hospitals (name, address, contact_person, email, phone, registration_number, status, created_at, updated_at) VALUES
('City General Hospital', '123 Main Street, New York, NY 10001', 'Dr. Sarah Johnson', 'admin@citygeneralhospital.com', '+1-212-555-0101', 'REG-CGH-2024-001', 'ACTIVE', NOW(), NOW()),
('St. Mary Medical Center', '456 Oak Avenue, Los Angeles, CA 90001', 'Dr. Michael Chen', 'info@stmarysmedical.com', '+1-213-555-0202', 'REG-SMC-2024-002', 'ACTIVE', NOW(), NOW()),
('Memorial Hospital', '789 Pine Road, Chicago, IL 60601', 'Dr. Emily Davis', 'contact@memorialhospital.com', '+1-312-555-0303', 'REG-MH-2024-003', 'ACTIVE', NOW(), NOW()),
('Hope Medical Institute', '321 Elm Street, Houston, TX 77001', 'Dr. Robert Wilson', 'admin@hopemedical.com', '+1-713-555-0404', 'REG-HMI-2024-004', 'ACTIVE', NOW(), NOW()),
('Central Healthcare Center', '654 Maple Drive, Phoenix, AZ 85001', 'Dr. Jennifer Martinez', 'info@centralhealthcare.com', '+1-602-555-0505', 'REG-CHC-2024-005', 'ACTIVE', NOW(), NOW()),
('Riverside Hospital', '987 River Lane, Philadelphia, PA 19101', 'Dr. David Anderson', 'contact@riversidehospital.com', '+1-215-555-0606', 'REG-RH-2024-006', 'ACTIVE', NOW(), NOW()),
('Green Valley Medical Center', '147 Valley Road, San Antonio, TX 78201', 'Dr. Lisa Thompson', 'admin@greenvalleymedical.com', '+1-210-555-0707', 'REG-GVMC-2024-007', 'ACTIVE', NOW(), NOW()),
('Sunshine Hospital', '258 Sunshine Boulevard, San Diego, CA 92101', 'Dr. James White', 'info@sunshinehospital.com', '+1-619-555-0808', 'REG-SH-2024-008', 'ACTIVE', NOW(), NOW()),
('Metro Health Systems', '369 Metro Avenue, Dallas, TX 75201', 'Dr. Maria Garcia', 'contact@metrohealth.com', '+1-214-555-0909', 'REG-MHS-2024-009', 'ACTIVE', NOW(), NOW()),
('Community General Hospital', '741 Community Street, San Jose, CA 95101', 'Dr. William Brown', 'admin@communitygeneralhospital.com', '+1-408-555-1010', 'REG-CGH-2024-010', 'ACTIVE', NOW(), NOW());

-- Verify the data was inserted
SELECT * FROM hospitals;

-- Check if hospital_id column exists in donors table
-- If not, this will create it
ALTER TABLE donors ADD COLUMN IF NOT EXISTS hospital_id BIGINT;

-- Add foreign key constraint if it doesn't exist
-- Note: This might fail if the constraint already exists, which is fine
ALTER TABLE donors 
ADD CONSTRAINT fk_donor_hospital 
FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
ON DELETE SET NULL
ON UPDATE CASCADE;

-- Display current structure
DESCRIBE donors;
DESCRIBE hospitals;
