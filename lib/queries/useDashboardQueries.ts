import { dashboardService } from '@/lib/services/dashboardService';
import { useMutation, useQuery } from '@tanstack/react-query';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  heatmap: () => [...dashboardKeys.all, 'heatmap'] as const,
  topRiskSuppliers: () => [...dashboardKeys.all, 'top-risk-suppliers'] as const,
};

export const useDashboardStats = () =>
  useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: dashboardService.getStats,
  });

export const useDashboardHeatmap = () =>
  useQuery({
    queryKey: dashboardKeys.heatmap(),
    queryFn: dashboardService.getHeatmap,
  });

export const useTopRiskSuppliers = () =>
  useQuery({
    queryKey: dashboardKeys.topRiskSuppliers(),
    queryFn: dashboardService.getTopRiskSuppliers,
  });

export const useAiQuery = () =>
  useMutation({
    mutationFn: (question: string) => dashboardService.aiQuery(question),
  });
