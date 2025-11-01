-- AfyaLink Database Schema
-- Rural Health Records System for Africa

-- Clinics table
CREATE TABLE IF NOT EXISTS clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinic users (staff) table
CREATE TABLE IF NOT EXISTS clinic_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff', -- 'admin' or 'staff'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL,
  phone TEXT,
  village TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  blood_type TEXT,
  allergies TEXT,
  chronic_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Visits table
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  visit_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  chief_complaint TEXT NOT NULL,
  symptoms TEXT,
  diagnosis TEXT,
  treatment TEXT,
  medications TEXT,
  notes TEXT,
  vital_signs JSONB, -- {temperature, blood_pressure, heart_rate, weight, height}
  follow_up_date DATE,
  created_by UUID REFERENCES clinic_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Summaries table (generated via MCP)
CREATE TABLE IF NOT EXISTS ai_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  summary_text TEXT NOT NULL,
  risk_factors TEXT[],
  recommendations TEXT[],
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shared records table (for cross-clinic sharing)
CREATE TABLE IF NOT EXISTS shared_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  from_clinic_id UUID NOT NULL REFERENCES clinics(id),
  to_clinic_id UUID NOT NULL REFERENCES clinics(id),
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  access_expires_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_patients_clinic ON patients(clinic_id);
CREATE INDEX IF NOT EXISTS idx_visits_patient ON visits(patient_id);
CREATE INDEX IF NOT EXISTS idx_visits_clinic ON visits(clinic_id);
CREATE INDEX IF NOT EXISTS idx_visits_date ON visits(visit_date);
CREATE INDEX IF NOT EXISTS idx_clinic_users_email ON clinic_users(email);
