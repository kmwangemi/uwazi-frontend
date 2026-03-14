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
import { Download } from 'lucide-react';
import { useState } from 'react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6m');
  const [county, setCounty] = useState('all');

  const stats = [
    {
      label: 'Total Procurement Value',
      value: 'KES 2.4B',
      delta: '+12.5%',
      trend: 'up',
    },
    {
      label: 'Flagged Tenders',
      value: '128',
      delta: '+8.3%',
      trend: 'up',
    },
    {
      label: 'Savings Identified',
      value: 'KES 340M',
      delta: '+5.2%',
      trend: 'up',
    },
    {
      label: 'Avg Risk Score',
      value: '56.2',
      delta: '-3.1%',
      trend: 'down',
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
      {/* KPIs */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {stats.map((stat, idx) => (
          <Card key={idx} className='bg-[#121418] border-[#1f2937] p-6'>
            <p className='text-sm text-[#94a3b8] mb-2'>{stat.label}</p>
            <div className='flex justify-between items-end'>
              <p className='text-2xl font-mono font-bold text-white'>
                {stat.value}
              </p>
              <p
                className={`text-sm font-semibold ${stat.trend === 'up' ? 'text-[#ef4444]' : 'text-[#00ff88]'}`}
              >
                {stat.delta}
              </p>
            </div>
          </Card>
        ))}
      </div>
      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Spending Trend */}
        <Card className='bg-[#121418] border-[#1f2937] p-6'>
          <h2 className='text-lg font-semibold text-white mb-4'>
            Spending Trends
          </h2>
          <SpendingTrend />
        </Card>
        {/* Risk Distribution */}
        <Card className='bg-[#121418] border-[#1f2937] p-6'>
          <h2 className='text-lg font-semibold text-white mb-4'>
            Risk Distribution
          </h2>
          <RiskDistribution />
        </Card>
        {/* County Analysis */}
        <Card className='bg-[#121418] border-[#1f2937] p-6 lg:col-span-2'>
          <h2 className='text-lg font-semibold text-white mb-4'>
            County Performance
          </h2>
          <CountyAnalysis />
        </Card>
        {/* Monthly Trend */}
        <Card className='bg-[#121418] border-[#1f2937] p-6 lg:col-span-2'>
          <h2 className='text-lg font-semibold text-white mb-4'>
            Monthly Risk Score Trend
          </h2>
          <TrendChart />
        </Card>
      </div>
      {/* Key Findings */}
      <Card className='bg-[#121418] border-[#1f2937] p-6'>
        <h2 className='text-lg font-semibold text-white mb-4'>Key Findings</h2>
        <div className='space-y-3'>
          <div className='flex gap-3'>
            <div className='w-2 h-2 bg-[#00ff88] rounded-full mt-2 shrink-0'></div>
            <p className='text-white'>
              <span className='font-semibold'>Price inflation detected</span> in
              34 tenders across health sector, averaging 28% above benchmark
            </p>
          </div>
          <div className='flex gap-3'>
            <div className='w-2 h-2 bg-[#f59e0b] rounded-full mt-2 shrink-0'></div>
            <p className='text-white'>
              <span className='font-semibold'>Supplier concentration</span>{' '}
              rising in construction sector - top 5 suppliers awarded 42% of
              contracts
            </p>
          </div>
          <div className='flex gap-3'>
            <div className='w-2 h-2 bg-[#ef4444] rounded-full mt-2 shrink-0'></div>
            <p className='text-white'>
              <span className='font-semibold'>Specification manipulation</span>{' '}
              patterns identified in 12 tenders across county governments
            </p>
          </div>
          <div className='flex gap-3'>
            <div className='w-2 h-2 bg-[#64748b] rounded-full mt-2 shrink-0'></div>
            <p className='text-white'>
              <span className='font-semibold'>Ghost companies</span> suspected
              in 8 tender submissions - entities with no verifiable operations
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
