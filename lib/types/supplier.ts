import { RedFlag } from '@/lib/types';

export interface Supplier {
  id: string;
  name: string;
  registration_number: string;
  county: string;
  company_age_days: number;
  tax_filings_count: number;
  directors: Director[];
  risk_score: number;
  ghost_probability?: number;
  contracts_won?: number;
  total_value_won?: number;
  red_flags?: RedFlag[];
}

export interface Director {
  full_name: string;
  id_number: string;
  other_companies_linked: number;
}

export interface ProcuringEntity {
  id: string;
  name: string;
  corruption_history_score: number;
  county: string;
  entity_type: string;
}

export interface SupplierFilters {
  risk_level?: string;
  county?: string;
  age_min?: number;
  age_max?: number;
  has_red_flags?: boolean;
  page?: number;
  limit?: number;
}
