import { api } from '@/lib/api';
import {
  CollusionAnalysis,
  InvestigationPackage,
  PaginatedResponse,
  RiskScore,
  Tender,
  TenderFilters,
} from '@/lib/types';

export const tendersService = {
  list: (filters: TenderFilters): Promise<PaginatedResponse<Tender>> => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.county) params.append('county', filters.county);
    if (filters.category) params.append('category', filters.category);
    if (filters.status) params.append('status', filters.status);
    if (filters.method) params.append('method', filters.method);
    if (filters.min_value)
      params.append('min_value', filters.min_value.toString());
    if (filters.max_value)
      params.append('max_value', filters.max_value.toString());
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    if (Array.isArray(filters.risk_level)) {
      filters.risk_level.forEach(level => params.append('risk_level', level));
    } else if (filters.risk_level) {
      params.append('risk_level', filters.risk_level);
    }
    params.append('page', (filters.page || 1).toString());
    params.append('limit', (filters.limit || 20).toString());
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.sort_order) params.append('sort_order', filters.sort_order);
    return api.get<PaginatedResponse<Tender>>(
      `/api/tenders?${params.toString()}`,
    );
  },
  get: (id: string): Promise<Tender> => api.get<Tender>(`/api/tenders/${id}`),

  analyzeRisk: (id: string, useAi: boolean = true): Promise<RiskScore> =>
    api.post<RiskScore>(`/api/tenders/${id}/analyze-risk?use_ai=${useAi}`),

  getInvestigationPackage: (id: string): Promise<InvestigationPackage> =>
    api.get<InvestigationPackage>(`/api/tenders/${id}/investigation-package`),

  getCollusionAnalysis: (id: string): Promise<CollusionAnalysis> =>
    api.get<CollusionAnalysis>(`/api/tenders/${id}/collusion-analysis`),
};
