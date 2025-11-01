// TypeScript types for AfyaLink

export interface Clinic {
  id: string
  name: string
  location: string
  contact_phone?: string
  contact_email?: string
  created_at: string
}

export interface ClinicUser {
  id: string
  clinic_id: string
  email: string
  full_name: string
  role: "admin" | "staff"
  created_at: string
}

export interface Patient {
  id: string
  clinic_id: string
  first_name: string
  last_name: string
  date_of_birth: string
  gender: string
  phone?: string
  village?: string
  emergency_contact?: string
  emergency_phone?: string
  blood_type?: string
  allergies?: string
  chronic_conditions?: string
  created_at: string
  updated_at: string
}

export interface VitalSigns {
  temperature?: string
  blood_pressure?: string
  heart_rate?: string
  weight?: string
  height?: string
  blood_glucose?: string
}

export interface Visit {
  id: string
  patient_id: string
  clinic_id: string
  visit_date: string
  chief_complaint: string
  symptoms?: string
  diagnosis?: string
  treatment?: string
  medications?: string
  notes?: string
  vital_signs?: VitalSigns
  follow_up_date?: string
  created_by?: string
  created_at: string
}

export interface AISummary {
  id: string
  patient_id: string
  summary_text: string
  risk_factors: string[]
  recommendations: string[]
  generated_at: string
}

export interface SharedRecord {
  id: string
  patient_id: string
  from_clinic_id: string
  to_clinic_id: string
  shared_at: string
  access_expires_at?: string
  notes?: string
}
