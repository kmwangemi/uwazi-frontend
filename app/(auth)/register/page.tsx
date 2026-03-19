'use client';

import { RegisterForm } from '@/components/forms/RegisterForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/lib/store';
import { Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RegisterPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const isAdmin = user?.roles?.includes('admin') || user?.is_superuser; // ← array check

  useEffect(() => {
    if (user && !isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, router]);

  if (!isAdmin) {
    return (
      <div className='min-h-screen bg-[#0a0c0f] flex items-center justify-center p-4'>
        <div className='text-center'>
          <p className='text-[#ef4444] text-lg font-semibold'>Access Denied</p>
          <p className='text-[#94a3b8] mt-2'>
            Only administrators can access this page
          </p>
          <Button
            asChild
            className='mt-4 bg-[#00ff88] text-black hover:bg-[#00ff88]/90'
          >
            <Link href='/'>Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className='min-h-screen bg-[#0a0c0f] flex items-center justify-center p-4'>
      <div className='w-full max-w-md space-y-8'>
        {/* Header */}
        <div className='text-center space-y-3'>
          <div className='flex justify-center'>
            <Users className='w-12 h-12 text-[#00ff88]' />
          </div>
          <div>
            <h1 className='text-3xl font-bold text-white'>Add User</h1>
            <p className='text-[#94a3b8] mt-2'>
              Register a new user to the platform
            </p>
          </div>
        </div>
        {/* Form Card */}
        <Card className='bg-[#121418] border-[#1f2937] p-8'>
          <RegisterForm
            onSuccess={email => {
              console.log('User registered:', email);
            }}
          />
        </Card>
        {/* Back Link */}
        <div className='text-center'>
          <Link
            href='/'
            className='text-[#94a3b8] hover:text-[#00ff88] transition text-sm'
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
