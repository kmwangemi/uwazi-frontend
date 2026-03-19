import { whistleblowerService } from '@/lib/services/whistleblowerService';
import {
  WhistleblowerFilters,
  WhistleblowerSubmitRequest,
  WhistleblowerSubmitResponse,
} from '@/lib/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const whistleblowerKeys = {
  all: ['whistleblower'] as const,
  lists: () => [...whistleblowerKeys.all, 'list'] as const,
  list: (filters?: WhistleblowerFilters) =>
    [...whistleblowerKeys.lists(), filters] as const,
};

export const useWhistleblowerReports = (filters?: WhistleblowerFilters) =>
  useQuery({
    queryKey: whistleblowerKeys.list(filters),
    queryFn: () => whistleblowerService.list(filters),
  });

export const useSubmitWhistleblowerReport = () =>
  useMutation({
    mutationFn: (
      report: WhistleblowerSubmitRequest,
    ): Promise<WhistleblowerSubmitResponse> =>
      whistleblowerService.submit(report), // ← WhistleblowerSubmitRequest not WhistleblowerReport
  });
