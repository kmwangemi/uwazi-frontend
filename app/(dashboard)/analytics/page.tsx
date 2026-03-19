'use client';

import { CountyAnalysis } from '@/components/analytics/CountyAnalysis';
import { RiskDistribution } from '@/components/analytics/RiskDistribution';
import { SpendingTrend } from '@/components/analytics/SpendingTrend';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useAnalyticsKPIs,
  useCountyAnalysis,
  useDailyTrend,
  useRiskDistribution,
  useSpendingTrend,
} from '@/lib/queries/useAnalyticsQueries';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6m');
  const [county, setCounty] = useState('all');

  const monthsMap: Record<string, number> = {
    '1m': 1,
    '3m': 3,
    '6m': 6,
    '1y': 12,
    all: 24,
  };
  const months = monthsMap[timeRange] ?? 6;

  const { data: kpis, isLoading: loadingKPIs } = useAnalyticsKPIs();
  const { data: spendingData, isLoading: loadingSpending } = useSpendingTrend({
    months,
  });
  const { data: riskDist, isLoading: loadingDist } = useRiskDistribution();
  const { data: countyData, isLoading: loadingCounty } = useCountyAnalysis();
  const { data: dailyTrend, isLoading: loadingTrend } = useDailyTrend({
    days: 7,
  });

  const stats = [
    {
      label: 'Total Procurement Value',
      value: kpis ? `KES ${kpis.total_value}B` : '—',
      delta: '+0.0%',
      trend: 'up',
    },
    {
      label: 'Flagged Tenders',
      value: kpis ? String(kpis.flagged_count) : '—',
      delta: kpis?.flagged_delta ?? '—',
      trend: kpis?.flagged_trend ?? 'up',
    },
    {
      label: 'Savings Identified',
      value: 'KES 340M', // static until you add a savings model
      delta: '+5.2%',
      trend: 'up',
    },
    {
      label: 'Avg Risk Score',
      value: kpis ? String(kpis.avg_risk_score) : '—',
      delta: kpis?.avg_risk_delta ?? '—',
      trend: kpis?.avg_risk_trend ?? 'down',
    },
  ];
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-start'>
        <div>
          <h1 className='text-3xl font-bold text-white mb-2'>
            Analytics & Reports
          </h1>
          <p className='text-[#94a3b8]'>
            Comprehensive procurement intelligence and trend analysis
          </p>
        </div>
        <Button className='bg-[#00ff88] text-black hover:bg-[#00ff88]/90'>
          <Download className='w-4 h-4 mr-2' />
          Export Report
        </Button>
      </div>
      {/* Filters */}
      <Card className='bg-[#121418] border-[#1f2937] p-4'>
        <div className='flex gap-4'>
          <div className='flex-1'>
            <label className='block text-sm text-[#94a3b8] mb-2'>
              Time Range
            </label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className='bg-[#1a1d23] border-[#1f2937]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className='bg-[#121418] border-[#1f2937]'>
                <SelectItem value='1m'>Last Month</SelectItem>
                <SelectItem value='3m'>Last 3 Months</SelectItem>
                <SelectItem value='6m'>Last 6 Months</SelectItem>
                <SelectItem value='1y'>Last Year</SelectItem>
                <SelectItem value='all'>All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex-1'>
            <label className='block text-sm text-[#94a3b8] mb-2'>County</label>
            <Select value={county} onValueChange={setCounty}>
              <SelectTrigger className='bg-[#1a1d23] border-[#1f2937]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className='bg-[#121418] border-[#1f2937]'>
                <SelectItem value='all'>All Counties</SelectItem>
                <SelectItem value='nairobi'>Nairobi</SelectItem>
                <SelectItem value='kisumu'>Kisumu</SelectItem>
                <SelectItem value='mombasa'>Mombasa</SelectItem>
                <SelectItem value='nakuru'>Nakuru</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
      {/* KPI Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {stats.map((stat, idx) => (
          <Card key={idx} className='bg-[#121418] border-[#1f2937] p-6'>
            <p className='text-sm text-[#94a3b8] mb-2'>{stat.label}</p>
            <div className='flex justify-between items-end'>
              {loadingKPIs ? (
                <Loader2 className='w-5 h-5 animate-spin text-[#00ff88]' />
              ) : (
                <>
                  <p className='text-2xl font-mono font-bold text-white'>
                    {stat.value}
                  </p>
                  <p
                    className={`text-sm font-semibold ${stat.trend === 'up' ? 'text-[#ef4444]' : 'text-[#00ff88]'}`}
                  >
                    {stat.delta}
                  </p>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card className='bg-[#121418] border-[#1f2937] p-6'>
          <h2 className='text-lg font-semibold text-white mb-4'>
            Spending Trends
          </h2>
          {loadingSpending ? (
            <div className='flex justify-center h-75 items-center'>
              <Loader2 className='w-6 h-6 animate-spin text-[#00ff88]' />
            </div>
          ) : (
            <SpendingTrend data={spendingData} />
          )}
        </Card>
        <Card className='bg-[#121418] border-[#1f2937] p-6'>
          <h2 className='text-lg font-semibold text-white mb-4'>
            Risk Distribution
          </h2>
          {loadingDist ? (
            <div className='flex justify-center h-75 items-center'>
              <Loader2 className='w-6 h-6 animate-spin text-[#00ff88]' />
            </div>
          ) : (
            <RiskDistribution data={riskDist} />
          )}
        </Card>
        <Card className='bg-[#121418] border-[#1f2937] p-6 lg:col-span-2'>
          <h2 className='text-lg font-semibold text-white mb-4'>
            County Performance
          </h2>
          {loadingCounty ? (
            <div className='flex justify-center h-75 items-center'>
              <Loader2 className='w-6 h-6 animate-spin text-[#00ff88]' />
            </div>
          ) : (
            <CountyAnalysis data={countyData} />
          )}
        </Card>
        <Card className='bg-[#121418] border-[#1f2937] p-6 lg:col-span-2'>
          <h2 className='text-lg font-semibold text-white mb-4'>
            Monthly Risk Score Trend
          </h2>
          <TrendChart isLoading={loadingTrend} data={dailyTrend} />
        </Card>
      </div>
      {/* Key Findings — static, replace with API when you have a findings model */}
      <Card className='bg-[#121418] border-[#1f2937] p-6'>
        <h2 className='text-lg font-semibold text-white mb-4'>Key Findings</h2>
        <div className='space-y-3'>
          {[
            {
              color: '#00ff88',
              text: (
                <>
                  <span className='font-semibold'>
                    Price inflation detected
                  </span>{' '}
                  in 34 tenders across health sector, averaging 28% above
                  benchmark
                </>
              ),
            },
            {
              color: '#f59e0b',
              text: (
                <>
                  <span className='font-semibold'>Supplier concentration</span>{' '}
                  rising in construction sector - top 5 suppliers awarded 42% of
                  contracts
                </>
              ),
            },
            {
              color: '#ef4444',
              text: (
                <>
                  <span className='font-semibold'>
                    Specification manipulation
                  </span>{' '}
                  patterns identified in 12 tenders across county governments
                </>
              ),
            },
            {
              color: '#64748b',
              text: (
                <>
                  <span className='font-semibold'>Ghost companies</span>{' '}
                  suspected in 8 tender submissions - entities with no
                  verifiable operations
                </>
              ),
            },
          ].map((f, i) => (
            <div key={i} className='flex gap-3'>
              <div
                className='w-2 h-2 rounded-full mt-2 shrink-0'
                style={{ backgroundColor: f.color }}
              />
              <p className='text-white'>{f.text}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
