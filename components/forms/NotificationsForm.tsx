'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import {
  notificationsSchema,
  type NotificationsFormInput,
} from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface NotificationsFormProps {
  onSuccess?: () => void;
}

export function NotificationsForm({ onSuccess }: NotificationsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const form = useForm<NotificationsFormInput>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      risk_alerts: true,
      weekly_digest: true,
      monthly_report: false,
    },
  });

  async function onSubmit(values: NotificationsFormInput) {
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessage({
        type: 'success',
        text: 'Notification preferences updated successfully',
      });
      onSuccess?.();
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'Failed to update preferences',
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
            <CheckCircle2 className='w-5 h-5 flex-shrink-0 mt-0.5' />
          ) : (
            <AlertCircle className='w-5 h-5 flex-shrink-0 mt-0.5' />
          )}
          <p className='font-semibold text-sm'>{message.text}</p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='risk_alerts'
            render={({ field }) => (
              <FormItem className='flex items-center justify-between p-4 bg-[#1a1d23] rounded border border-[#1f2937]'>
                <div>
                  <FormLabel className='text-white font-semibold'>
                    Risk Alerts
                  </FormLabel>
                  <p className='text-sm text-[#94a3b8]'>
                    High-risk tenders & suppliers
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='weekly_digest'
            render={({ field }) => (
              <FormItem className='flex items-center justify-between p-4 bg-[#1a1d23] rounded border border-[#1f2937]'>
                <div>
                  <FormLabel className='text-white font-semibold'>
                    Weekly Digest
                  </FormLabel>
                  <p className='text-sm text-[#94a3b8]'>
                    Summary of weekly activity
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='monthly_report'
            render={({ field }) => (
              <FormItem className='flex items-center justify-between p-4 bg-[#1a1d23] rounded border border-[#1f2937]'>
                <div>
                  <FormLabel className='text-white font-semibold'>
                    Monthly Report
                  </FormLabel>
                  <p className='text-sm text-[#94a3b8]'>
                    Comprehensive monthly analysis
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type='submit'
            disabled={isSubmitting}
            className='bg-[#00ff88] text-black hover:bg-[#00ff88]/90 w-full'
          >
            {isSubmitting ? 'Saving...' : 'Save Preferences'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
