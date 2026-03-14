export interface WhistleblowerReport {
  allegation_type: string;
  tender_reference?: string;
  entity_name?: string;
  description: string;
  evidence_description?: string;
  contact_preference?: 'none' | 'email';
}

export interface WhistleblowerResponse {
  report_id: string;
  credibility_score: number;
  allegation_type: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  triage_summary: string;
  is_credible: boolean;
}

export interface WhistleblowerListItem {
  report_id: string;
  date_submitted: string;
  allegation_type: string;
  credibility_score: number;
  urgency: string;
  ai_summary: string;
  reviewed: boolean;
}
