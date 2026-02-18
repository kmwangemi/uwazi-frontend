export interface procuring_entity {
  id: number;
  entity_code: string;
  name: string;
  entity_type: 'MINISTRY' | 'COUNTY' | 'PARASTATAL' | 'OTHER';
  county: string | null;
  total_tenders: number;
  total_expenditure: number;
  flagged_tenders: number;
  average_corruption_score: number;
  created_at: string;
}

export interface EntityStatistics {
  total_tenders: number;
  total_value: number;
  average_tender_value: number;
  flagged_count: number;
  flagged_value: number;
  corruption_rate: number;
  savings_potential: number;
  tenders_by_category: CategoryData[];
  spending_by_month: MonthlyData[];
}

export interface CategoryData {
  name: string;
  value: number;
  count: number;
}

export interface MonthlyData {
  month: string;
  value: number;
  count: number;
}
