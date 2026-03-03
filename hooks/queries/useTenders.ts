import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tendersService } from '@/services/tendersService';
import { FilterParams, PaginationParams } from '@/types/common';

export const tenderKeys = {
    all: ['tenders'] as const,
    lists: () => [...tenderKeys.all, 'list'] as const,
    list: (params: string) => [...tenderKeys.lists(), { params }] as const,
    details: () => [...tenderKeys.all, 'detail'] as const,
    detail: (id: number) => [...tenderKeys.details(), id] as const,
};

export function useTenders(params: PaginationParams & FilterParams) {
    return useQuery({
        queryKey: tenderKeys.list(JSON.stringify(params)),
        queryFn: () => tendersService.getTenders(params),
    });
}

export function useTender(id: number) {
    return useQuery({
        queryKey: tenderKeys.detail(id),
        queryFn: () => tendersService.getTenderById(id),
        enabled: !!id,
    });
}

export function useCreateTender() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => tendersService.createTender(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tenderKeys.lists() });
        },
    });
}

export function useAnalyzeTender() {
    return useMutation({
        mutationFn: (id: number) => tendersService.analyzeTender(id),
    });
}

export function useUploadTenders() {
    return useMutation({
        mutationFn: (file: File) => tendersService.uploadTenders(file),
    });
}

export function useFlagTender() {
    return useMutation({
        mutationFn: ({ id, reason }: { id: number; reason: string }) =>
            tendersService.flagTender(id, reason),
    });
}
