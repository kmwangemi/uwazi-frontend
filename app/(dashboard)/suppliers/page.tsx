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
import { useSuppliersList } from '@/lib/queries/useSuppliersQueries';
import { SupplierFilters } from '@/lib/types';
import { AlertCircle, Eye } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const DEFAULT_FILTERS: SupplierFilters = { page: 1, limit: 20 };

const getRiskLevel = (score: number) => {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
};

export default function SuppliersPage() {
  const [filters, setFilters] = useState<SupplierFilters>(DEFAULT_FILTERS);
  const { data, isLoading, error } = useSuppliersList(filters);
  const suppliers = data?.items ?? [];
  const totalPages = data?.pages ?? 0;
  const updateFilters = (patch: Partial<SupplierFilters>) =>
    setFilters(prev => ({ ...prev, ...patch }));
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-white mb-2'>Suppliers</h1>
        <p className='text-[#94a3b8]'>
          Analyze supplier risk profiles and history
        </p>
      </div>
      {/* Filters */}
      <Card className='bg-[#121418] border-[#1f2937] p-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
          <Input
            placeholder='County...'
            value={filters.county || ''}
            onChange={e => updateFilters({ county: e.target.value, page: 1 })}
            className='bg-[#1a1d23] border-[#1f2937] text-white placeholder-[#64748b]'
          />
          <Input
            placeholder='Risk level...'
            value={filters.risk_level || ''}
            onChange={e =>
              updateFilters({ risk_level: e.target.value, page: 1 })
            }
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
        </div>
      </Card>
      {/* Error */}
      {error && (
        <Card className='bg-[#121418] border-[#ef4444]/30 p-4'>
          <div className='flex gap-3'>
            <AlertCircle className='w-5 h-5 text-[#ef4444] shrink-0' />
            <p className='text-[#ef4444]'>
              {error instanceof Error
                ? error.message
                : 'Failed to fetch suppliers'}
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
                <TableHead className='text-[#94a3b8]'>Name</TableHead>
                <TableHead className='text-[#94a3b8]'>Registration #</TableHead>
                <TableHead className='text-[#94a3b8]'>County</TableHead>
                <TableHead className='text-[#94a3b8]'>Age (days)</TableHead>
                <TableHead className='text-[#94a3b8]'>Directors</TableHead>
                <TableHead className='text-[#94a3b8]'>Risk Score</TableHead>
                <TableHead className='text-[#94a3b8]'>Ghost %</TableHead>
                <TableHead className='w-10' />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    {[...Array(8)].map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton
                          className={
                            j === 5 ? 'h-6 w-20' : j === 7 ? 'h-8 w-8' : 'h-4'
                          }
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : suppliers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className='text-center py-8 text-[#94a3b8]'
                  >
                    No suppliers found
                  </TableCell>
                </TableRow>
              ) : (
                suppliers.map(supplier => (
                  <TableRow
                    key={supplier.id}
                    className='border-[#1f2937] hover:bg-[#1a1d23]'
                  >
                    <TableCell className='text-white'>
                      {supplier.name}
                    </TableCell>
                    <TableCell className='font-mono text-sm text-[#94a3b8]'>
                      {supplier.registration_number}
                    </TableCell>
                    <TableCell className='text-[#94a3b8]'>
                      {supplier.county}
                    </TableCell>
                    <TableCell className='text-white'>
                      {supplier.company_age_days}
                    </TableCell>
                    <TableCell className='text-white'>
                      {supplier.directors.length}
                    </TableCell>
                    <TableCell>
                      <RiskBadge
                        level={getRiskLevel(supplier.risk_score)}
                        score={Math.round(supplier.risk_score)}
                        size='sm'
                      />
                    </TableCell>
                    <TableCell className='text-[#f59e0b]'>
                      {supplier.ghost_probability
                        ? `${(supplier.ghost_probability * 100).toFixed(0)}%`
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Link href={`/suppliers/${supplier.id}`}>
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
