'use client';

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
import { passwordSchema, type PasswordInput } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface PasswordFormProps {
  onSuccess?: () => void;
}

export function PasswordForm({ onSuccess }: PasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const form = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  async function onSubmit(values: PasswordInput) {
    setIsSubmitting(true);
    setMessage(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessage({ type: 'success', text: 'Password changed successfully' });
      form.reset();
      onSuccess?.();
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error instanceof Error ? error.message : 'Failed to change password',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='space-y-4'>
      {message && (
        <div
          className={`p-4 flex gap-3 rounded border-2 ${
            message.type === 'success'
              ? 'bg-[#00ff88]/10 border-[#00ff88] text-[#00ff88]'
              : 'bg-[#ef4444]/10 border-[#ef4444] text-[#ef4444]'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className='w-5 h-5 shrink-0 mt-0.5' />
          ) : (
            <AlertCircle className='w-5 h-5 shrink-0 mt-0.5' />
          )}
          <p className='font-semibold text-sm'>{message.text}</p>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='current_password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='password'
                    placeholder='••••••••'
                    className='bg-[#1a1d23] border-[#1f2937] text-white'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='new_password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='password'
                    placeholder='••••••••'
                    className='bg-[#1a1d23] border-[#1f2937] text-white'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='confirm_password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='password'
                    placeholder='••••••••'
                    className='bg-[#1a1d23] border-[#1f2937] text-white'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='submit'
            disabled={isSubmitting}
            className='bg-[#00ff88] text-black hover:bg-[#00ff88]/90'
          >
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
