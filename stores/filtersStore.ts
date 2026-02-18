import { create } from 'zustand'
import type { FilterParams } from '@/types/common'

interface FiltersState {
  tenderFilters: FilterParams
  updateTenderFilters: (filters: Partial<FilterParams>) => void
  clearTenderFilters: () => void
  supplierFilters: Record<string, any>
  updateSupplierFilters: (filters: Record<string, any>) => void
  clearSupplierFilters: () => void
}

export const useFiltersStore = create<FiltersState>((set) => ({
  tenderFilters: {},
  updateTenderFilters: (filters) => 
    set((state) => ({ 
      tenderFilters: { ...state.tenderFilters, ...filters } 
    })),
  clearTenderFilters: () => set({ tenderFilters: {} }),
  supplierFilters: {},
  updateSupplierFilters: (filters) => set({ supplierFilters: filters }),
  clearSupplierFilters: () => set({ supplierFilters: {} }),
}))
