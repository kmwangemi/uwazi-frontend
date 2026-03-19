import { api } from '@/lib/api';
import {
  AIQueryResponse,
  DashboardStats,
  HeatmapCounty,
  HighRiskTender,
  TopRiskSupplier,
} from '@/lib/types';

export const dashboardService = {
  getStats: (): Promise<DashboardStats> =>
    api.get<DashboardStats>('/dashboard/stats'),

  getHeatmap: (): Promise<{ items: HeatmapCounty[] }> =>
    api.get<{ items: HeatmapCounty[] }>('/dashboard/heatmap'),

  getTopRiskSuppliers: (): Promise<{ items: TopRiskSupplier[] }> =>
    api.get<{ items: TopRiskSupplier[] }>('/dashboard/top-risk-suppliers'),

  getHighRiskTenders: (): Promise<{ items: HighRiskTender[] }> =>
    api.get<{ items: HighRiskTender[] }>('/dashboard/high-risk-tenders'),

  askAI: (question: string): Promise<AIQueryResponse> =>
    api.post<AIQueryResponse>('/dashboard/ai-query', { question }),
};
