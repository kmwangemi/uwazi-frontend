import { api } from '@/lib/api';
import {
  PaginatedResponse,
  WhistleblowerFilters,
  WhistleblowerListItem,
  WhistleblowerSubmitRequest,
  WhistleblowerSubmitResponse,
} from '@/lib/types';

export const whistleblowerService = {
  submit: (
    report: WhistleblowerSubmitRequest,
  ): Promise<WhistleblowerSubmitResponse> =>
    api.post<WhistleblowerSubmitResponse>('/whistleblower/submit', report),

  list: (
    filters?: WhistleblowerFilters,
  ): Promise<PaginatedResponse<WhistleblowerListItem>> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.urgency) params.append('urgency', filters.urgency);
    if (filters?.is_reviewed !== undefined)
      params.append('is_reviewed', String(filters.is_reviewed));
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    return api.get<PaginatedResponse<WhistleblowerListItem>>(
      `/whistleblower/reports?${params.toString()}`,
    );
  },
};
