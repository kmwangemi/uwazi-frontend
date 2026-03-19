import { mlService } from '@/lib/services/mlService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const mlKeys = {
  all: ['ml'] as const,
  status: () => [...mlKeys.all, 'status'] as const,
  performance: () => [...mlKeys.all, 'performance'] as const,
  forecast: (id: string) => [...mlKeys.all, 'forecast', id] as const,
};

export const useMLStatus = () =>
  useQuery({
    queryKey: mlKeys.status(),
    queryFn: mlService.getStatus,
  });

export const useMLPerformance = () =>
  useQuery({
    queryKey: mlKeys.performance(),
    queryFn: mlService.getPerformance,
    select: data => data.items,
  });

export const useTrainModel = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (endpoint: string) => mlService.trainModel(endpoint),
    onSuccess: () => qc.invalidateQueries({ queryKey: mlKeys.status() }),
  });
};

export const useSpendingForecast = (entityId: string) =>
  useQuery({
    queryKey: mlKeys.forecast(entityId),
    queryFn: () => mlService.getSpendingForecast(entityId),
    enabled: !!entityId && entityId !== 'all',
  });

export const useMLEntities = () =>
  useQuery({
    queryKey: [...mlKeys.all, 'entities'] as const,
    queryFn: mlService.getEntities,
    select: data => data.items,
  });
