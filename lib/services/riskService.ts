import { api } from '@/lib/api';
import {
  CountyRiskOverview,
  PriceCheckRequest,
  PriceCheckResponse,
  SpecAnalysisResponse,
} from '@/lib/types';

export const riskService = {
  checkPrice: (req: PriceCheckRequest): Promise<PriceCheckResponse> =>
    api.post<PriceCheckResponse>('/api/analyze/price-check', req),

  analyzeSpecifications: (text: string): Promise<SpecAnalysisResponse> =>
    api.post<SpecAnalysisResponse>('/api/analyze/specifications', {
      specification_text: text,
    }),

  getCountyRiskOverview: (): Promise<CountyRiskOverview[]> =>
    api.get<CountyRiskOverview[]>('/api/analyze/county-risk'),
};
