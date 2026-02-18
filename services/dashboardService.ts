import api from '@/lib/api';
import { mockDashboardStats } from '@/lib/mockData';
import type { DashboardStats } from '@/types/common';

export const dashboardService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get<DashboardStats>('/api/dashboard/stats');
      return response.data;
    } catch (error) {
      return mockDashboardStats;
    }
  },

  getRecentAlerts: async (limit: number = 10) => {
    try {
      const response = await api.get('/api/dashboard/alerts', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      return { data: [] };
    }
  },

  getCountyData: async () => {
    try {
      const response = await api.get('/api/dashboard/counties');
      return response.data;
    } catch (error) {
      return mockDashboardStats.savings_by_county;
    }
  },

  getFraudTrends: async () => {
    try {
      const response = await api.get('/api/dashboard/fraud-trends');
      return response.data;
    } catch (error) {
      return mockDashboardStats.fraud_trends;
    }
  },
};
