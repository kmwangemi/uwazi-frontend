import { investigationsService } from '@/lib/services/investigationsService';
import { InvestigationFilters, WhistleblowerFilters } from '@/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const investigationKeys = {
  all: ['investigations'] as const,
  lists: () => [...investigationKeys.all, 'list'] as const,
  list: (f: InvestigationFilters) => [...investigationKeys.lists(), f] as const,
  details: () => [...investigationKeys.all, 'detail'] as const,
  detail: (id: string) => [...investigationKeys.details(), id] as const,
  whistleblower: ['whistleblower'] as const,
  wbLists: () => [...investigationKeys.whistleblower, 'list'] as const,
  wbList: (f: WhistleblowerFilters) =>
    [...investigationKeys.wbLists(), f] as const,
  wbDetail: (id: string) =>
    [...investigationKeys.whistleblower, 'detail', id] as const,
};

export const useInvestigationsList = (filters: InvestigationFilters) =>
  useQuery({
    queryKey: investigationKeys.list(filters),
    queryFn: () => investigationsService.list(filters),
  });

export const useInvestigation = (id: string) =>
  useQuery({
    queryKey: investigationKeys.detail(id),
    queryFn: () => investigationsService.get(id),
    enabled: !!id,
  });

export const useCreateInvestigation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: investigationsService.create,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: investigationKeys.lists() }),
  });
};

export const useUpdateInvestigation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: {
      id: string;
      status?: string;
      findings?: string;
      investigator_name?: string;
    }) => investigationsService.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: investigationKeys.lists() });
      qc.invalidateQueries({ queryKey: investigationKeys.detail(id) });
    },
  });
};

export const useWhistleblowerList = (filters: WhistleblowerFilters) =>
  useQuery({
    queryKey: investigationKeys.wbList(filters),
    queryFn: () => investigationsService.listWhistleblower(filters),
  });

export const useWhistleblowerReport = (id: string) =>
  useQuery({
    queryKey: investigationKeys.wbDetail(id),
    queryFn: () => investigationsService.getWhistleblower(id),
    enabled: !!id,
  });

export const useReviewReport = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: {
      id: string;
      reviewer_id: string;
      reviewer_notes?: string;
      is_credible?: boolean;
    }) => investigationsService.reviewReport(id, payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: investigationKeys.whistleblower }),
  });
};
