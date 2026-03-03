export interface TenderOriginal {
  id: number;
  tender_number: string;
  title: string;
  description: string;
  amount: number;
  procuring_entity: string;
  county: string;
  category: string;
  tender_type: string;
  submission_deadline: string | null;
  award_date: string | null;
  awarded_supplier_id: number | null;
  awarded_supplier_name?: string;
  status: TenderStatus;
  risk_score: number;
  is_flagged: boolean;
  corruption_flags: CorruptionFlag[];
  created_at: string;
  updated_at: string;
}

export interface Tender {
  id: string; // UUID not number
  tender_number: string;
  title: string;
  description?: string;
  entity_name: string; // was procuring_entity
  entity_type?: string;
  category?: string;
  procurement_method?: string;
  amount: number;
  currency: string;
  source_of_funds?: string;
  tender_security_form?: string;
  tender_security_amount?: number;
  county?: string;
  contact_email?: string;
  publication_date?: string;
  deadline?: string; // was submission_deadline
  opening_date?: string;
  award_date?: string;
  awarded_supplier_id?: string;
  status: TenderStatus;
  risk_score: number;
  risk_level?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  is_flagged: boolean;
  attachments?: TenderAttachment[];
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface TenderAttachment {
  url: string;
  public_id: string;
  file_name: string;
  file_type?: string;
  size?: number;
}

export interface TenderCreatePayload {
  tender_number: string;
  title: string;
  description?: string;
  entityName: string;
  entityType?: string;
  category?: string;
  procurementMethod?: string;
  amount: number;
  currency?: string;
  sourceOfFunds?: string;
  tenderSecurityForm?: string;
  tenderSecurityAmount?: number;
  county?: string;
  contactEmail?: string;
  deadline?: string;
  openingDate?: string;
  attachments?: File[];
}

export type TenderStatus =
  | 'PUBLISHED'
  | 'AWARDED'
  | 'CANCELLED'
  | 'FLAGGED'
  | 'UNDER_INVESTIGATION'
  | 'COMPLETED';

export interface CorruptionFlag {
  type: FlagType;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  score: number;
  evidence: Record<string, any>;
}

export type FlagType =
  | 'PRICE_INFLATION'
  | 'GHOST_SUPPLIER'
  | 'SPECIFICATION_RESTRICTIVE'
  | 'NETWORK_CONFLICT'
  | 'SHORT_TIMELINE'
  | 'TENDER_SPLITTING'
  | 'CONTRACT_VARIATION';

export interface PriceAnalysis {
  item_name: string;
  tender_price: number;
  market_price: number;
  deviation_percentage: number;
  excess_amount: number;
  market_source: string;
}
