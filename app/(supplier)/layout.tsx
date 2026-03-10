'use client';

import { SupplierLayout } from '@/components/layout/SupplierLayout';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

export default function SupplierLayoutPage({
  children,
}: {
  children: ReactNode;
}) {
  // const router = useRouter();
  // const { isAuthenticated, user, hydrate } = useAuthStore();
  // const [isReady, setIsReady] = useState(false);

  // useEffect(() => {
  //   hydrate();
  // }, [hydrate]);

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push('/login');
  //   } else if (user?.role !== 'SUPPLIER') {
  //     router.push('/dashboard');
  //   } else {
  //     setIsReady(true);
  //   }
  // }, [isAuthenticated, user, router]);

  // if (!isReady) {
  //   return (
  //     <div className='flex h-screen items-center justify-center bg-gray-50'>
  //       <LoadingSpinner text='Loading...' />
  //     </div>
  //   );
  // }

  return <SupplierLayout>{children}</SupplierLayout>;
}
