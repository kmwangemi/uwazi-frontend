import { useQuery, useMutation } from '@tanstack/react-query';
import { suppliersService } from '@/services/suppliersService';
import { PaginationParams } from '@/types/common';

export const supplierKeys = {
    all: ['suppliers'] as const,
    lists: () => [...supplierKeys.all, 'list'] as const,
    list: (params: string) => [...supplierKeys.lists(), { params }] as const,
    details: () => [...supplierKeys.all, 'detail'] as const,
    detail: (id: number) => [...supplierKeys.details(), id] as const,
};

export function useSuppliers(params: PaginationParams & Record<string, any>) {
    return useQuery({
        queryKey: supplierKeys.list(JSON.stringify(params)),
        queryFn: () => suppliersService.getSuppliers(params),
    });
}

export function useSupplier(id: number) {
    return useQuery({
        queryKey: supplierKeys.detail(id),
        queryFn: () => suppliersService.getSupplierById(id),
        enabled: !!id,
    });
}

export function useVerifySupplier() {
    return useMutation({
        mutationFn: (id: number) => suppliersService.verifySupplier(id),
    });
}

export function useFlagSupplier() {
    return useMutation({
        mutationFn: ({ id, reason }: { id: number; reason: string }) =>
            suppliersService.flagSupplier(id, reason),
    });
}
