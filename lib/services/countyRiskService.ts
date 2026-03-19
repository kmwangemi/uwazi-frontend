import { api } from '@/lib/api';

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

export interface AnalyticsFilters {
  months?: number;
}

export const analyticsService = {
  getCountyRisk: (): Promise<{ items: CountyRiskItem[] }> =>
    api.get<{ items: CountyRiskItem[] }>('/analytics/county-risk'),

  getRiskTrend: (
    filters: AnalyticsFilters = {},
  ): Promise<{ items: TrendItem[] }> => {
    const params = new URLSearchParams();
    if (filters.months) params.append('months', filters.months.toString());
    return api.get<{ items: TrendItem[] }>(
      `/analytics/risk-trend?${params.toString()}`,
    );
  },

  getRiskTypeDistribution: (): Promise<{ items: RiskTypeItem[] }> =>
    api.get<{ items: RiskTypeItem[] }>('/analytics/risk-type-distribution'),
};
