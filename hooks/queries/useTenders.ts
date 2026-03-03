import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tendersService } from '@/services/tendersService';
import type { FilterParams, PaginationParams } from '@/types/common';
import type { TenderCreatePayload } from '@/types/tender';

export const tenderKeys = {
  all: ['tenders'] as const,
  lists: () => [...tenderKeys.all, 'list'] as const,
  list: (params: string) => [...tenderKeys.lists(), { params }] as const,
  details: () => [...tenderKeys.all, 'detail'] as const,
  detail: (id: string) => [...tenderKeys.details(), id] as const, // string UUID
};

export function useTenders(params: PaginationParams & FilterParams) {
  return useQuery({
    queryKey: tenderKeys.list(JSON.stringify(params)),
    queryFn: () => tendersService.getTenders(params),
  });
}

export function useTender(id: string) {
  // string UUID
  return useQuery({
    queryKey: tenderKeys.detail(id),
    queryFn: () => tendersService.getTenderById(id),
    enabled: !!id,
  });
}

export function useCreateTender() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TenderCreatePayload) =>
      tendersService.createTender(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenderKeys.lists() });
    },
  });
}

export function useAnalyzeTender() {
  return useMutation({
    mutationFn: (id: string) => tendersService.analyzeTender(id),
  });
}

export function useUploadTenders() {
  return useMutation({
    mutationFn: (file: File) => tendersService.uploadTenders(file),
  });
}

export function useFlagTender() {
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      tendersService.flagTender(id, reason),
  });
}
