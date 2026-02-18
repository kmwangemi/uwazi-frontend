export interface DashboardStats {
  total_tenders: number;
  flagged_tenders: number;
  total_value: number;
  estimated_savings: number;
  active_investigations: number;
  tenders_by_risk: RiskDistribution;
  savings_by_county: CountyData[];
  fraud_trends: TrendData[];
  top_corrupt_entities: EntityRiskData[];
}

export interface RiskDistribution {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface CountyData {
  county: string;
  total_tenders: number;
  flagged_tenders: number;
  total_value: number;
  savings: number;
  corruption_rate: number;
}

export interface TrendData {
  date: string;
  total_tenders: number;
  flagged_tenders: number;
  total_value: number;
  flagged_value: number;
}

export interface EntityRiskData {
  entity_code: string;
  entity_name: string;
  total_tenders: number;
  flagged_tenders: number;
  corruption_rate: number;
  risk_score: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface FilterParams {
  search?: string;
  status?: string;
  county?: string;
  category?: string;
  entity?: string;
  risk_level?: string;
  date_from?: string;
  date_to?: string;
  min_amount?: number;
  max_amount?: number;
}
