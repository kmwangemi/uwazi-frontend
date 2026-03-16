import { api } from '@/lib/api';
import { PaginatedResponse, Supplier, SupplierFilters } from '@/lib/types';

export const suppliersService = {
  list: (filters: SupplierFilters): Promise<PaginatedResponse<Supplier>> => {
    const params = new URLSearchParams();
    if (filters.risk_level) params.append('risk_level', filters.risk_level);
    if (filters.county) params.append('county', filters.county);
    if (filters.age_min) params.append('age_min', filters.age_min.toString());
    if (filters.age_max) params.append('age_max', filters.age_max.toString());
    if (filters.has_red_flags) params.append('has_red_flags', 'true');
    params.append('page', (filters.page || 1).toString());
    params.append('limit', (filters.limit || 20).toString());
    return api.get<PaginatedResponse<Supplier>>(
      `/suppliers?${params.toString()}`,
    );
  },
  get: (id: string): Promise<Supplier> => api.get<Supplier>(`/suppliers/${id}`),
};
