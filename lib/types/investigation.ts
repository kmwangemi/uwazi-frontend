export interface Investigation {
  id: string;
  tender_id: string;
  tender_ref: string | null;
  title: string;
  status: 'open' | 'in_review' | 'escalated' | 'closed';
  risk_level: 'critical' | 'high' | 'medium' | 'low' | null;
  findings: string | null;
  investigator_name: string | null;
  opened_at: string;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvestigationFilters {
  search?: string;
  status?: string;
  risk_level?: string;
  page?: number;
  limit?: number;
}

export interface WhistleblowerFilters {
  search?: string;
  is_reviewed?: boolean;
  urgency?: string;
  page?: number;
  limit?: number;
}
