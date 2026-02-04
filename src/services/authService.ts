import apiClient from '@/lib/api';
import { ENDPOINTS } from '@/lib/constants';
import type { LoginSchema, RegisterSchema } from '@/lib/validations';
import type { AuthToken, User } from '@/types/user';

export const authService = {
  async login(
    credentials: LoginSchema,
  ): Promise<{ user: User; token: AuthToken }> {
    const data = await apiClient.post<{ user: User; token: AuthToken }>(
      ENDPOINTS.AUTH.LOGIN,
      credentials,
    );
    if (data.token?.access_token) {
      apiClient.setAuthToken(data.token.access_token);
    }
    return data;
  },
  async register(
    userData: RegisterSchema,
  ): Promise<{ user: User; token: AuthToken }> {
    const data = await apiClient.post<{ user: User; token: AuthToken }>(
      '/auth/register',
      userData,
    );
    if (data.token?.access_token) {
      apiClient.setAuthToken(data.token.access_token);
    }
    return data;
  },
  async logout(): Promise<void> {
    await apiClient.post(ENDPOINTS.AUTH.LOGOUT, {});
  },
  async refreshToken(): Promise<AuthToken> {
    const data = await apiClient.post<AuthToken>(ENDPOINTS.AUTH.REFRESH, {});
    if (data.access_token) {
      apiClient.setAuthToken(data.access_token);
    }
    return data;
  },
  async getCurrentUser(): Promise<User> {
    return await apiClient.get<User>('/auth/me');
  },
  setAuthToken(token: string): void {
    apiClient.setAuthToken(token);
  },
  getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  },
  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('auth_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
  saveUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
  },
  clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  },
};
