export interface PriceCheckRequest {
  item_name: string;
  tender_price: number;
  category?: string;
  county?: string;
}

export interface PriceCheckResponse {
  score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  deviation_pct: number; // ← not deviation_percent
  benchmark: {
    item_name: string;
    category: string;
    unit: string;
    avg_price: number; // ← not benchmark_avg
    min_price: number; // ← not benchmark_min
    max_price: number; // ← not benchmark_max
    source: string;
  } | null;
  flags: string[];
  verdict: string;
  item_name: string;
  tender_price: number;
}

export interface SpecAnalysisResponse {
  restrictiveness_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  issues: SpecIssue[];
  brand_names_found: string[]; // ← not brand_names_detected
  single_source_detected: boolean; // ← boolean not string[]
  verdict: string;
  ai_analysis: string | null;
  spec_length: number;
}

export interface SpecIssue {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  excerpt: string;
}

export interface CountyRiskOverview {
  county: string;
  tender_count: number;
  avg_risk_score: number;
  total_value_kes: number; // ← not total_value
  critical_count: number;
  high_count: number;
  highest_risk_tender: {
    id: string;
    title: string;
    total_score: number;
    risk_level: string;
  } | null;
}
