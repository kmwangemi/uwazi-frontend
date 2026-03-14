export interface MLModel {
  name: string;
  library: string;
  proposal_layer: string;
  trained: boolean;
  trainable: boolean;
}

export interface MLStatus {
  models: MLModel[];
  last_trained: string;
}

export interface TrainingProgress {
  model: string;
  progress: number;
  status: 'queued' | 'running' | 'complete' | 'failed';
  message?: string;
}

export interface SpendingForecast {
  entity_id: string;
  dates: string[];
  actual: number[];
  forecasted: number[];
  anomalies: {
    date: string;
    actual: number;
    forecasted: number;
  }[];
  election_proximity_warning?: boolean;
}
