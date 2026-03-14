import { tendersService } from '@/lib/services/tendersService';
import { TenderFilters } from '@/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const tenderKeys = {
  all: ['tenders'] as const,
  lists: () => [...tenderKeys.all, 'list'] as const,
  list: (filters: TenderFilters) => [...tenderKeys.lists(), filters] as const,
  details: () => [...tenderKeys.all, 'detail'] as const,
  detail: (id: string) => [...tenderKeys.details(), id] as const,
  risk: (id: string) => [...tenderKeys.detail(id), 'risk'] as const,
  investigation: (id: string) =>
    [...tenderKeys.detail(id), 'investigation'] as const,
  collusion: (id: string) => [...tenderKeys.detail(id), 'collusion'] as const,
};

export const useTendersList = (filters: TenderFilters) =>
  useQuery({
    queryKey: tenderKeys.list(filters),
    queryFn: () => tendersService.list(filters),
  });

export const useTender = (id: string) =>
  useQuery({
    queryKey: tenderKeys.detail(id),
    queryFn: () => tendersService.get(id),
    enabled: !!id,
  });

export const useAnalyzeTenderRisk = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (useAi?: boolean) => tendersService.analyzeRisk(id, useAi),
    onSuccess: data => {
      queryClient.setQueryData(tenderKeys.risk(id), data);
    },
  });
};

export const useInvestigationPackage = (id: string) =>
  useQuery({
    queryKey: tenderKeys.investigation(id),
    queryFn: () => tendersService.getInvestigationPackage(id),
    enabled: !!id,
  });

export const useCollusionAnalysis = (id: string) =>
  useQuery({
    queryKey: tenderKeys.collusion(id),
    queryFn: () => tendersService.getCollusionAnalysis(id),
    enabled: !!id,
  });
