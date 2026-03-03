import api from '@/lib/api';
import type { User } from '@/types/user';

export const authService = {
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  refreshToken: async (): Promise<{ token: string }> => {
    try {
      const response = await api.post<{ token: string }>('/auth/refresh');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
