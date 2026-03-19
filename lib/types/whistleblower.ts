export interface WhistleblowerReport {
  id: string;
  tender_id: string | null;
  tender_reference: string | null;
  allegation_type: string | null;
  entity_name: string | null;
  report_text: string;
  evidence_description: string | null;
  ai_triage_summary: string | null;
  credibility_score: number | null;
  urgency: 'critical' | 'high' | 'medium' | 'low' | null;
  is_credible: boolean | null;
  is_reviewed: boolean;
  reviewer_notes: string | null;
  reviewed_at: string | null;
  submitted_at: string;
}

export interface WhistleblowerSubmitRequest {
  allegation_type: string;
  tender_reference?: string;
  entity_name?: string;
  description: string;
  evidence_description?: string;
  contact_preference: 'none' | 'email';
}

export interface WhistleblowerSubmitResponse {
  report_id: string;
  credibility_score: number | null;
  allegation_type: string;
  urgency: string | null;
  triage_summary: string | null;
  is_credible: boolean;
  identity_risk: string;
  corroborating_evidence_needed: string[];
  message: string;
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
