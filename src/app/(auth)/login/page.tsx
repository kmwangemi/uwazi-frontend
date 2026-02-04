'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { type LoginSchema, loginSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    setGeneralError(null);
    const success = await login(data);
    if (!success) {
      setGeneralError('Invalid email or password');
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center space-y-2'>
        <h1 className='text-3xl font-bold text-white'>Procurement Monitor</h1>
        <p className='text-slate-400'>AI-Powered Fraud Detection System</p>
      </div>
      {/* Login Card */}
      <Card className='bg-slate-800 border-slate-700 p-8'>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {generalError && (
            <Alert variant='destructive' className='bg-red-950 border-red-800'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}
          {/* Email Field */}
          <div className='space-y-2'>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-slate-200'
            >
              Email Address
            </label>
            <Input
              {...register('email')}
              type='email'
              placeholder='you@example.com'
              className='bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
              disabled={isLoading}
            />
            {errors.email && (
              <p className='text-sm text-red-400'>{errors.email.message}</p>
            )}
          </div>
          {/* Password Field */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-slate-200'
              >
                Password
              </label>
              <Link
                href='#'
                className='text-sm text-blue-400 hover:text-blue-300 transition-colors'
              >
                Forgot password?
              </Link>
            </div>
            <Input
              {...register('password')}
              type='password'
              placeholder='••••••••'
              className='bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
              disabled={isLoading}
            />
            {errors.password && (
              <p className='text-sm text-red-400'>{errors.password.message}</p>
            )}
          </div>
          {/* Submit Button */}
          <Button
            type='submit'
            disabled={isLoading}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white'
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
        {/* Demo Credentials */}
        <div className='mt-6 pt-6 border-t border-slate-700 space-y-3'>
          <p className='text-xs text-slate-400 text-center'>Demo Credentials</p>
          <div className='space-y-2 text-xs text-slate-400'>
            <p>
              Email:{' '}
              <span className='text-slate-300 font-mono'>admin@eacc.go.ke</span>
            </p>
            <p>
              Password:{' '}
              <span className='text-slate-300 font-mono'>DemoPass123!</span>
            </p>
          </div>
        </div>
      </Card>
      {/* Footer */}
      <p className='text-center text-sm text-slate-400'>
        For support, contact{' '}
        <a
          href='mailto:support@eacc.go.ke'
          className='text-blue-400 hover:text-blue-300'
        >
          support@eacc.go.ke
        </a>
      </p>
    </div>
  );
}
