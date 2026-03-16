import { api } from '@/lib/api';
import {
  PaginatedResponse,
  WhistleblowerListItem,
  WhistleblowerReport,
  WhistleblowerResponse,
} from '@/lib/types';

export const whistleblowerService = {
  submit: (report: WhistleblowerReport): Promise<WhistleblowerResponse> =>
    api.post<WhistleblowerResponse>('/whistleblower/submit', report),

  list: (
    filters?: Record<string, string>,
  ): Promise<PaginatedResponse<WhistleblowerListItem>> => {
    const params = new URLSearchParams(filters || {});
    return api.get<PaginatedResponse<WhistleblowerListItem>>(
      `/whistleblower/reports?${params.toString()}`,
    );
  },
};
