import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    supplierTendersService,
    BidPayload,
} from '@/services/supplierTendersService';
import { FilterParams, PaginationParams } from '@/types/common';

export const supplierTenderKeys = {
    all: ['supplierTenders'] as const,
    available: () => [...supplierTenderKeys.all, 'available'] as const,
    availableList: (params: string) =>
        [...supplierTenderKeys.available(), params] as const,
    bids: () => [...supplierTenderKeys.all, 'bids'] as const,
    bidsList: (params: string) => [...supplierTenderKeys.bids(), params] as const,
};

export function useAvailableTenders(params: PaginationParams & FilterParams) {
    return useQuery({
        queryKey: supplierTenderKeys.availableList(JSON.stringify(params)),
        queryFn: () => supplierTendersService.getAvailableTenders(params),
    });
}

export function useMyBids(params: PaginationParams & { status?: string }) {
    return useQuery({
        queryKey: supplierTenderKeys.bidsList(JSON.stringify(params)),
        queryFn: () => supplierTendersService.getMyBids(params),
    });
}

export function useSubmitBid(tenderId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: BidPayload) =>
            supplierTendersService.submitBid(tenderId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: supplierTenderKeys.bids() });
        },
    });
}
