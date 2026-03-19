import { dashboardService } from '@/lib/services/dashboardService';
import { useMutation, useQuery } from '@tanstack/react-query';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  heatmap: () => [...dashboardKeys.all, 'heatmap'] as const,
  topRiskSuppliers: () => [...dashboardKeys.all, 'top-risk-suppliers'] as const,
  highRiskTenders: () => [...dashboardKeys.all, 'high-risk-tenders'] as const,
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
    select: data => data.items,
  });

export const useTopRiskSuppliers = () =>
  useQuery({
    queryKey: dashboardKeys.topRiskSuppliers(),
    queryFn: dashboardService.getTopRiskSuppliers,
    select: data => data.items,
  });

export const useHighRiskTenders = () =>
  useQuery({
    queryKey: dashboardKeys.highRiskTenders(),
    queryFn: dashboardService.getHighRiskTenders,
    select: data => data.items,
  });

export const useAiQuery = () =>
  useMutation({
    mutationFn: (question: string) => dashboardService.askAI(question),
  });
