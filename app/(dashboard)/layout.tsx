'use client';

import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const hasHydrated = useAuthStore(state => state.hasHydrated);
  useEffect(() => {
    // Wait for Zustand to rehydrate from localStorage before checking auth
    if (hasHydrated && !user) {
      router.push('/login');
    }
  }, [hasHydrated, user, router]);
  // Show skeleton while store is rehydrating or redirecting
  if (!hasHydrated || !user) {
    return (
      <div className='flex min-h-screen'>
        <div className='w-60 hidden lg:block bg-[#0f1117] border-r border-[#1f2937]'>
          <Skeleton className='h-full' />
        </div>
        <div className='flex-1 flex flex-col'>
          <div className='h-16 border-b border-[#1f2937] bg-[#0a0c0f]' />
          <div className='flex-1 p-6 space-y-4'>
            <Skeleton className='h-32' />
            <Skeleton className='h-96' />
          </div>
        </div>
      </div>
    );
  }
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
