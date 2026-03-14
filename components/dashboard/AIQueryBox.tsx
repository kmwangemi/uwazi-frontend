'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAiQuery } from '@/lib/queries/useDashboardQueries';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const aiQuerySchema = z.object({
  question: z.string().min(1, 'Please enter a question'),
});

type AIQueryForm = z.infer<typeof aiQuerySchema>;

export function AIQueryBox() {
  const { mutate: askAI, data, isPending, isError } = useAiQuery();
  const form = useForm<AIQueryForm>({
    resolver: zodResolver(aiQuerySchema),
    defaultValues: { question: '' },
  });
  const onSubmit = (values: AIQueryForm) => {
    askAI(values.question, {
      onSuccess: () => form.reset(),
    });
  };
  return (
    <div className='space-y-3'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex gap-2'>
          <FormField
            control={form.control}
            name='question'
            render={({ field }) => (
              <FormItem className='flex-1'>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Ask about tenders...'
                    disabled={isPending}
                    className='bg-[#1a1d23] border-[#1f2937] text-white placeholder-[#64748b] text-sm'
                  />
                </FormControl>
                <FormMessage className='text-xs text-[#ef4444]' />
              </FormItem>
            )}
          />
          <Button
            type='submit'
            disabled={isPending || !form.watch('question').trim()}
            size='icon'
            className='bg-[#00ff88] text-black hover:bg-[#00ff88]/90'
          >
            {isPending ? (
              <Loader className='w-4 h-4 animate-spin' />
            ) : (
              <Send className='w-4 h-4' />
            )}
          </Button>
        </form>
      </Form>
      {isError && (
        <Card className='bg-[#1a1d23] border-[#ef4444]/30 p-3 text-xs text-[#ef4444] leading-relaxed'>
          Error processing query. Please try again.
        </Card>
      )}
      {data?.answer && (
        <Card className='bg-[#1a1d23] border-[#1f2937] p-3 text-xs text-[#e0e0e0] leading-relaxed max-h-40 overflow-y-auto font-mono'>
          {data.answer}
        </Card>
      )}
    </div>
  );
}
