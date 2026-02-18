import api from '@/lib/api'
import type { LoginRequest, LoginResponse, User } from '@/types/user'

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/api/auth/login', { email, password })
      return response.data
    } catch (error) {
      // Mock login for development
      if (email && password) {
        return {
          token: 'mock-token-' + Date.now(),
          user: {
            id: 1,
            email,
            name: email.split('@')[0],
            role: 'INVESTIGATOR',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        }
      }
      throw error
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/api/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get<User>('/api/auth/me')
      return response.data
    } catch (error) {
      throw error
    }
  },

  refreshToken: async (): Promise<{ token: string }> => {
    try {
      const response = await api.post<{ token: string }>('/api/auth/refresh')
      return response.data
    } catch (error) {
      throw error
    }
  },
}
