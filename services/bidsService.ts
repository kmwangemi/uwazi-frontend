// services/bidsService.ts
import api from '@/lib/api';
import type { ApiResponse, PaginationParams } from '@/types/common';
import type { Bid, BidCreatePayload, BidStatusUpdate } from '@/types/bid';

export const bidsService = {
  // ── Supplier actions ────────────────────────────────────────────────────────

  createBid: async (
    tenderId: string,
    payload: BidCreatePayload,
  ): Promise<Bid> => {
    const {
      technicalDocuments,
      financialDocuments,
      complianceDocuments,
      ...fields
    } = payload;

    const formData = new FormData();
    formData.append('data', JSON.stringify(fields));

    technicalDocuments?.forEach(file =>
      formData.append('technical_documents', file),
    );
    financialDocuments?.forEach(file =>
      formData.append('financial_documents', file),
    );
    complianceDocuments?.forEach(file =>
      formData.append('compliance_documents', file),
    );

    const response = await api.post<Bid>(
      `/tenders/${tenderId}/bids`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return response.data;
  },

  // Get all bids for a specific tender (admin / procuring entity view)
  getTenderBids: async (
    tenderId: string,
    params?: PaginationParams,
  ): Promise<ApiResponse<Bid[]>> => {
    const response = await api.get<{ total: number; items: Bid[] }>(
      `/tenders/${tenderId}/bids`,
      { params },
    );
    return {
      data: response.data.items,
      meta: {
        total: response.data.total,
        page: params?.page ?? 1,
        limit: params?.limit ?? 50,
      },
    };
  },

  // Get all bids submitted by the current supplier
  getMyBids: async (
    params?: PaginationParams & { status?: string },
  ): Promise<ApiResponse<Bid[]>> => {
    const response = await api.get<{ total: number; items: Bid[] }>(
      '/bids/my-bids',
      { params },
    );
    return {
      data: response.data.items,
      meta: {
        total: response.data.total,
        page: params?.page ?? 1,
        limit: params?.limit ?? 50,
      },
    };
  },

  getBidById: async (bidId: string): Promise<Bid> => {
    const response = await api.get<Bid>(`/bids/${bidId}`);
    return response.data;
  },

  withdrawBid: async (bidId: string): Promise<void> => {
    await api.delete(`/bids/${bidId}`);
  },

  // ── Admin / procurement actions ─────────────────────────────────────────────

  updateBidStatus: async (
    bidId: string,
    payload: BidStatusUpdate,
  ): Promise<Bid> => {
    const response = await api.patch<Bid>(`/bids/${bidId}/status`, payload);
    return response.data;
  },

  acceptBid: async (bidId: string): Promise<Bid> => {
    const response = await api.post<Bid>(`/bids/${bidId}/accept`);
    return response.data;
  },

  rejectBid: async (bidId: string, reason: string): Promise<Bid> => {
    const response = await api.post<Bid>(`/bids/${bidId}/reject`, { reason });
    return response.data;
  },
};
