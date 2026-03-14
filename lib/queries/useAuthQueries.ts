import { RegisterFormValues } from '@/lib/schemas/auth';
import { authService } from '@/lib/services/authService';
import { useAuthStore } from '@/lib/store';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
  const router = useRouter();
  const { setUser } = useAuthStore();
  return useMutation({
    mutationFn: authService.login,
    onSuccess: data => {
      setUser(data);
      router.push('/');
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const { logout } = useAuthStore();
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      logout();
      router.push('/login');
    },
    onError: () => {
      // Even if API fails, clear local state and redirect
      logout();
      router.push('/login');
    },
  });
};

export const useRegister = () =>
  useMutation({
    mutationFn: (data: RegisterFormValues) => authService.register(data),
  });
