'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardLoadingSkeleton() {
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <Skeleton className='h-8 w-48 mb-2' />
        <Skeleton className='h-4 w-96' />
      </div>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className='bg-[#121418] border-[#1f2937] p-6'>
            <Skeleton className='h-4 w-32 mb-4' />
            <div className='flex justify-between'>
              <Skeleton className='h-8 w-20' />
              <Skeleton className='h-4 w-16' />
            </div>
          </Card>
        ))}
      </div>
      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {[...Array(2)].map((_, i) => (
          <Card key={i} className='bg-[#121418] border-[#1f2937] p-6'>
            <Skeleton className='h-6 w-40 mb-4' />
            <Skeleton className='h-64 w-full' />
          </Card>
        ))}
      </div>
      {/* Table */}
      <Card className='bg-[#121418] border-[#1f2937] p-6'>
        <Skeleton className='h-6 w-32 mb-4' />
        <div className='space-y-2'>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className='h-10 w-full' />
          ))}
        </div>
      </Card>
    </div>
  );
}

export function TableLoadingSkeleton() {
  return (
    <div className='space-y-2'>
      {[...Array(8)].map((_, i) => (
        <Skeleton key={i} className='h-12 w-full' />
      ))}
    </div>
  );
}

export function CardLoadingSkeleton() {
  return (
    <Card className='bg-[#121418] border-[#1f2937] p-6'>
      <Skeleton className='h-6 w-48 mb-4' />
      <div className='space-y-3'>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className='h-4 w-full' />
        ))}
      </div>
    </Card>
  );
}
