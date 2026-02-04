import type { ApiResponse } from '@/types/common';
import axios, { type AxiosError, type AxiosInstance } from 'axios';
import { API_BASE_URL } from './constants';

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // Add request interceptor
    this.instance.interceptors.request.use(
      config => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error),
    );
    // Add response interceptor
    this.instance.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.clearAuthToken();
          // Redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      },
    );
  }
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }
  private clearAuthToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
  setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }
  getClient(): AxiosInstance {
    return this.instance;
  }
  async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.instance.get<ApiResponse<T>>(url, config);
    return response.data.data as T;
  }
  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.instance.post<ApiResponse<T>>(
      url,
      data,
      config,
    );
    return response.data.data as T;
  }
  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config);
    return response.data.data as T;
  }
  async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.instance.patch<ApiResponse<T>>(
      url,
      data,
      config,
    );
    return response.data.data as T;
  }
  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config);
    return response.data.data as T;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
