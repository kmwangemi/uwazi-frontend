import { api } from '@/lib/api';
import { RegisterFormValues } from '@/lib/schemas/auth';
import { LoginRequest, LoginResponse } from '@/lib/types/user';
import { useAuthStore } from '@/lib/store';

interface LogoutResponse {
  message: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  full_name: string;
  roles: string[];
  is_active: boolean;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    return api.post<LoginResponse>('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  logout: async (): Promise<LogoutResponse> => {
    const { refreshToken } = useAuthStore.getState();
    return await api.post<LogoutResponse>('/auth/logout', {
      refresh_token: refreshToken,
    });
  },
  register: async (data: RegisterFormValues): Promise<RegisterResponse> => {
    // Strip confirm_password — backend doesn't need it
    const { confirm_password, ...payload } = data;
    return api.post<RegisterResponse>('/auth/register', payload);
  },
};
