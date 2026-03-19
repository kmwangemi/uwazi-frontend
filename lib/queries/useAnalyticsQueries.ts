import {
  AnalyticsFilters,
  analyticsService,
} from '@/lib/services/analyticsService';
import { useQuery } from '@tanstack/react-query';

export const analyticsKeys = {
  all: ['analytics'] as const,
  countyRisk: () => [...analyticsKeys.all, 'county-risk'] as const,
  riskTrend: (filters: AnalyticsFilters) =>
    [...analyticsKeys.all, 'risk-trend', filters] as const,
  riskTypeDistribution: () =>
    [...analyticsKeys.all, 'risk-type-distribution'] as const,
  kpis: () => [...analyticsKeys.all, 'kpis'] as const,
  spendingTrend: (filters: AnalyticsFilters) =>
    [...analyticsKeys.all, 'spending-trend', filters] as const,
  riskDistribution: () => [...analyticsKeys.all, 'risk-distribution'] as const,
  dailyTrend: (filters: AnalyticsFilters) =>
    [...analyticsKeys.all, 'daily-trend', filters] as const,
  countyAnalysis: () => [...analyticsKeys.all, 'county-analysis'] as const,
};

// existing
export const useCountyRisk = () =>
  useQuery({
    queryKey: analyticsKeys.countyRisk(),
    queryFn: analyticsService.getCountyRisk,
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
    queryFn: analyticsService.getRiskTypeDistribution,
    select: data => data.items,
  });

// new
export const useAnalyticsKPIs = () =>
  useQuery({
    queryKey: analyticsKeys.kpis(),
    queryFn: analyticsService.getKPIs,
  });

export const useSpendingTrend = (filters: AnalyticsFilters = { months: 6 }) =>
  useQuery({
    queryKey: analyticsKeys.spendingTrend(filters),
    queryFn: () => analyticsService.getSpendingTrend(filters),
    select: data => data.items,
  });

export const useRiskDistribution = () =>
  useQuery({
    queryKey: analyticsKeys.riskDistribution(),
    queryFn: analyticsService.getRiskDistribution,
  });

export const useDailyTrend = (filters: AnalyticsFilters = { days: 7 }) =>
  useQuery({
    queryKey: analyticsKeys.dailyTrend(filters),
    queryFn: () => analyticsService.getDailyTrend(filters),
    select: data => data.items,
  });

export const useCountyAnalysis = () =>
  useQuery({
    queryKey: analyticsKeys.countyAnalysis(),
    queryFn: analyticsService.getCountyAnalysis,
    select: data =>
      data.items.map(c => ({
        county: c.county,
        tenders: c.tenders,
        risk_score: c.risk_score,
      })),
  });
