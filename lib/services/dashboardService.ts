import { api } from '@/lib/api';
import {
  AIQueryResponse,
  DashboardHeatmapData,
  DashboardStats,
  TopRiskSupplier,
} from '@/lib/types';

export const dashboardService = {
  getStats: (): Promise<DashboardStats> =>
    api.get<DashboardStats>('/dashboard/stats'),

  getHeatmap: (): Promise<DashboardHeatmapData[]> =>
    api.get<DashboardHeatmapData[]>('/dashboard/heatmap'),

  getTopRiskSuppliers: (): Promise<TopRiskSupplier[]> =>
    api.get<TopRiskSupplier[]>('/dashboard/top-risk-suppliers'),

  aiQuery: (question: string): Promise<AIQueryResponse> =>
    api.post<AIQueryResponse>('/dashboard/ai-query', { question }),
};
