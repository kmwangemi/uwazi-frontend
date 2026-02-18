import { create } from 'zustand'
import type { User } from '@/types/user'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  setUser: (user: User) => void
  hydrate: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (token, user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
      localStorage.setItem('user', JSON.stringify(user))
    }
    set({ token, user, isAuthenticated: true })
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    }
    set({ token: null, user: null, isAuthenticated: false })
  },
  setUser: (user) => set({ user }),
  hydrate: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      const userStr = localStorage.getItem('user')
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr)
          set({ token, user, isAuthenticated: true })
        } catch (e) {
          console.error('Failed to parse user from localStorage', e)
        }
      }
    }
  },
}))
