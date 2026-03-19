import { api } from '@/lib/api';

// ── Existing types (unchanged) ─────────────────────────────────────────────
export interface CountyRiskItem {
  county: string;
  riskScore: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  tenderCount: number;
  totalValue: number;
  ghostSuppliers: number;
  priceDeviations: number;
  bidRigging: number;
}

export interface TrendItem {
  month: string;
  year: string;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
}

export interface RiskTypeItem {
  name: string;
  value: number;
  color: string;
}

// ── New types ──────────────────────────────────────────────────────────────
export interface AnalyticsKPIs {
  total_value: number; // billions KES
  flagged_count: number;
  flagged_delta: string; // e.g. "+8.3%"
  flagged_trend: 'up' | 'down';
  avg_risk_score: number;
  avg_risk_delta: string;
  avg_risk_trend: 'up' | 'down';
}

export interface SpendingTrendItem {
  month: string;
  budgeted: number;
  actual: number;
  flagged: number;
}

export interface RiskDistribution {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface DailyTrendItem {
  date: string;
  critical: number;
  high: number;
  medium: number;
}

export interface CountyAnalysisItem {
  county: string;
  tenders: number;
  risk_score: number;
}

export interface AnalyticsFilters {
  months?: number;
  days?: number;
  county?: string;
}

// ── Service ────────────────────────────────────────────────────────────────
export const analyticsService = {
  // existing
  getCountyRisk: (): Promise<{ items: CountyRiskItem[] }> =>
    api.get('/analytics/county-risk'),

  getRiskTrend: (
    filters: AnalyticsFilters = {},
  ): Promise<{ items: TrendItem[] }> => {
    const params = new URLSearchParams();
    if (filters.months) params.append('months', filters.months.toString());
    return api.get(`/analytics/risk-trend?${params.toString()}`);
  },

  getRiskTypeDistribution: (): Promise<{ items: RiskTypeItem[] }> =>
    api.get('/analytics/risk-type-distribution'),

  // new
  getKPIs: (): Promise<AnalyticsKPIs> => api.get('/analytics/kpis'),

  getSpendingTrend: (
    filters: AnalyticsFilters = {},
  ): Promise<{ items: SpendingTrendItem[] }> => {
    const params = new URLSearchParams();
    if (filters.months) params.append('months', filters.months.toString());
    return api.get(`/analytics/spending-trend?${params.toString()}`);
  },

  getRiskDistribution: (): Promise<RiskDistribution> =>
    api.get('/analytics/risk-distribution'),

  getDailyTrend: (
    filters: AnalyticsFilters = {},
  ): Promise<{ items: DailyTrendItem[] }> => {
    const params = new URLSearchParams();
    if (filters.days) params.append('days', filters.days.toString());
    return api.get(`/analytics/daily-trend?${params.toString()}`);
  },

  getCountyAnalysis: (): Promise<{ items: CountyAnalysisItem[] }> =>
    api.get('/analytics/county-risk'), // reuses county-risk, picks county/tenders/risk_score
};
