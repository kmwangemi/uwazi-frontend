export interface PriceCheckRequest {
  item_description: string;
  estimated_price: number;
  category: string;
  county: string;
}

export interface PriceCheckResponse {
  deviation_percent: number;
  benchmark_avg: number;
  benchmark_min: number;
  benchmark_max: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  market_distribution: {
    price: number;
    count: number;
  }[];
}

export interface SpecAnalysisRequest {
  specification_text: string;
}

export interface SpecAnalysisResponse {
  restrictiveness_score: number;
  issues: SpecIssue[];
  brand_names_detected: string[];
  single_source_indicators: string[];
}

export interface SpecIssue {
  issue: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface CountyRiskOverview {
  county: string;
  tender_count: number;
  avg_risk_score: number;
  total_value: number;
  highest_risk_tender?: {
    id: string;
    title: string;
    risk_score: number;
  };
}
