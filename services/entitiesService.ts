import api from '@/lib/api';
import type {
  ApiResponse,
  FilterParams,
  PaginationParams,
} from '@/types/common';
import type { ProcuringEntity } from '@/types/entity';

export const entitiesService = {
  getEntities: async (
    params: PaginationParams &
      FilterParams & {
        entity_type?: string;
        county?: string;
        is_flagged?: boolean;
      },
  ): Promise<ApiResponse<ProcuringEntity[]>> => {
    const response = await api.get<{ total: number; items: ProcuringEntity[] }>(
      '/entities',
      { params },
    );
    return {
      data: response.data.items,
      meta: {
        total: response.data.total,
        page: params.page ?? 1,
        limit: params.limit ?? 50,
      },
    };
  },

  getEntityById: async (id: string): Promise<ProcuringEntity> => {
    const response = await api.get<ProcuringEntity>(`/entities/${id}`);
    return response.data;
  },

  getEntityByCode: async (code: string): Promise<ProcuringEntity> => {
    const response = await api.get<ProcuringEntity>(`/entities/code/${code}`);
    return response.data;
  },
};
