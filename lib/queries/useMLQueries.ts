import { mlService } from '@/lib/services/mlService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const mlKeys = {
  all: ['ml'] as const,
  status: () => [...mlKeys.all, 'status'] as const,
  forecast: (entityId: string) =>
    [...mlKeys.all, 'forecast', entityId] as const,
};

export const useMLStatus = () =>
  useQuery({
    queryKey: mlKeys.status(),
    queryFn: mlService.getStatus,
  });

export const useSpendingForecast = (entityId: string) =>
  useQuery({
    queryKey: mlKeys.forecast(entityId),
    queryFn: () => mlService.getSpendingForecast(entityId),
    enabled: !!entityId,
  });

// ✅ All training mutations invalidate ML status so the UI reflects new state
export const useTrainXgboost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mlService.trainXgboost,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: mlKeys.status() }),
  });
};

export const useTrainPriceAnomaly = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mlService.trainPriceAnomaly,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: mlKeys.status() }),
  });
};

export const useTrainCollusionVectorizer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mlService.trainCollusionVectorizer,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: mlKeys.status() }),
  });
};
