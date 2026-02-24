'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export default function DashboardLayoutPage({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { token, hasHydrated } = useAuthStore();
  useEffect(() => {
    if (hasHydrated && !token) {
      router.replace('/login');
    }
  }, [token, hasHydrated, router]);
  if (!hasHydrated) {
    return (
      <div className='flex h-screen items-center justify-center bg-gray-50'>
        <LoadingSpinner text='Loading...' />
      </div>
    );
  }
  if (!token) return null;
  return <DashboardLayout>{children}</DashboardLayout>;
}
