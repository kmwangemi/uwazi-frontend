import { whistleblowerService } from '@/lib/services/whistleblowerService';
import { WhistleblowerReport } from '@/lib/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const whistleblowerKeys = {
  all: ['whistleblower'] as const,
  lists: () => [...whistleblowerKeys.all, 'list'] as const,
  list: (filters?: Record<string, string>) =>
    [...whistleblowerKeys.lists(), filters] as const,
};

export const useWhistleblowerReports = (filters?: Record<string, string>) =>
  useQuery({
    queryKey: whistleblowerKeys.list(filters),
    queryFn: () => whistleblowerService.list(filters),
  });

export const useSubmitWhistleblowerReport = () => {
  return useMutation({
    mutationFn: (report: WhistleblowerReport) =>
      whistleblowerService.submit(report),
  });
};
