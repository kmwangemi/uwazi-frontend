import {
  AnalyticsFilters,
  analyticsService,
} from '@/lib/services/countyRiskService';
import { useQuery } from '@tanstack/react-query';

export const analyticsKeys = {
  all: ['analytics'] as const,
  countyRisk: () => [...analyticsKeys.all, 'county-risk'] as const,
  riskTrend: (filters: AnalyticsFilters) =>
    [...analyticsKeys.all, 'risk-trend', filters] as const,
  riskTypeDistribution: () =>
    [...analyticsKeys.all, 'risk-type-distribution'] as const,
};

export const useCountyRisk = () =>
  useQuery({
    queryKey: analyticsKeys.countyRisk(),
    queryFn: () => analyticsService.getCountyRisk(),
    select: data => data.items,
  });

export const useRiskTrend = (filters: AnalyticsFilters = { months: 6 }) =>
  useQuery({
    queryKey: analyticsKeys.riskTrend(filters),
    queryFn: () => analyticsService.getRiskTrend(filters),
    select: data => data.items,
  });

export const useRiskTypeDistribution = () =>
  useQuery({
    queryKey: analyticsKeys.riskTypeDistribution(),
    queryFn: () => analyticsService.getRiskTypeDistribution(),
    select: data => data.items,
  });
