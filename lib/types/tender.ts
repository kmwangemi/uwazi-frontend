import { ProcuringEntity } from '@/lib/types/supplier';

export interface Tender {
  id: string;
  reference_number: string;
  title: string;
  description: string;
  category: string;
  county: string;
  estimated_value: number;
  procurement_method: string;
  status: string;
  submission_deadline: string;
  created_at: string;
  source_url?: string;
  entity: ProcuringEntity;
  risk_score?: RiskScore;
  red_flags?: RedFlag[];
  bids?: Bid[];
  documents?: TenderDocument[];
}

export interface RiskScore {
  total_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  price_score: number;
  supplier_score: number;
  spec_score: number;
  contract_value_score: number;
  entity_history_score: number;
  flags: string[];
  ai_analysis?: string;
  recommended_action?: string;
  analyzed_at?: string;
}

export interface RedFlag {
  flag_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: Record<string, unknown>;
}

export interface Bid {
  id: string;
  supplier_id: string;
  supplier_name: string;
  bid_amount: number;
  is_winner: boolean;
  similarity_score?: number;
  bid_date?: string;
  proposal_text: string;
}

export interface TenderDocument {
  id: string;
  filename: string;
  url: string;
  extracted_text?: string;
  uploaded_at: string;
}

export interface InvestigationPackage {
  tender_id: string;
  markdown_content: string;
  generated_at: string;
}

export interface CollusionAnalysis {
  tender_id: string;
  pairs: CollusionPair[];
  summary: string;
}

export interface CollusionPair {
  supplier_1: string;
  supplier_2: string;
  similarity_score: number;
}

export interface TenderFilters {
  search?: string;
  county?: string;
  category?: string;
  risk_level?: string[] | string;
  status?: string;
  method?: string;
  min_value?: number;
  max_value?: number;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
  sort_by?: 'date' | 'value' | 'risk_score';
  sort_order?: 'asc' | 'desc';
}
