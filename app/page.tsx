'use client';

import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  console.log('isAuthenticated:', isAuthenticated);
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, router]);
  return (
    <div className='flex h-screen items-center justify-center bg-gray-50'>
      <LoadingSpinner text='Redirecting...' />
    </div>
  );
}
