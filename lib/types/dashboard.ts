export interface DashboardStats {
  total_tenders: number;
  total_tenders_delta: number;
  critical_risk_tenders: number;
  critical_risk_delta: number;
  total_value_at_risk: number;
  value_at_risk_delta: number;
  active_investigations: number;
  investigations_delta: number;
}

export interface HeatmapCounty {
  county: string;
  tender_count: number;
  avg_score: number;
  risk_level: 'critical' | 'high' | 'medium' | 'low';
}

export interface TopRiskSupplier {
  supplier_id: string;
  name: string;
  risk_score: number;
  ghost_probability: number;
  rank: number;
  county: string;
  is_verified: boolean;
}

export interface HighRiskTender {
  id: string;
  title: string;
  entity: string | null;
  county: string;
  estimated_value: number;
  risk_score: number;
  risk_level: 'critical' | 'high' | 'medium' | 'low';
  created_at: string;
}

export interface AIQueryResponse {
  answer: string;
}
