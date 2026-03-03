import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { investigationsService } from '@/services/investigationsService';
import { PaginationParams } from '@/types/common';

export const investigationKeys = {
    all: ['investigations'] as const,
    lists: () => [...investigationKeys.all, 'list'] as const,
    list: (params: string) =>
        [...investigationKeys.lists(), { params }] as const,
    details: () => [...investigationKeys.all, 'detail'] as const,
    detail: (id: number) => [...investigationKeys.details(), id] as const,
};

export function useInvestigations(
    params: PaginationParams & Record<string, any>,
) {
    return useQuery({
        queryKey: investigationKeys.list(JSON.stringify(params)),
        queryFn: () => investigationsService.getInvestigations(params),
    });
}

export function useInvestigation(id: number) {
    return useQuery({
        queryKey: investigationKeys.detail(id),
        queryFn: () => investigationsService.getInvestigationById(id),
        enabled: !!id,
    });
}

export function useCreateInvestigation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => investigationsService.createInvestigation(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: investigationKeys.lists() });
        },
    });
}

export function useUpdateInvestigation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) =>
            investigationsService.updateInvestigation(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: investigationKeys.detail(variables.id),
            });
            queryClient.invalidateQueries({ queryKey: investigationKeys.lists() });
        },
    });
}

export function useCloseInvestigation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, outcome }: { id: number; outcome: string }) =>
            investigationsService.closeInvestigation(id, outcome),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: investigationKeys.detail(variables.id),
            });
            queryClient.invalidateQueries({ queryKey: investigationKeys.lists() });
        },
    });
}

export function useUploadEvidence() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            investigationId,
            file,
        }: {
            investigationId: number;
            file: File;
        }) => investigationsService.uploadEvidence(investigationId, file),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: investigationKeys.detail(variables.investigationId),
            });
        },
    });
}
