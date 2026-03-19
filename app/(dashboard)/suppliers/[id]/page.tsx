'use client';

import { RiskBadge } from '@/components/RiskBadge';
import { RiskGauge } from '@/components/RiskGauge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSupplier } from '@/lib/queries/useSuppliersQueries';
import { AlertCircle } from 'lucide-react';
import { useParams } from 'next/navigation';

const getRiskLevel = (score: number) => {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
};

export default function SupplierDetailPage() {
  const { id: supplierId } = useParams<{ id: string }>();
  const { data: supplier, isLoading, error } = useSupplier(supplierId);
  if (isLoading) {
    return (
      <div className='space-y-6'>
        <Skeleton className='h-32' />
        <Skeleton className='h-96' />
      </div>
    );
  }
  if (error || !supplier) {
    return (
      <Card className='bg-[#121418] border-[#ef4444]/30 p-6'>
        <div className='flex gap-3'>
          <AlertCircle className='w-5 h-5 text-[#ef4444] shrink-0 mt-0.5' />
          <div>
            <h3 className='font-semibold text-[#ef4444]'>
              Error Loading Supplier
            </h3>
            <p className='text-sm text-[#94a3b8] mt-1'>
              {error instanceof Error ? error.message : 'Supplier not found'}
            </p>
          </div>
        </div>
      </Card>
    );
  }
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          <h1 className='text-3xl font-bold text-white mb-4'>
            {supplier.name}
          </h1>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-[#94a3b8] mb-1'>Registration Number</p>
              <p className='font-mono text-[#00ff88]'>
                {supplier.registration_number}
              </p>
            </div>
            <div>
              <p className='text-sm text-[#94a3b8] mb-1'>County</p>
              <p className='text-white'>{supplier.county}</p>
            </div>
            <div>
              <p className='text-sm text-[#94a3b8] mb-1'>Company Age</p>
              <p className='text-white'>{supplier.company_age_days} days</p>
            </div>
            <div>
              <p className='text-sm text-[#94a3b8] mb-1'>Tax Filings</p>
              <p className='text-white'>{supplier.tax_filings_count}</p>
            </div>
          </div>
        </div>
        {/* Risk Gauge */}
        <Card className='bg-[#121418] border-[#1f2937] p-6 flex flex-col items-center'>
          <RiskGauge score={supplier.risk_score} size='md' />
          <div className='mt-4 text-center'>
            <RiskBadge
              level={getRiskLevel(supplier.risk_score)}
              score={Math.round(supplier.risk_score)}
            />
            {supplier.ghost_probability && (
              <p className='text-xs text-[#f59e0b] mt-3'>
                Ghost Probability:{' '}
                {(supplier.ghost_probability * 100).toFixed(0)}%
              </p>
            )}
          </div>
        </Card>
      </div>
      {/* Quick Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card className='bg-[#121418] border-[#1f2937] p-6'>
          <p className='text-sm text-[#94a3b8] mb-2'>Contracts Won</p>
          <p className='text-3xl font-mono font-bold text-[#00ff88]'>
            {supplier.contracts_won ?? 0}
          </p>
        </Card>
        <Card className='bg-[#121418] border-[#1f2937] p-6'>
          <p className='text-sm text-[#94a3b8] mb-2'>Total Value Won</p>
          <p className='text-xl font-mono font-bold text-white'>
            KES {((supplier.total_value_won ?? 0) / 1_000_000).toFixed(1)}M
          </p>
        </Card>
        <Card className='bg-[#121418] border-[#1f2937] p-6'>
          <p className='text-sm text-[#94a3b8] mb-2'>Directors</p>
          <p className='text-3xl font-mono font-bold text-[#f59e0b]'>
            {supplier.directors.length}
          </p>
        </Card>
      </div>
      {/* Directors */}
      <Card className='bg-[#121418] border-[#1f2937] p-6'>
        <h2 className='text-lg font-semibold text-white mb-4'>Directors</h2>
        {supplier.directors.length === 0 ? (
          <p className='text-[#94a3b8]'>No directors found</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-[#1f2937]'>
                  <th className='text-left py-2 text-[#94a3b8]'>Name</th>
                  <th className='text-left py-2 text-[#94a3b8]'>ID (masked)</th>
                  <th className='text-left py-2 text-[#94a3b8]'>
                    Other Companies
                  </th>
                </tr>
              </thead>
              <tbody>
                {supplier.directors.map((director, idx) => (
                  <tr key={idx} className='border-b border-[#1f2937]'>
                    <td className='py-3 text-white'>{director.full_name}</td>
                    <td className='py-3 font-mono text-[#00ff88]'>
                      {director &&
                        director.id_number &&
                        director.id_number.slice(0, 2)}
                      ****
                    </td>
                    <td className='py-3 text-[#f59e0b]'>
                      {director && director.other_companies_linked}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {/* Red Flags */}
      {supplier.red_flags && supplier.red_flags.length > 0 && (
        <Card className='bg-[#121418] border-[#1f2937] p-6'>
          <h2 className='text-lg font-semibold text-white mb-4'>Red Flags</h2>
          <div className='space-y-3'>
            {supplier.red_flags.map((flag, idx) => (
              <Card
                key={idx}
                className='bg-[#1a1d23] border-l-4 border-t-0 border-r-0 border-b-0 p-4'
                style={{
                  borderLeftColor:
                    flag.severity === 'critical'
                      ? '#00ff88'
                      : flag.severity === 'high'
                        ? '#ef4444'
                        : flag.severity === 'medium'
                          ? '#f59e0b'
                          : '#64748b',
                }}
              >
                <div className='flex justify-between items-start mb-2'>
                  <h5 className='font-semibold text-white'>{flag.flag_type}</h5>
                  <RiskBadge
                    level={flag.severity}
                    size='sm'
                    showScore={false}
                  />
                </div>
                <p className='text-sm text-[#e0e0e0]'>{flag.description}</p>
              </Card>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
