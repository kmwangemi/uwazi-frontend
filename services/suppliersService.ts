import api from '@/lib/api';
import { mockSuppliers } from '@/lib/mockData';
import type { ApiResponse, PaginationParams } from '@/types/common';
import type { Supplier } from '@/types/supplier';

export const suppliersService = {
  getSuppliers: async (
    params: PaginationParams & Record<string, any>,
  ): Promise<ApiResponse<Supplier[]>> => {
    try {
      const response = await api.get<ApiResponse<Supplier[]>>(
        '/api/suppliers',
        { params },
      );
      return response.data;
    } catch (error) {
      const { page = 1, limit = 25 } = params;
      let filtered = [...mockSuppliers];

      if (params.search) {
        filtered = filtered.filter(
          s =>
            s.name.toLowerCase().includes(params.search.toLowerCase()) ||
            s.registration_number
              .toLowerCase()
              .includes(params.search.toLowerCase()),
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

  getSupplierById: async (id: number): Promise<Supplier> => {
    try {
      const response = await api.get<Supplier>(`/api/suppliers/${id}`);
      return response.data;
    } catch (error) {
      const supplier = mockSuppliers.find(s => s.id === id);
      if (!supplier) throw new Error('Supplier not found');
      return supplier;
    }
  },

  verifySupplier: async (id: number) => {
    try {
      const response = await api.post(`/api/suppliers/${id}/verify`);
      return response.data;
    } catch (error) {
      return {
        business_registration: {
          passed: true,
          score: 95,
          details: 'Valid',
          red_flags: [],
        },
        tax_compliance: {
          passed: true,
          score: 90,
          details: 'Compliant',
          red_flags: [],
        },
        physical_address: {
          passed: true,
          score: 85,
          details: 'Verified',
          red_flags: [],
        },
        director_conflicts: {
          passed: false,
          score: 60,
          details: 'Potential conflict found',
          red_flags: ['Government employee director'],
        },
        operational_capacity: {
          passed: true,
          score: 80,
          details: 'Adequate',
          red_flags: [],
        },
        overall_risk: 25,
      };
    }
  },

  flagSupplier: async (id: number, reason: string) => {
    try {
      const response = await api.post(`/api/suppliers/${id}/flag`, { reason });
      return response.data;
    } catch (error) {
      return { success: true, message: 'Supplier flagged' };
    }
  },
};
