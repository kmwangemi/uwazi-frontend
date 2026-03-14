'use client';

import { AIQueryBox } from '@/components/dashboard/AIQueryBox';
import { HighRiskTendersTable } from '@/components/dashboard/HighRiskTendersTable';
import { TopRiskSuppliersCard } from '@/components/dashboard/TopRiskSuppliersCard';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useDashboardHeatmap,
  useDashboardStats,
  useTopRiskSuppliers,
} from '@/lib/queries/useDashboardQueries';
import { formatDelta, formatKES } from '@/lib/utils';
import { AlertCircle, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats();
  const { data: heatmapData, isLoading: heatmapLoading } =
    useDashboardHeatmap();
  const {
    data: topSuppliers,
    isLoading: suppliersLoading,
    error: suppliersError,
  } = useTopRiskSuppliers();
  const isLoading = statsLoading || heatmapLoading || suppliersLoading;
  const error = statsError || suppliersError;
  if (error) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Card className='max-w-md w-full bg-[#121418] border-[#ef4444]/30 p-6'>
          <div className='flex gap-3'>
            <AlertCircle className='w-5 h-5 text-[#ef4444] shrink-0 mt-0.5' />
            <div>
              <h3 className='font-semibold text-[#ef4444]'>
                Error Loading Dashboard
              </h3>
              <p className='text-sm text-[#94a3b8] mt-1'>
                {error instanceof Error
                  ? error.message
                  : 'Failed to fetch dashboard data'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div>
        <h1 className='text-3xl font-bold text-white mb-2'>Dashboard</h1>
        <p className='text-[#94a3b8]'>
          Real-time procurement risk monitoring and analysis
        </p>
      </div>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {isLoading ? (
          [...Array(4)].map((_, i) => <Skeleton key={i} className='h-32' />)
        ) : stats ? (
          <>
            {/* Total Tenders */}
            <Card className='bg-[#121418] border-[#1f2937] p-6'>
              <div className='text-sm text-[#94a3b8] mb-2'>Total Tenders</div>
              <div className='text-3xl font-mono font-bold text-white mb-2'>
                {stats.total_tenders_month}
              </div>
              {stats.total_tenders_delta !== undefined && (
                <div className='flex items-center gap-1 text-xs'>
                  <TrendingUp className='w-3 h-3 text-[#00ff88]' />
                  <span className='text-[#00ff88]'>
                    {formatDelta(stats.total_tenders_delta)}
                  </span>
                  <span className='text-[#64748b]'>vs last month</span>
                </div>
              )}
            </Card>
            {/* Critical Risk Tenders */}
            <Card className='bg-[#121418] border-[#ef4444]/30 p-6'>
              <div className='text-sm text-[#94a3b8] mb-2'>Critical Risk</div>
              <div className='text-3xl font-mono font-bold text-[#ef4444] mb-2'>
                {stats.critical_risk_tenders}
              </div>
              {stats.critical_risk_delta !== undefined && (
                <div className='flex items-center gap-1 text-xs'>
                  <TrendingUp className='w-3 h-3 text-[#ef4444]' />
                  <span className='text-[#ef4444]'>
                    {formatDelta(stats.critical_risk_delta)}
                  </span>
                  <span className='text-[#64748b]'>vs last month</span>
                </div>
              )}
            </Card>
            {/* Value at Risk */}
            <Card className='bg-[#121418] border-[#1f2937] p-6'>
              <div className='text-sm text-[#94a3b8] mb-2'>Value at Risk</div>
              <div className='text-3xl font-mono font-bold text-[#f59e0b] mb-2'>
                {formatKES(stats.total_value_at_risk)}
              </div>
              {stats.value_at_risk_delta !== undefined && (
                <div className='flex items-center gap-1 text-xs'>
                  <TrendingUp className='w-3 h-3 text-[#f59e0b]' />
                  <span className='text-[#f59e0b]'>
                    {formatDelta(stats.value_at_risk_delta)}
                  </span>
                  <span className='text-[#64748b]'>vs last month</span>
                </div>
              )}
            </Card>
            {/* Active Investigations */}
            <Card className='bg-[#121418] border-[#1f2937] p-6'>
              <div className='text-sm text-[#94a3b8] mb-2'>Investigations</div>
              <div className='text-3xl font-mono font-bold text-[#00ff88] mb-2'>
                {stats.active_investigations}
              </div>
              {stats.investigations_delta !== undefined && (
                <div className='flex items-center gap-1 text-xs'>
                  <TrendingUp className='w-3 h-3 text-[#00ff88]' />
                  <span className='text-[#00ff88]'>
                    {formatDelta(stats.investigations_delta)}
                  </span>
                  <span className='text-[#64748b]'>vs last month</span>
                </div>
              )}
            </Card>
          </>
        ) : null}
      </div>
      {/* Main Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left Column (2/3 width) */}
        <div className='lg:col-span-2 space-y-6'>
          <Card className='bg-[#121418] border-[#1f2937] p-6'>
            <h2 className='text-lg font-semibold text-white mb-4'>
              Risk Trend
            </h2>
            <TrendChart isLoading={isLoading} />
          </Card>
          <Card className='bg-[#121418] border-[#1f2937] p-6'>
            <h2 className='text-lg font-semibold text-white mb-4'>
              High Risk Tenders
            </h2>
            <HighRiskTendersTable isLoading={isLoading} />
          </Card>
        </div>
        {/* Right Column (1/3 width) */}
        <div className='space-y-6'>
          <Card className='bg-[#121418] border-[#1f2937] p-6'>
            <h2 className='text-lg font-semibold text-white mb-4'>
              County Overview
            </h2>
            {heatmapLoading ? (
              <Skeleton className='h-40' />
            ) : (
              <div className='text-center text-[#94a3b8] py-8'>
                Kenya County Heatmap coming soon
              </div>
            )}
          </Card>
          <Card className='bg-[#121418] border-[#1f2937] p-6'>
            <h2 className='text-lg font-semibold text-white mb-4'>
              Top Risk Suppliers
            </h2>
            <TopRiskSuppliersCard
              suppliers={topSuppliers ?? []}
              isLoading={suppliersLoading}
            />
          </Card>
          <Card className='bg-[#121418] border-[#1f2937] p-6'>
            <h2 className='text-lg font-semibold text-white mb-4'>Ask AI</h2>
            <AIQueryBox />
          </Card>
        </div>
      </div>
    </div>
  );
}
