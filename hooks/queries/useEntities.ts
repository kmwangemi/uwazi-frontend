import { entitiesService } from '@/services/entitiesService';
import type { FilterParams, PaginationParams } from '@/types/common';
import { useQuery } from '@tanstack/react-query';

export const entityKeys = {
  all: ['entities'] as const,
  lists: () => [...entityKeys.all, 'list'] as const,
  list: (params: string) => [...entityKeys.lists(), { params }] as const,
  details: () => [...entityKeys.all, 'detail'] as const,
  detail: (id: string) => [...entityKeys.details(), id] as const,
  codes: () => [...entityKeys.all, 'code'] as const,
  code: (code: string) => [...entityKeys.codes(), code] as const,
};

export function useEntities(
  params: PaginationParams &
    FilterParams & {
      entity_type?: string;
      county?: string;
      is_flagged?: boolean;
    },
) {
  return useQuery({
    queryKey: entityKeys.list(JSON.stringify(params)),
    queryFn: () => entitiesService.getEntities(params),
  });
}

export function useEntity(id: string) {
  return useQuery({
    queryKey: entityKeys.detail(id),
    queryFn: () => entitiesService.getEntityById(id),
    enabled: !!id,
  });
}

export function useEntityByCode(code: string) {
  return useQuery({
    queryKey: entityKeys.code(code),
    queryFn: () => entitiesService.getEntityByCode(code),
    enabled: !!code,
  });
}
