import { api } from '@/lib/api';
import { MLStatus, SpendingForecast, TrainingProgress } from '@/lib/types';

export const mlService = {
  getStatus: (): Promise<MLStatus> => api.get<MLStatus>('/api/ml/status'),

  trainXgboost: (): Promise<TrainingProgress> =>
    api.post<TrainingProgress>('/api/ml/train/xgboost-synthetic'),

  trainPriceAnomaly: (): Promise<TrainingProgress> =>
    api.post<TrainingProgress>('/api/ml/train/price-anomaly'),

  trainCollusionVectorizer: (): Promise<TrainingProgress> =>
    api.post<TrainingProgress>('/api/ml/train/collusion-vectorizer'),

  getSpendingForecast: (entityId: string): Promise<SpendingForecast> =>
    api.get<SpendingForecast>(`/api/ml/spending-forecast/${entityId}`),
};
