'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuthStore } from '@/stores/authStore';
import { LoadingSpinner } from '../shared/LoadingSpinner';

interface SupplierLayoutProps {
  children: ReactNode;
}

export function SupplierLayout({ children }: SupplierLayoutProps) {
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
  // Don't render supplier content until authenticated
  if (!token) return null;
  return (
    <div className='flex h-screen overflow-hidden bg-gray-50'>
      <Sidebar />
      <div className='flex flex-1 flex-col overflow-hidden'>
        <Header />
        <main className='flex-1 overflow-auto'>
          <div className='container mx-auto px-4 py-8 sm:px-6 lg:px-8'>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
