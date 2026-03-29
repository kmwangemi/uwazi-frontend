'use client';

import { RiskBadge } from '@/components/RiskBadge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTendersList } from '@/lib/queries/useTendersQueries';
import { TenderFilters } from '@/lib/types';
import { formatKES, truncate } from '@/lib/utils';
import { AlertCircle, Download, Eye, Zap } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

const DEFAULT_FILTERS: TenderFilters = { page: 1, limit: 20 };

export default function TendersPage() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<TenderFilters>(() => ({
    ...DEFAULT_FILTERS,
    // Hydrate risk_level from URL on first render
    risk_level: searchParams.get('risk_level') ?? undefined,
  }));
  const { data, isLoading, error } = useTendersList(filters);
  const tenders = data?.items ?? [];
  const totalPages = data?.pages ?? 0;
  const updateFilters = (patch: Partial<TenderFilters>) =>
    setFilters(prev => ({ ...prev, ...patch }));
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-white mb-2'>Tenders</h1>
        <p className='text-[#94a3b8]'>
          Browse and analyze all procurement tenders
        </p>
      </div>
      {/* Filters */}
      <Card className='bg-[#121418] border-[#1f2937] p-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
          <Input
            placeholder='Search tenders...'
            value={filters.search || ''}
            onChange={e => updateFilters({ search: e.target.value, page: 1 })}
            className='bg-[#1a1d23] border-[#1f2937] text-white placeholder-[#64748b]'
          />
          <Input
            placeholder='County...'
            value={filters.county || ''}
            onChange={e => updateFilters({ county: e.target.value, page: 1 })}
            className='bg-[#1a1d23] border-[#1f2937] text-white placeholder-[#64748b]'
          />
          <Input
            placeholder='Category...'
            value={filters.category || ''}
            onChange={e => updateFilters({ category: e.target.value, page: 1 })}
            className='bg-[#1a1d23] border-[#1f2937] text-white placeholder-[#64748b]'
          />
          <Button
            variant='outline'
            size='sm'
            className='border-[#1f2937] text-[#94a3b8]'
            onClick={() => setFilters(DEFAULT_FILTERS)}
          >
            Clear Filters
          </Button>
          {/* <Button
            size='sm'
            className='bg-[#00ff88] text-black hover:bg-[#00ff88]/90'
          >
            <Download className='w-4 h-4 mr-2' /> Export
          </Button>
          <Button
            size='sm'
            className='bg-[#f59e0b] text-black hover:bg-[#f59e0b]/90'
          >
            <Zap className='w-4 h-4 mr-2' /> Analyze
          </Button> */}
        </div>
      </Card>
      {/* Error */}
      {error && (
        <Card className='bg-[#121418] border-[#ef4444]/30 p-4'>
          <div className='flex gap-3'>
            <AlertCircle className='w-5 h-5 text-[#ef4444] shrink-0 mt-0.5' />
            <p className='text-[#ef4444]'>
              {error instanceof Error
                ? error.message
                : 'Failed to fetch tenders'}
            </p>
          </div>
        </Card>
      )}
      {/* Table */}
      <Card className='bg-[#121418] border-[#1f2937] overflow-hidden'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='border-[#1f2937] hover:bg-transparent'>
                <TableHead className='text-[#94a3b8]'>Reference</TableHead>
                <TableHead className='text-[#94a3b8]'>Title</TableHead>
                <TableHead className='text-[#94a3b8]'>Entity</TableHead>
                <TableHead className='text-[#94a3b8]'>Value</TableHead>
                <TableHead className='text-[#94a3b8]'>Risk</TableHead>
                <TableHead className='text-[#94a3b8]'>County</TableHead>
                <TableHead className='w-10' />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    {[...Array(7)].map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton
                          className={
                            j === 4 ? 'h-6 w-20' : j === 6 ? 'h-8 w-8' : 'h-4'
                          }
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : tenders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className='text-center py-8 text-[#94a3b8]'
                  >
                    No tenders found
                  </TableCell>
                </TableRow>
              ) : (
                tenders.map(tender => (
                  <TableRow
                    key={tender.id}
                    className='border-[#1f2937] hover:bg-[#1a1d23]'
                  >
                    <TableCell className='font-mono text-sm text-[#00ff88]'>
                      {truncate(tender.reference_number, 12)}
                    </TableCell>
                    <TableCell className='text-white text-sm max-w-xs'>
                      <span className='line-clamp-1'>
                        {truncate(tender.title, 30)}
                      </span>
                    </TableCell>
                    <TableCell className='text-[#94a3b8] text-sm'>
                      {truncate(tender.entity.name, 20)}
                    </TableCell>
                    <TableCell className='text-white font-mono text-sm'>
                      {formatKES(tender.estimated_value)}
                    </TableCell>
                    <TableCell>
                      {tender.risk_score && (
                        <RiskBadge
                          level={tender.risk_score.risk_level}
                          score={tender.risk_score.total_score}
                          size='sm'
                        />
                      )}
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className='border-t border-[#1f2937] p-4 flex justify-center gap-2'>
            <Button
              size='sm'
              variant='outline'
              onClick={() =>
                updateFilters({ page: Math.max(1, (filters.page || 1) - 1) })
              }
              disabled={(filters.page || 1) === 1}
              className='border-[#1f2937]'
            >
              Previous
            </Button>
            <span className='flex items-center text-sm text-[#94a3b8]'>
              Page {filters.page || 1} of {totalPages}
            </span>
            <Button
              size='sm'
              variant='outline'
              onClick={() =>
                updateFilters({
                  page: Math.min(totalPages, (filters.page || 1) + 1),
                })
              }
              disabled={(filters.page || 1) === totalPages}
              className='border-[#1f2937]'
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
