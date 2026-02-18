'use client';

import { RiskScoreMeter } from '@/components/shared/RiskScoreMeter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatCurrency, getStatusBadgeColor } from '@/lib/formatters';
import type { Tender } from '@/types';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface TenderCardProps {
  tender: Tender;
}

export function TenderCard({ tender }: TenderCardProps) {
  return (
    <Card className='p-6 hover:shadow-lg transition-shadow'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex-1 min-w-0'>
          {/* Header with Risk Score */}
          <div className='flex items-start justify-between gap-4 mb-3'>
            <div>
              <p className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>
                {tender.tender_number}
              </p>
              <h3 className='mt-1 text-base font-semibold text-gray-900 line-clamp-2'>
                {tender.title}
              </h3>
            </div>
            <div className='flex-shrink-0'>
              <RiskScoreMeter
                score={tender.risk_score}
                size='sm'
                showLabel={false}
              />
            </div>
          </div>

          {/* Details */}
          <div className='mb-4 space-y-2 text-sm'>
            <p className='text-gray-600'>
              <span className='font-medium'>Entity:</span>{' '}
              {tender.procuring_entity}
            </p>
            <p className='text-gray-600'>
              <span className='font-medium'>Amount:</span>{' '}
              {formatCurrency(tender.amount, false)}
            </p>
            <p className='text-gray-600'>
              <span className='font-medium'>County:</span> {tender.county}
            </p>
          </div>

          {/* Status and Flags */}
          <div className='flex flex-wrap items-center gap-2 mb-4'>
            <Badge className={getStatusBadgeColor(tender.status)}>
              {tender.status.replace('_', ' ')}
            </Badge>
            {tender.is_flagged && (
              <Badge variant='destructive' className='flex items-center gap-1'>
                <AlertCircle className='h-3 w-3' />
                FLAGGED
              </Badge>
            )}
          </div>

          {/* Corruption Flags Summary */}
          {tender.corruption_flags.length > 0 && (
            <div className='mb-4 space-y-1 text-xs'>
              {tender.corruption_flags.slice(0, 2).map((flag, i) => (
                <p key={i} className='text-red-600 line-clamp-1'>
                  • {flag.type.replace('_', ' ')} ({flag.severity})
                </p>
              ))}
              {tender.corruption_flags.length > 2 && (
                <p className='text-gray-600'>
                  +{tender.corruption_flags.length - 2} more flag(s)
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <Link href={`/dashboard/tenders/${tender.id}`} className='block mt-4'>
        <Button variant='outline' className='w-full'>
          View Details
        </Button>
      </Link>
    </Card>
  );
}
