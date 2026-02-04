export interface DashboardStats {
  total_tenders: number;
  flagged_tenders: number;
  total_value: number;
  estimated_savings: number;
  active_investigations: number;
  tenders_by_risk: RiskDistribution;
  savings_by_county: CountyData[];
  fraud_trends: TrendData[];
  top_risk_tenders: TenderRiskData[];
}

export interface RiskDistribution {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface CountyData {
  county: string;
  tenders: number;
  flagged: number;
  savings: number;
  risk_score: number;
}

export interface TrendData {
  month: string;
  flagged_count: number;
  total_count: number;
  fraud_rate: number;
}

export interface TenderRiskData {
  id: number;
  tender_number: string;
  title: string;
  risk_score: number;
  amount: number;
  procuring_entity: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FileUploadResponse {
  id: number;
  file_name: string;
  file_path: string;
  file_size: number;
  uploaded_at: string;
}
