import { api } from '@/lib/api';
import {
  Investigation,
  InvestigationFilters,
  PaginatedResponse,
  WhistleblowerFilters,
  WhistleblowerReport,
} from '@/lib/types';

export const investigationsService = {
  list: (
    filters: InvestigationFilters,
  ): Promise<PaginatedResponse<Investigation>> => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.risk_level) params.append('risk_level', filters.risk_level);
    params.append('page', (filters.page ?? 1).toString());
    params.append('limit', (filters.limit ?? 20).toString());
    return api.get(`/investigations?${params.toString()}`);
  },

  get: (id: string): Promise<Investigation> => api.get(`/investigations/${id}`),

  create: (payload: {
    tender_id: string;
    title: string;
    tender_ref?: string;
    risk_level?: string;
    findings?: string;
    investigator_name?: string;
  }): Promise<Investigation> => api.post('/investigations', payload),

  update: (
    id: string,
    payload: {
      status?: string;
      findings?: string;
      investigator_name?: string;
    },
  ): Promise<Investigation> => api.patch(`/investigations/${id}`, payload),

  listWhistleblower: (
    filters: WhistleblowerFilters,
  ): Promise<PaginatedResponse<WhistleblowerReport>> => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.urgency) params.append('urgency', filters.urgency);
    if (filters.is_reviewed !== undefined)
      params.append('is_reviewed', String(filters.is_reviewed));
    params.append('page', (filters.page ?? 1).toString());
    params.append('limit', (filters.limit ?? 20).toString());
    return api.get(`/investigations/whistleblower?${params.toString()}`);
  },

  getWhistleblower: (id: string): Promise<WhistleblowerReport> =>
    api.get(`/investigations/whistleblower/${id}`),

  reviewReport: (
    id: string,
    payload: {
      reviewer_id: string;
      reviewer_notes?: string;
      is_credible?: boolean;
    },
  ): Promise<WhistleblowerReport> =>
    api.patch(`/investigations/whistleblower/${id}/review`, payload),
};
