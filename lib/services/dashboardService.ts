import { api } from '@/lib/api';
import {
  AIQueryResponse,
  DashboardHeatmapData,
  DashboardStats,
  TopRiskSupplier,
} from '@/lib/types';

export const dashboardService = {
  getStats: (): Promise<DashboardStats> =>
    api.get<DashboardStats>('/api/dashboard/stats'),

  getHeatmap: (): Promise<DashboardHeatmapData[]> =>
    api.get<DashboardHeatmapData[]>('/api/dashboard/heatmap'),

  getTopRiskSuppliers: (): Promise<TopRiskSupplier[]> =>
    api.get<TopRiskSupplier[]>('/api/dashboard/top-risk-suppliers'),

  aiQuery: (question: string): Promise<AIQueryResponse> =>
    api.post<AIQueryResponse>('/api/dashboard/ai-query', { question }),
};
