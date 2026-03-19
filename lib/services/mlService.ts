import { api } from '@/lib/api';

export interface MLModel {
  id: string;
  name: string;
  library: string;
  layer: string;
  trained: boolean;
  trainable: boolean;
  train_endpoint: string | null;
}

export interface MLStatusResponse {
  models: MLModel[];
  total: number;
  trained_count: number;
  untrained_count: number;
}

export interface MLPerformanceItem {
  id: string;
  name: string;
  accuracy: number | null;
}

export interface SpendingForecastResponse {
  entity_id: string;
  entity_name: string;
  forecast: {
    ds: string;
    yhat: number;
    yhat_lower: number;
    yhat_upper: number;
  }[];
  anomalies: {
    date: string;
    actual_spend: number;
    expected_spend: number;
    deviation_pct: number;
    severity: string;
  }[];
  anomaly_dates: string[];
  pattern_summary: string;
  anomaly_risk_score: number;
  message?: string;
}

export interface EntityOption {
  id: string;
  name: string;
}

export const mlService = {
  getStatus: (): Promise<MLStatusResponse> => api.get('/ml/status'),

  getPerformance: (): Promise<{ items: MLPerformanceItem[] }> =>
    api.get('/ml/performance'),

  trainModel: (
    endpoint: string,
  ): Promise<{ status: string; message?: string }> => api.post(endpoint, {}),

  getSpendingForecast: (entityId: string): Promise<SpendingForecastResponse> =>
    api.get(`/ml/spending-forecast/${entityId}`),

  getEntities: (): Promise<{ items: EntityOption[] }> =>
    api.get('/ml/entities'),
};
