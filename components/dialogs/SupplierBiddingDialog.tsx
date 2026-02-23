'use client';

import { Badge } from '@/components/ui/badge';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Bid {
  id: string;
  supplierId: string;
  supplierName: string;
  bidAmount: number;
  dateSubmitted: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const bidSchema = z.object({
  supplierName: z.string().min(1, 'Company name is required'),
  bidAmount: z
    .string()
    .min(1, 'Bid amount is required')
    .refine(
      v => !isNaN(parseFloat(v)) && parseFloat(v) > 0,
      'Enter a valid amount',
    ),
});

type BidFormValues = z.infer<typeof bidSchema>;

// ─── Status badge helper ──────────────────────────────────────────────────────

const STATUS_CLASSES: Record<Bid['status'], string> = {
  Approved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
  Pending: 'bg-yellow-100 text-yellow-800',
};

// ─── Dialog ───────────────────────────────────────────────────────────────────

interface SupplierBiddingDialogProps {
  tenderId: string;
  tenderTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupplierBiddingDialog({
  tenderId,
  tenderTitle,
  open,
  onOpenChange,
}: SupplierBiddingDialogProps) {
  const [activeTab, setActiveTab] = useState('submit');
  const [bids, setBids] = useState<Bid[]>([
    {
      id: '1',
      supplierId: 'SUP001',
      supplierName: 'ABC Supplies Ltd',
      bidAmount: 850000,
      dateSubmitted: '2024-01-15',
      status: 'Pending',
    },
    {
      id: '2',
      supplierId: 'SUP002',
      supplierName: 'Tech Solutions Inc',
      bidAmount: 920000,
      dateSubmitted: '2024-01-16',
      status: 'Pending',
    },
  ]);

  const form = useForm<BidFormValues>({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      supplierName: '',
      bidAmount: '',
    },
  });

  const onValidSubmit = (data: BidFormValues) => {
    const newBid: Bid = {
      id: Math.random().toString(),
      supplierId: `SUP${Math.floor(Math.random() * 1000)}`,
      supplierName: data.supplierName,
      bidAmount: parseFloat(data.bidAmount),
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };

    setBids(prev => [...prev, newBid]);
    toast.success('Bid submitted successfully');
    form.reset();
  };

  const handleApproveBid = (bidId: string) => {
    setBids(prev =>
      prev.map(bid =>
        bid.id === bidId ? { ...bid, status: 'Approved' } : bid,
      ),
    );
    toast.success('Bid approved');
  };

  const handleRejectBid = (bidId: string) => {
    setBids(prev =>
      prev.map(bid =>
        bid.id === bidId ? { ...bid, status: 'Rejected' } : bid,
      ),
    );
    toast.success('Bid rejected');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Manage Bids for {tenderTitle}</DialogTitle>
          <DialogDescription>
            Submit, review, and manage supplier bids
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='submit'>Submit Bid</TabsTrigger>
            <TabsTrigger value='review'>
              Review Bids ({bids.length})
            </TabsTrigger>
          </TabsList>
          {/* ── Submit Bid ───────────────────────────────────────────────── */}
          <TabsContent value='submit' className='space-y-6'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onValidSubmit)}
                className='space-y-6'
                noValidate
              >
                <FormField
                  control={form.control}
                  name='supplierName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter company name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='bidAmount'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bid Amount (KSh)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='Enter bid amount'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex gap-3 justify-end pt-4 border-t'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => onOpenChange(false)}
                    disabled={form.formState.isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type='submit' disabled={form.formState.isSubmitting}>
                    Submit Bid
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          {/* ── Review Bids ──────────────────────────────────────────────── */}
          <TabsContent value='review' className='space-y-4'>
            <div className='space-y-3 max-h-96 overflow-y-auto'>
              {bids.map(bid => (
                <div key={bid.id} className='border rounded-lg p-4 space-y-3'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <h4 className='font-semibold'>{bid.supplierName}</h4>
                      <p className='text-sm text-muted-foreground'>
                        ID: {bid.supplierId}
                      </p>
                    </div>
                    <Badge className={STATUS_CLASSES[bid.status]}>
                      {bid.status}
                    </Badge>
                  </div>
                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div>
                      <span className='text-muted-foreground'>Bid Amount:</span>
                      <p className='font-semibold'>
                        KSh {bid.bidAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className='text-muted-foreground'>Submitted:</span>
                      <p className='font-semibold'>{bid.dateSubmitted}</p>
                    </div>
                  </div>
                  {bid.status === 'Pending' && (
                    <div className='flex gap-2 pt-2 border-t'>
                      <Button
                        size='sm'
                        className='flex-1'
                        onClick={() => handleApproveBid(bid.id)}
                      >
                        <Check className='h-4 w-4 mr-2' />
                        Approve
                      </Button>
                      <Button
                        size='sm'
                        variant='destructive'
                        className='flex-1'
                        onClick={() => handleRejectBid(bid.id)}
                      >
                        <X className='h-4 w-4 mr-2' />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
