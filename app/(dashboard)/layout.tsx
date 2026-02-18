'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

export default function DashboardLayoutPage({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setIsReady(true);
    }
  }, [isAuthenticated, router]);
  if (!isReady) {
    return (
      <div className='flex h-screen items-center justify-center bg-gray-50'>
        <LoadingSpinner text='Loading...' />
      </div>
    );
  }
  return <DashboardLayout>{children}</DashboardLayout>;
}
