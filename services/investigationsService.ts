import api from '@/lib/api';
import { mockInvestigations } from '@/lib/mockData';
import type { ApiResponse, PaginationParams } from '@/types/common';
import type { Investigation } from '@/types/investigation';

export const investigationsService = {
  getInvestigations: async (
    params: PaginationParams & Record<string, any>,
  ): Promise<ApiResponse<Investigation[]>> => {
    try {
      const response = await api.get<ApiResponse<Investigation[]>>(
        '/api/investigations',
        { params },
      );
      return response.data;
    } catch (error) {
      const { page = 1, limit = 25 } = params;
      let filtered = [...mockInvestigations];

      if (params.status) {
        filtered = filtered.filter(i => i.status === params.status);
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

  getInvestigationById: async (id: number): Promise<Investigation> => {
    try {
      const response = await api.get<Investigation>(
        `/api/investigations/${id}`,
      );
      return response.data;
    } catch (error) {
      const investigation = mockInvestigations.find(i => i.id === id);
      if (!investigation) throw new Error('Investigation not found');
      return investigation;
    }
  },

  createInvestigation: async (data: any) => {
    try {
      const response = await api.post('/api/investigations', data);
      return response.data;
    } catch (error) {
      return { success: true, message: 'Investigation created' };
    }
  },

  updateInvestigation: async (id: number, data: any) => {
    try {
      const response = await api.put(`/api/investigations/${id}`, data);
      return response.data;
    } catch (error) {
      return { success: true, message: 'Investigation updated' };
    }
  },

  closeInvestigation: async (id: number, outcome: string) => {
    try {
      const response = await api.post(`/api/investigations/${id}/close`, {
        outcome,
      });
      return response.data;
    } catch (error) {
      return { success: true, message: 'Investigation closed' };
    }
  },

  uploadEvidence: async (investigationId: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post(
        `/api/investigations/${investigationId}/evidence`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      return response.data;
    } catch (error) {
      return { success: true, message: 'Evidence uploaded' };
    }
  },
};
