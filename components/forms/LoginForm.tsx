'use client';

import { PasswordInput } from '@/components/PasswordInput';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { handleApiError } from '@/lib/api';
import { useLogin } from '@/lib/queries/useAuthQueries';
import { loginSchema, type LoginFormValues } from '@/lib/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';

export function LoginForm() {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        {error && (
          <div className='p-3 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded flex gap-2'>
            <AlertCircle className='w-5 h-5 text-[#ef4444] shrink-0 mt-0.5' />
            <p className='text-sm text-[#ef4444]'>{handleApiError(error)}</p>
          </div>
        )}
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white'>Email</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder='you@example.com'
                  className='bg-[#1a1d23] border-[#1f2937] text-white placeholder-[#64748b]'
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
              <FormLabel className='text-white'>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder='••••••••'
                  className='bg-[#1a1d23] border-[#1f2937] text-white placeholder-[#64748b]'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          disabled={isPending}
          className='w-full bg-[#00ff88] text-black hover:bg-[#00ff88]/90 font-semibold'
        >
          {isPending ? (
            <>
              <Loader className='w-4 h-4 mr-2 animate-spin' />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
    </Form>
  );
}
