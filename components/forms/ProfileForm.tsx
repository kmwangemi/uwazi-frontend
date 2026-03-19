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
import { profileSchema, type ProfileInput } from '@/lib/schemas';
import { useAuthStore } from '@/lib/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ProfileFormProps {
  onSuccess?: () => void;
}

export function ProfileForm({ onSuccess }: ProfileFormProps) {
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      organization: '',
    },
  });

  async function onSubmit(values: ProfileInput) {
    setIsSubmitting(true);
    setMessage(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      onSuccess?.();
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error instanceof Error ? error.message : 'Failed to update profile',
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
            name='full_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Your full name'
                    className='bg-[#1a1d23] border-[#1f2937] text-white'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='organization'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Your organization'
                    className='bg-[#1a1d23] border-[#1f2937] text-white'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='bg-[#1a1d23] p-3 rounded border border-[#1f2937]'>
            <p className='text-sm text-[#94a3b8]'>Email</p>
            <p className='text-white font-semibold'>{user?.email}</p>
            <p className='text-xs text-[#64748b] mt-1'>
              Email cannot be changed for security
            </p>
          </div>
          <Button
            type='submit'
            disabled={isSubmitting}
            className='bg-[#00ff88] text-black hover:bg-[#00ff88]/90'
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
