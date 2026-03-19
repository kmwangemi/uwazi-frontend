'use client';

import { RiskBadge } from '@/components/RiskBadge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useHighRiskTenders } from '@/lib/queries/useDashboardQueries';
import { formatKES, truncate } from '@/lib/utils';
import { Eye } from 'lucide-react';
import Link from 'next/link';

interface HighRiskTendersTableProps {
  isLoading?: boolean;
}

export function HighRiskTendersTable({
  isLoading: parentLoading,
}: HighRiskTendersTableProps) {
  const { data: tenders, isLoading } = useHighRiskTenders();
  const loading = parentLoading || isLoading;

  if (loading) {
    return (
      <div className='space-y-2'>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className='h-10' />
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='border-[#1f2937] hover:bg-transparent'>
              <TableHead className='text-[#94a3b8]'>Title</TableHead>
              <TableHead className='text-[#94a3b8]'>Entity</TableHead>
              <TableHead className='text-[#94a3b8]'>Value</TableHead>
              <TableHead className='text-[#94a3b8]'>Risk</TableHead>
              <TableHead className='text-[#94a3b8]'>County</TableHead>
              <TableHead className='w-10 text-[#94a3b8]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(tenders ?? []).map(tender => (
              <TableRow
                key={tender.id}
                className='border-[#1f2937] hover:bg-[#1a1d23]'
              >
                <TableCell className='text-white text-sm max-w-xs'>
                  <span className='line-clamp-1'>
                    {truncate(tender.title, 30)}
                  </span>
                </TableCell>
                <TableCell className='text-[#94a3b8] text-sm max-w-xs'>
                  <span className='line-clamp-1'>{tender.entity ?? '—'}</span>
                </TableCell>
                <TableCell className='text-white font-mono text-sm'>
                  {formatKES(tender.estimated_value)}
                </TableCell>
                <TableCell>
                  <RiskBadge
                    level={tender.risk_level as any}
                    score={tender.risk_score}
                    size='sm'
                    showScore
                  />
                </TableCell>
                <TableCell className='text-[#94a3b8] text-sm'>
                  {tender.county}
                </TableCell>
                <TableCell>
                  <Link href={`/tenders/${tender.id}`}>
                    <Button size='icon' variant='ghost' className='h-8 w-8'>
                      <Eye className='w-4 h-4' />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Link
        href='/tenders?risk_level=high'
        className='text-[#00ff88] text-sm hover:underline'
      >
        View all high-risk tenders →
      </Link>
    </div>
  );
}
