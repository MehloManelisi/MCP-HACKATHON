-- Seed data for AfyaLink demo

-- Insert demo clinic
INSERT INTO clinics (id, name, location, contact_phone, contact_email)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Kibera Community Clinic', 'Kibera, Nairobi, Kenya', '+254-700-123456', 'info@kiberaclinic.org'),
  ('00000000-0000-0000-0000-000000000002', 'Mwanza Rural Health Center', 'Mwanza, Tanzania', '+255-700-654321', 'contact@mwanzahealth.org')
ON CONFLICT (id) DO NOTHING;

-- Insert demo clinic user (password: demo123)
-- Note: In production, use proper password hashing
INSERT INTO clinic_users (id, clinic_id, email, password_hash, full_name, role)
VALUES 
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'nurse@kiberaclinic.org', '$2a$10$demo.hash.placeholder', 'Grace Wanjiku', 'staff'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'admin@kiberaclinic.org', '$2a$10$demo.hash.placeholder', 'Dr. James Omondi', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert demo patients
INSERT INTO patients (id, clinic_id, first_name, last_name, date_of_birth, gender, phone, village, blood_type, allergies, chronic_conditions)
VALUES 
  ('00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000001', 'Amina', 'Mwangi', '1985-03-15', 'Female', '+254-712-345678', 'Kibera Section A', 'O+', 'Penicillin', 'Hypertension'),
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'John', 'Kamau', '1992-07-22', 'Male', '+254-723-456789', 'Kibera Section B', 'A+', 'None', 'None'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'Faith', 'Achieng', '1978-11-08', 'Female', '+254-734-567890', 'Kibera Section C', 'B+', 'Sulfa drugs', 'Diabetes Type 2')
ON CONFLICT (id) DO NOTHING;

-- Insert demo visits
INSERT INTO visits (patient_id, clinic_id, visit_date, chief_complaint, symptoms, diagnosis, treatment, medications, vital_signs, created_by)
VALUES 
  ('00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '7 days', 'Headache and dizziness', 'Severe headache, dizziness, blurred vision', 'Hypertensive crisis', 'Blood pressure management, rest', 'Amlodipine 10mg daily, Hydrochlorothiazide 25mg daily', '{"temperature": "37.2", "blood_pressure": "165/95", "heart_rate": "88", "weight": "72"}', '00000000-0000-0000-0000-000000000010'),
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '3 days', 'Cough and fever', 'Persistent cough, fever, body aches', 'Upper respiratory tract infection', 'Antibiotics, rest, fluids', 'Amoxicillin 500mg 3x daily for 7 days, Paracetamol as needed', '{"temperature": "38.5", "blood_pressure": "120/80", "heart_rate": "92", "weight": "68"}', '00000000-0000-0000-0000-000000000010'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '1 day', 'High blood sugar', 'Excessive thirst, frequent urination, fatigue', 'Uncontrolled diabetes', 'Insulin adjustment, dietary counseling', 'Metformin 1000mg 2x daily, Insulin glargine 20 units at bedtime', '{"temperature": "36.8", "blood_pressure": "140/85", "heart_rate": "76", "weight": "85", "blood_glucose": "285"}', '00000000-0000-0000-0000-000000000010')
ON CONFLICT (id) DO NOTHING;
