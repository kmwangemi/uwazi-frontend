import type { User } from '@/types/user';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  hydrate: (user: User | null, token: string | null) => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  setUser: user =>
    set({
      user,
      isAuthenticated: user !== null,
    }),
  setToken: token =>
    set({
      token,
      isAuthenticated: !!token,
    }),
  setLoading: isLoading => set({ isLoading }),
  setError: error => set({ error }),
  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    }),
  hydrate: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: user !== null && token !== null,
    }),
}));
