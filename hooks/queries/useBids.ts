import { bidsService } from '@/services/bidsService';
import type { PaginationParams } from '@/types/common';
import type { BidCreatePayload, BidStatusUpdate } from '@/types/bid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// ── Query keys ────────────────────────────────────────────────────────────────

export const bidKeys = {
  all: ['bids'] as const,

  // Bids scoped to a tender
  tenderBids: () => [...bidKeys.all, 'tender'] as const,
  tenderBidsList: (tenderId: string, params?: string) =>
    [...bidKeys.tenderBids(), tenderId, { params }] as const,

  // Current supplier's own bids
  myBids: () => [...bidKeys.all, 'my-bids'] as const,
  myBidsList: (params?: string) => [...bidKeys.myBids(), { params }] as const,

  // Single bid detail
  details: () => [...bidKeys.all, 'detail'] as const,
  detail: (bidId: string) => [...bidKeys.details(), bidId] as const,
};

// ── Queries ───────────────────────────────────────────────────────────────────

/** All bids on a specific tender — for admins / procurement officers */
export function useTenderBids(tenderId: string, params?: PaginationParams) {
  return useQuery({
    queryKey: bidKeys.tenderBidsList(tenderId, JSON.stringify(params)),
    queryFn: () => bidsService.getTenderBids(tenderId, params),
    enabled: !!tenderId,
  });
}

/** All bids submitted by the currently logged-in supplier */
export function useMyBids(params?: PaginationParams & { status?: string }) {
  return useQuery({
    queryKey: bidKeys.myBidsList(JSON.stringify(params)),
    queryFn: () => bidsService.getMyBids(params),
  });
}

/** Single bid by ID */
export function useBid(bidId: string) {
  return useQuery({
    queryKey: bidKeys.detail(bidId),
    queryFn: () => bidsService.getBidById(bidId),
    enabled: !!bidId,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

/** Submit a new bid on a tender */
export function useCreateBid(tenderId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BidCreatePayload) =>
      bidsService.createBid(tenderId, payload),
    onSuccess: newBid => {
      // Invalidate tender's bid list so it refetches
      queryClient.invalidateQueries({
        queryKey: bidKeys.tenderBidsList(tenderId),
      });
      // Invalidate supplier's own bids list
      queryClient.invalidateQueries({ queryKey: bidKeys.myBids() });
      toast.success('Bid submitted successfully!', {
        description: `Bid reference: ${newBid.bid_reference}`,
      });
    },
    onError: () => {
      toast.error('Failed to submit bid. Please try again.');
    },
  });
}

/** Withdraw / delete a bid */
export function useWithdrawBid(tenderId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bidId: string) => bidsService.withdrawBid(bidId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bidKeys.myBids() });
      if (tenderId) {
        queryClient.invalidateQueries({
          queryKey: bidKeys.tenderBidsList(tenderId),
        });
      }
      toast.success('Bid withdrawn successfully.');
    },
    onError: () => {
      toast.error('Failed to withdraw bid.');
    },
  });
}

/** Update bid status — admin use */
export function useUpdateBidStatus(tenderId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bidId,
      payload,
    }: {
      bidId: string;
      payload: BidStatusUpdate;
    }) => bidsService.updateBidStatus(bidId, payload),
    onSuccess: updatedBid => {
      // Update the cached single bid
      queryClient.setQueryData(bidKeys.detail(updatedBid.id), updatedBid);
      // Refresh the tender's bid list
      if (tenderId) {
        queryClient.invalidateQueries({
          queryKey: bidKeys.tenderBidsList(tenderId),
        });
      }
      toast.success('Bid status updated.');
    },
    onError: () => {
      toast.error('Failed to update bid status.');
    },
  });
}

/** Accept a bid — marks tender as awarded */
export function useAcceptBid(tenderId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bidId: string) => bidsService.acceptBid(bidId),
    onSuccess: updatedBid => {
      queryClient.setQueryData(bidKeys.detail(updatedBid.id), updatedBid);
      queryClient.invalidateQueries({
        queryKey: bidKeys.tenderBidsList(tenderId),
      });
      // Also invalidate the tender itself since its status changes to awarded
      queryClient.invalidateQueries({
        queryKey: ['tenders', 'detail', tenderId],
      });
      toast.success('Bid accepted. Tender marked as awarded.');
    },
    onError: () => {
      toast.error('Failed to accept bid.');
    },
  });
}

/** Reject a bid */
export function useRejectBid(tenderId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bidId, reason }: { bidId: string; reason: string }) =>
      bidsService.rejectBid(bidId, reason),
    onSuccess: updatedBid => {
      queryClient.setQueryData(bidKeys.detail(updatedBid.id), updatedBid);
      queryClient.invalidateQueries({
        queryKey: bidKeys.tenderBidsList(tenderId),
      });
      toast.success('Bid rejected.');
    },
    onError: () => {
      toast.error('Failed to reject bid.');
    },
  });
}
