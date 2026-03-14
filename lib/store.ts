import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { LoginResponse } from '@/lib/types/user';

interface AuthState {
  user: LoginResponse | null;
  hasHydrated: boolean;
  setUser: (user: LoginResponse) => void;
  logout: () => void;
  checkAuth: () => boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      hasHydrated: false,
      setUser: user => set({ user }),
      logout: () => set({ user: null }),
      checkAuth: () => !!get().user,
      setHasHydrated: state => set({ hasHydrated: state }),
    }),
    {
      name: 'auth-storage',
      partialize: state => ({ user: state.user }), // ✅ only user, no tokens
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

// UI state store
interface UIStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>(set => ({
  sidebarOpen: true,
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: open => set({ sidebarOpen: open }),
}));
