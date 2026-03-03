import api from '@/lib/api';
import { mockSupplierBids } from '@/lib/mockData';
import { FilterParams, PaginationParams, ApiResponse } from '@/types/common';
import { TenderOriginal, Tender } from '@/types/tender';

export interface BidPayload {
    tenderId: number;
    bidAmount: number;
    paymentTerms: string;
    deliveryTimeline: number;
    documents?: File[];
}

export const supplierTendersService = {
  getAvailableTenders: async (
    params: PaginationParams & FilterParams,
  ): Promise<ApiResponse<Tender[]>> => {
    try {
      const response = await api.get<ApiResponse<Tender[]>>(
        '/tenders/available',
        { params },
      );
      return response.data;
    } catch (error) {
      console.warn('API error, falling back to mock available tenders', error);
      // Fallback relies on generic tendersService logic if we want, but for Supplier we can just
      // fetch all mockTenders and filter by 'PUBLISHED' which the frontend handles partially,
      // but let's emulate a paginated response for published tenders.
      const { tendersService } = await import('./tendersService');
      const mockResp = await tendersService.getTenders(params);

      return {
        ...mockResp,
        data: mockResp.data.filter(t => t.status === 'PUBLISHED'),
      };
    }
  },

  getMyBids: async (
    params: PaginationParams & { status?: string },
  ): Promise<ApiResponse<typeof mockSupplierBids>> => {
    try {
      const response = await api.get<ApiResponse<typeof mockSupplierBids>>(
        '/supplier/bids',
        { params },
      );
      return response.data;
    } catch (error) {
      console.warn('API error, falling back to mock supplier bids', error);
      let filtered = [...mockSupplierBids];
      if (params.status && params.status !== 'all') {
        if (params.status === 'active') {
          filtered = filtered.filter(b =>
            ['Submitted', 'Under Evaluation', 'Shortlisted'].includes(b.status),
          );
        } else if (params.status === 'won') {
          filtered = filtered.filter(b => b.status === 'Awarded');
        } else if (params.status === 'rejected') {
          filtered = filtered.filter(b => b.status === 'Not Selected');
        }
      }

      const start = ((params.page || 1) - 1) * (params.limit || 10);
      const end = start + (params.limit || 10);
      const items = filtered.slice(start, end);

      return {
        data: items,
        meta: {
          total: filtered.length,
          page: params.page || 1,
          limit: params.limit || 10,
        },
      };
    }
  },

  submitBid: async (tenderId: number, data: BidPayload) => {
    try {
      const response = await api.post(`/tenders/${tenderId}/bids`, data);
      return response.data;
    } catch (error) {
      console.warn('API error, falling back to mock submit bid', error);
      return { success: true, message: 'Bid submitted successfully' };
    }
  },
};
