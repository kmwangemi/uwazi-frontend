import { suppliersService } from '@/lib/services/suppliersService';
import { SupplierFilters } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export const supplierKeys = {
  all: ['suppliers'] as const,
  lists: () => [...supplierKeys.all, 'list'] as const,
  list: (filters: SupplierFilters) =>
    [...supplierKeys.lists(), filters] as const,
  details: () => [...supplierKeys.all, 'detail'] as const,
  detail: (id: string) => [...supplierKeys.details(), id] as const,
};

export const useSuppliersList = (filters: SupplierFilters) =>
  useQuery({
    queryKey: supplierKeys.list(filters),
    queryFn: () => suppliersService.list(filters),
  });

export const useSupplier = (id: string) =>
  useQuery({
    queryKey: supplierKeys.detail(id),
    queryFn: () => suppliersService.get(id),
    enabled: !!id,
  });
