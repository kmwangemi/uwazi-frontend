import { API_BASE_URL, API_TIMEOUT } from '@/lib/constants';
import { useAuthStore } from '@/lib/store';
import axios, { AxiosError, AxiosInstance } from 'axios';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true, // ✅ sends auth_token + refresh_token cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Public routes — 401s here never trigger logout/redirect ──────────────────
const PUBLIC_PATHS = ['/login', '/register'];

const isPublicPage = () =>
  typeof window !== 'undefined' &&
  PUBLIC_PATHS.some(path => window.location.pathname.startsWith(path));

// ── Request interceptor — REMOVED token attachment ────────────────────────────
// ✅ No longer needed — FastAPI reads auth_token from HttpOnly cookie directly.
// Your backend dependency (CurrentUser) must read from cookie, not Authorization header.
apiClient.interceptors.request.use(config => {
  return config; // passthrough — cookies attach automatically
});

// ── Silent token refresh on 401 ───────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: () => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach(p => (error ? p.reject(error) : p.resolve()));
  failedQueue = [];
};

apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };
    const status = error.response?.status;

    // ✅ Pass through all non-401 errors
    if (status !== 401) {
      return Promise.reject(error);
    }

    // ✅ Pass through 401s on public pages
    if (isPublicPage()) {
      return Promise.reject(error);
    }

    // ✅ Pass through 401s from auth endpoints
    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/refresh');

    if (isAuthEndpoint || originalRequest._retry) {
      // Refresh token itself is expired/revoked — force logout
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined') window.location.href = '/login';
      return Promise.reject(error);
    }

    // ── Queue concurrent requests while refresh is running ───────────────
    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => apiClient(originalRequest!)); // ✅ no token to re-attach — cookie handles it
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // ✅ No body needed — refresh_token cookie is sent automatically
      await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true },
      );

      processQueue(null);
      return apiClient(originalRequest!); // ✅ retry with new auth_token cookie
    } catch (refreshError) {
      processQueue(refreshError);
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined') window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// ── Generic error message extractor ──────────────────────────────────────────
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    const message =
      data?.detail ||
      data?.error?.message ||
      data?.message ||
      error.message ||
      'An error occurred';
    if (Array.isArray(message)) {
      return message.map((err: { msg: string }) => err.msg).join(', ');
    }
    return message;
  }
  return 'An unexpected error occurred';
};

// ── Type-safe API helpers ─────────────────────────────────────────────────────
export const api = {
  get: <T>(url: string, config = {}) =>
    apiClient.get<T>(url, config).then(res => res.data),
  post: <T>(url: string, data?: unknown, config = {}) =>
    apiClient.post<T>(url, data, config).then(res => res.data),
  put: <T>(url: string, data?: unknown, config = {}) =>
    apiClient.put<T>(url, data, config).then(res => res.data),
  patch: <T>(url: string, data?: unknown, config = {}) =>
    apiClient.patch<T>(url, data, config).then(res => res.data),
  delete: <T>(url: string, config = {}) =>
    apiClient.delete<T>(url, config).then(res => res.data),
};
