import { api } from '@/lib/api';
import { MLStatus, SpendingForecast, TrainingProgress } from '@/lib/types';

export const mlService = {
  getStatus: (): Promise<MLStatus> => api.get<MLStatus>('/ml/status'),

  trainXgboost: (): Promise<TrainingProgress> =>
    api.post<TrainingProgress>('/ml/train/xgboost-synthetic'),

  trainPriceAnomaly: (): Promise<TrainingProgress> =>
    api.post<TrainingProgress>('/ml/train/price-anomaly'),

  trainCollusionVectorizer: (): Promise<TrainingProgress> =>
    api.post<TrainingProgress>('/ml/train/collusion-vectorizer'),

  getSpendingForecast: (entityId: string): Promise<SpendingForecast> =>
    api.get<SpendingForecast>(`/ml/spending-forecast/${entityId}`),
};
