'use client';

import { PasswordInput } from '@/components/password-input';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/hooks/queries/useLogin';
import { handleApiError } from '@/lib/api';
import { loginSchema, type LoginFormValues } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

export default function LoginPage() {
  const { mutate: login, isPending, error } = useLogin();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const onSubmit = (values: LoginFormValues) => login(values);
  return (
    <Card className='p-8'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          {error && (
            <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3'>
              <AlertCircle className='h-5 w-5 text-red-600 shrink-0 mt-0.5' />
              <p className='text-sm font-medium text-red-900'>
                {handleApiError(error)}
              </p>
            </div>
          )}
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='investigator@eacc.go.ke'
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center justify-between'>
                  <FormLabel>Password</FormLabel>
                  <Link
                    href='#'
                    className='text-sm text-primary hover:underline'
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput
                    placeholder='••••••••'
                    {...field}
                    disabled={isPending}
                    className='border-gray-300'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='submit'
            className='w-full'
            disabled={isPending}
            size='lg'
          >
            {isPending ? <LoadingSpinner size='sm' text='' /> : 'Sign in'}
          </Button>
        </form>
      </Form>
      <div className='mt-2 border-t border-gray-200 pt-6 text-center'>
        <p className='text-sm text-gray-600'>
          Demo credentials:
          <br />
          <span className='font-mono text-xs'>demo@procmon.ke / Admin@123</span>
        </p>
      </div>
    </Card>
  );
}
