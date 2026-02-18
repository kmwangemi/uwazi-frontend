export interface Supplier {
  id: number
  registration_number: string
  name: string
  business_address: string
  physical_address: string | null
  tax_pin: string
  registration_date: string
  directors: Director[]
  contact_email: string | null
  contact_phone: string | null
  is_verified: boolean
  risk_score: number
  total_contracts: number
  total_contract_value: number
  flagged_contracts: number
  created_at: string
}

export interface Director {
  name: string
  id_number: string
  shares: number
  appointment_date?: string
  is_government_employee?: boolean
}

export interface SupplierVerification {
  business_registration: VerificationCheck
  tax_compliance: VerificationCheck
  physical_address: VerificationCheck
  director_conflicts: VerificationCheck
  operational_capacity: VerificationCheck
  overall_risk: number
}

export interface VerificationCheck {
  passed: boolean
  score: number
  details: string
  red_flags: string[]
}
