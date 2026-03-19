'use client';

import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { TopRiskSupplier } from '@/lib/types';
import Link from 'next/link';

interface TopRiskSuppliersCardProps {
  suppliers: TopRiskSupplier[] | null;
  isLoading?: boolean;
}

export function TopRiskSuppliersCard({
  suppliers,
  isLoading,
}: TopRiskSuppliersCardProps) {
  if (isLoading) {
    return (
      <div className='space-y-3'>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className='h-12' />
        ))}
      </div>
    );
  }

  if (!suppliers || suppliers.length === 0) {
    return (
      <div className='text-center py-6 text-[#94a3b8]'>
        <p>No high-risk suppliers detected</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {suppliers.slice(0, 5).map(supplier => (
        <Link
          key={supplier.supplier_id}
          href={`/suppliers/${supplier.supplier_id}`}
          className='block group'
        >
          <div className='text-sm mb-1 flex items-center justify-between'>
            <span className='text-white group-hover:text-[#00ff88] transition'>
              {supplier.rank}. {supplier.name}
            </span>
            <span className='font-mono text-[#94a3b8]'>
              {supplier.risk_score}
            </span>
          </div>
          <div className='mb-1'>
            <Progress
              value={supplier.risk_score}
              className='h-2'
              indicatorClassName={
                supplier.risk_score >= 75
                  ? 'bg-[#00ff88]'
                  : supplier.risk_score >= 50
                    ? 'bg-[#ef4444]'
                    : supplier.risk_score >= 25
                      ? 'bg-[#f59e0b]'
                      : 'bg-[#64748b]'
              }
            />
          </div>
          <div className='text-xs text-[#64748b]'>
            {/* Ghost probability: {(supplier.ghost_probability * 100).toFixed(0)}% */}
          </div>
        </Link>
      ))}
    </div>
  );
}
