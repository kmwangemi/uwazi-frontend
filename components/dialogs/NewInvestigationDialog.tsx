'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// ─── Schema ───────────────────────────────────────────────────────────────────

const investigationSchema = z.object({
  title: z.string().min(1, 'Case title is required'),
  description: z.string().optional(),
  priority: z.string().min(1, 'Priority is required'),
  type: z.string().optional(),
});

type InvestigationFormValues = z.infer<typeof investigationSchema>;

// ─── Dialog ───────────────────────────────────────────────────────────────────

interface NewInvestigationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (investigation: InvestigationFormValues) => void;
}

export function NewInvestigationDialog({
  open,
  onOpenChange,
  onSubmit,
}: NewInvestigationDialogProps) {
  const form = useForm<InvestigationFormValues>({
    resolver: zodResolver(investigationSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: '',
      type: '',
    },
  });

  const onValidSubmit = async (data: InvestigationFormValues) => {
    try {
      onSubmit?.(data);
      toast.success('Investigation case created successfully');
      form.reset();
      onOpenChange(false);
    } catch {
      toast.error('Failed to create investigation');
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Create New Investigation Case</DialogTitle>
          <DialogDescription>
            Open a new fraud investigation case
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onValidSubmit)}
            className='space-y-6'
            noValidate
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Title *</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter case title' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder='Describe the investigation details'
                      rows={3}
                      {...field}
                      className='w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='priority'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select priority' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='High'>High</SelectItem>
                        <SelectItem value='Medium'>Medium</SelectItem>
                        <SelectItem value='Low'>Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investigation Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Procurement Fraud'>
                          Procurement Fraud
                        </SelectItem>
                        <SelectItem value='Collusion'>Collusion</SelectItem>
                        <SelectItem value='Bribery'>Bribery</SelectItem>
                        <SelectItem value='Embezzlement'>
                          Embezzlement
                        </SelectItem>
                        <SelectItem value='Other'>Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex gap-3 justify-end pt-4 border-t'>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creating...' : 'Create Case'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
