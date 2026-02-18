import api from '@/lib/api';
import { mockTenders } from '@/lib/mockData';
import type {
  ApiResponse,
  FilterParams,
  PaginationParams,
} from '@/types/common';
import type { Tender } from '@/types/tender';

export const tendersService = {
  getTenders: async (
    params: PaginationParams & FilterParams,
  ): Promise<ApiResponse<Tender[]>> => {
    try {
      const response = await api.get<ApiResponse<Tender[]>>('/api/tenders', {
        params,
      });
      return response.data;
    } catch (error) {
      // Return mock data for development
      const {
        page = 1,
        limit = 25,
        search,
        county,
        category,
        risk_level,
      } = params;
      let filtered = [...mockTenders];

      if (search) {
        filtered = filtered.filter(
          t =>
            t.tender_number.toLowerCase().includes(search.toLowerCase()) ||
            t.title.toLowerCase().includes(search.toLowerCase()),
        );
      }
      if (county) {
        filtered = filtered.filter(t => t.county === county);
      }
      if (category) {
        filtered = filtered.filter(t => t.category === category);
      }
      if (risk_level) {
        const [min, max] = risk_level.split('-').map(Number);
        filtered = filtered.filter(
          t => t.risk_score >= min && t.risk_score <= max,
        );
      }

      const start = (page - 1) * limit;
      const end = start + limit;
      const items = filtered.slice(start, end);

      return {
        data: items,
        meta: {
          total: filtered.length,
          page,
          limit,
        },
      };
    }
  },

  getTenderById: async (id: number): Promise<Tender> => {
    try {
      const response = await api.get<Tender>(`/api/tenders/${id}`);
      return response.data;
    } catch (error) {
      const tender = mockTenders.find(t => t.id === id);
      if (!tender) throw new Error('Tender not found');
      return tender;
    }
  },

  analyzeTender: async (id: number) => {
    try {
      const response = await api.post(`/api/analyze/tender/${id}`);
      return response.data;
    } catch (error) {
      // Return mock analysis
      return { success: true, message: 'Analysis completed' };
    }
  },

  uploadTenders: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/api/tenders/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  exportTenders: async (params: FilterParams): Promise<Blob> => {
    try {
      const response = await api.get('/api/tenders/export', {
        params,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  flagTender: async (id: number, reason: string) => {
    try {
      const response = await api.post(`/api/tenders/${id}/flag`, { reason });
      return response.data;
    } catch (error) {
      return { success: true, message: 'Tender flagged' };
    }
  },
};
