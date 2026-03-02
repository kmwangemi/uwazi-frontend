import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

export const authKeys = {
    all: ['auth'] as const,
    user: () => [...authKeys.all, 'user'] as const,
};

export function useCurrentUser() {
    return useQuery({
        queryKey: authKeys.user(),
        queryFn: () => authService.getCurrentUser(),
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useLogout() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { logout } = useAuthStore();

    return useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            logout();
            queryClient.clear();
            router.push('/login');
        },
    });
}

export function useRefreshToken() {
    const { setToken } = useAuthStore();

    return useMutation({
        mutationFn: () => authService.refreshToken(),
        onSuccess: data => {
            setToken(data.token);
        },
    });
}
