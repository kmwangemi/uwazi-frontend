export interface DashboardStats {
  total_tenders_month: number;
  critical_risk_tenders: number;
  total_value_at_risk: number;
  active_investigations: number;
  total_tenders_delta?: number;
  critical_risk_delta?: number;
  value_at_risk_delta?: number;
  investigations_delta?: number;
}

export interface DashboardHeatmapData {
  county: string;
  avg_risk_score: number;
  tender_count: number;
  highest_risk_tender?: {
    title: string;
    risk_score: number;
  };
}

export interface TopRiskSupplier {
  rank: number;
  supplier_id: string;
  name: string;
  risk_score: number;
  ghost_probability: number;
}

export interface AIQueryRequest {
  question: string;
}

export interface AIQueryResponse {
  answer: string;
  sources?: string[];
  confidence?: number;
}
