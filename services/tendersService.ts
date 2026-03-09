import api from '@/lib/api';
import type {
  ApiResponse,
  FilterParams,
  PaginationParams,
} from '@/types/common';
import type {
  Tender,
  TenderCreatePayload,
  TenderOriginal,
} from '@/types/tender';

export const tendersService = {
  getTenders: async (
    params: PaginationParams & FilterParams,
  ): Promise<ApiResponse<Tender[]>> => {
    const response = await api.get<TenderOriginal[]>('/tenders', { params });
    // Backend returns a plain array — wrap it in ApiResponse shape
    const data = response.data as unknown as Tender[];
    return {
      data,
      meta: {
        total: data.length,
        page: params.page ?? 1,
        limit: params.limit ?? 50,
      },
    };
  },

  createTender: async (
    payload: TenderCreatePayload,
  ): Promise<TenderOriginal> => {
    const { attachments, ...fields } = payload;
    const formData = new FormData();
    formData.append('data', JSON.stringify(fields));
    if (attachments?.length) {
      attachments.forEach(file => formData.append('attachments', file));
    }
    const response = await api.post<TenderOriginal>('/tenders', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getTenderById: async (id: string): Promise<Tender> => {
    // UUID string not number
    const response = await api.get<Tender>(`/tenders/${id}`);
    return response.data;
  },

  analyzeTender: async (id: string) => {
    const response = await api.post(`/analyze/tender/${id}`);
    return response.data;
  },

  uploadTenders: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/tenders/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  exportTenders: async (params: FilterParams): Promise<Blob> => {
    const response = await api.get('/tenders/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  flagTender: async (id: string, reason: string) => {
    const response = await api.post(`/tenders/${id}/flag`, { reason });
    return response.data;
  },
};
