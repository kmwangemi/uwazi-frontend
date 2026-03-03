import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboardService';

export const dashboardKeys = {
    all: ['dashboard'] as const,
    stats: () => [...dashboardKeys.all, 'stats'] as const,
    alerts: (limit: number) => [...dashboardKeys.all, 'alerts', limit] as const,
    counties: () => [...dashboardKeys.all, 'counties'] as const,
    trends: () => [...dashboardKeys.all, 'trends'] as const,
};

export function useDashboardStats() {
    return useQuery({
        queryKey: dashboardKeys.stats(),
        queryFn: () => dashboardService.getDashboardStats(),
    });
}

export function useRecentAlerts(limit: number = 10) {
    return useQuery({
        queryKey: dashboardKeys.alerts(limit),
        queryFn: () => dashboardService.getRecentAlerts(limit),
    });
}

export function useCountyData() {
    return useQuery({
        queryKey: dashboardKeys.counties(),
        queryFn: () => dashboardService.getCountyData(),
    });
}

export function useFraudTrends() {
    return useQuery({
        queryKey: dashboardKeys.trends(),
        queryFn: () => dashboardService.getFraudTrends(),
    });
}
