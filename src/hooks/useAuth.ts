'use client';

import type { LoginSchema, RegisterSchema } from '@/lib/validations';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/types/user';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useAuth() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    setUser,
    setToken,
    setLoading,
    setError,
    logout,
  } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth from stored values
  useEffect(() => {
    const storedUser = authService.getStoredUser();
    const storedToken = authService.getStoredToken();
    if (storedUser && storedToken) {
      useAuthStore.setState({
        user: storedUser,
        token: storedToken,
        isAuthenticated: true,
      });
    }
    setIsInitialized(true);
  }, []);

  const login = async (credentials: LoginSchema) => {
    try {
      setLoading(true);
      setError(null);
      const { user, token } = await authService.login(credentials);
      authService.saveUser(user);
      authService.setAuthToken(token.access_token);
      setUser(user);
      setToken(token.access_token);
      router.push('/dashboard');
      return true;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Login failed';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterSchema) => {
    try {
      setLoading(true);
      setError(null);
      const { user, token } = await authService.register(userData);
      authService.saveUser(user);
      authService.setAuthToken(token.access_token);
      setUser(user);
      setToken(token.access_token);
      router.push('/dashboard');
      return true;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Registration failed';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authService.clearAuth();
      logout();
      router.push('/login');
      setLoading(false);
    }
  };

  const updateUserProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      authService.saveUser(updatedUser);
    }
  };

  return {
    user,
    isAuthenticated,
    isInitialized,
    login,
    register,
    logout: handleLogout,
    updateUserProfile,
  };
}
