'use client';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
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
      <div className='flex min-h-screen items-center justify-center bg-[#0f1117]'>
        <LoadingSpinner text='Loading...' />
      </div>
    );
  }
  // Don't render dashboard content until authenticated
  if (!token) return null;
  return (
    <div className='flex min-h-screen'>
      <Sidebar />
      <div className='flex-1 flex flex-col'>
        <Topbar />
        <main className='flex-1 pt-16 pb-6 px-4 lg:px-6 overflow-auto'>
          {children}
        </main>
      </div>
    </div>
  );
}
