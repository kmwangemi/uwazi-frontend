'use client';

import { RiskBadge } from '@/components/RiskBadge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  useCountyRisk,
  useRiskTrend,
  useRiskTypeDistribution,
} from '@/lib/queries/useCountyRiskQueries';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function CountyRiskPage() {
  const [sortBy, setSortBy] = useState<'risk' | 'tenders' | 'value'>('risk');

  const { data: countyData = [], isLoading: loadingCounty } = useCountyRisk();
  const { data: trendData = [], isLoading: loadingTrend } = useRiskTrend({
    months: 6,
  });
  const { data: riskTypeData = [], isLoading: loadingTypes } =
    useRiskTypeDistribution();

  const loading = loadingCounty || loadingTrend || loadingTypes;

  const sortedCounties = [...countyData].sort((a, b) => {
    if (sortBy === 'risk') return b.riskScore - a.riskScore;
    if (sortBy === 'tenders') return b.tenderCount - a.tenderCount;
    return b.totalValue - a.totalValue;
  });

  const highRiskCounties = countyData.filter(
    c => c.riskLevel === 'high' || c.riskLevel === 'critical',
  ).length;
  const totalTenders = countyData.reduce((sum, c) => sum + c.tenderCount, 0);
  const totalValue = countyData.reduce((sum, c) => sum + c.totalValue, 0);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader2 className='w-8 h-8 animate-spin text-[#00ff88]' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-white mb-2'>
          County Risk Overview
        </h1>
        <p className='text-[#94a3b8]'>
          Procurement risk analysis by county government
        </p>
      </div>

      {/* KPI Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card className='bg-[#121418] border-[#1f2937] p-6'>
          <p className='text-sm text-[#94a3b8] mb-1'>High-Risk Counties</p>
          <p className='text-3xl font-bold text-[#ef4444]'>
            {highRiskCounties}
          </p>
          <p className='text-xs text-[#64748b] mt-2'>
            Requiring immediate attention
          </p>
        </Card>
        <Card className='bg-[#121418] border-[#1f2937] p-6'>
          <p className='text-sm text-[#94a3b8] mb-1'>Total Tenders Analyzed</p>
          <p className='text-3xl font-bold text-[#00ff88]'>
            {totalTenders.toLocaleString()}
          </p>
          <p className='text-xs text-[#64748b] mt-2'>Across all counties</p>
        </Card>
        <Card className='bg-[#121418] border-[#1f2937] p-6'>
          <p className='text-sm text-[#94a3b8] mb-1'>Total Procurement Value</p>
          <p className='text-3xl font-bold text-[#f59e0b]'>
            KES {(totalValue / 1_000_000_000).toFixed(1)}B
          </p>
          <p className='text-xs text-[#64748b] mt-2'>Under analysis</p>
        </Card>
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card className='bg-[#121418] border-[#1f2937] p-6'>
          <h2 className='text-lg font-semibold text-white mb-4'>
            Risk Trend (6 Months)
          </h2>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray='3 3' stroke='#1f2937' />
              <XAxis dataKey='month' stroke='#94a3b8' />
              <YAxis stroke='#94a3b8' />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#121418',
                  border: '1px solid #1f2937',
                  color: '#e0e0e0',
                }}
              />
              <Legend />
              <Line
                type='monotone'
                dataKey='criticalCount'
                stroke='#00ff88'
                name='Critical'
              />
              <Line
                type='monotone'
                dataKey='highCount'
                stroke='#ef4444'
                name='High'
              />
              <Line
                type='monotone'
                dataKey='mediumCount'
                stroke='#f59e0b'
                name='Medium'
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className='bg-[#121418] border-[#1f2937] p-6'>
          <h2 className='text-lg font-semibold text-white mb-4'>
            Risk Type Distribution
          </h2>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={riskTypeData}
                cx='50%'
                cy='50%'
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                dataKey='value'
              >
                {riskTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#121418',
                  border: '1px solid #1f2937',
                  color: '#e0e0e0',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* County Table */}
      <Card className='bg-[#121418] border-[#1f2937] p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold text-white'>
            County Comparison
          </h2>
          <div className='flex gap-2'>
            {(['risk', 'tenders', 'value'] as const).map(opt => (
              <Button
                key={opt}
                size='sm'
                variant={sortBy === opt ? 'default' : 'outline'}
                onClick={() => setSortBy(opt)}
                className={
                  sortBy === opt
                    ? 'bg-[#00ff88] text-black'
                    : 'border-[#1f2937]'
                }
              >
                {opt === 'risk'
                  ? 'Risk Score'
                  : opt === 'tenders'
                    ? 'Tenders'
                    : 'Value'}
              </Button>
            ))}
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-[#1f2937]'>
                {[
                  'County',
                  'Risk Score',
                  'Tenders',
                  'Total Value',
                  'Ghost',
                  'Price Dev',
                  'Bid Rig',
                ].map(h => (
                  <th
                    key={h}
                    className={`py-3 px-4 text-[#94a3b8] font-semibold ${h === 'County' ? 'text-left' : 'text-right'}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedCounties.map(county => (
                <tr
                  key={county.county}
                  className='border-b border-[#1f2937] hover:bg-[#1a1d23] transition'
                >
                  <td className='py-3 px-4 text-white font-semibold'>
                    {county.county}
                  </td>
                  <td className='py-3 px-4 text-right'>
                    <RiskBadge
                      level={county.riskLevel as any}
                      score={county.riskScore}
                      size='sm'
                    />
                  </td>
                  <td className='py-3 px-4 text-right text-[#00ff88] font-mono'>
                    {county.tenderCount}
                  </td>
                  <td className='py-3 px-4 text-right font-mono text-[#f59e0b]'>
                    KES {(county.totalValue / 1_000_000_000).toFixed(1)}B
                  </td>
                  <td className='py-3 px-4 text-right text-[#ef4444] font-semibold'>
                    {county.ghostSuppliers}
                  </td>
                  <td className='py-3 px-4 text-right text-[#f59e0b] font-semibold'>
                    {county.priceDeviations}
                  </td>
                  <td className='py-3 px-4 text-right text-[#64748b] font-semibold'>
                    {county.bidRigging}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {/* Bar Chart */}
      <Card className='bg-[#121418] border-[#1f2937] p-6'>
        <h2 className='text-lg font-semibold text-white mb-4'>
          Risk Score by County
        </h2>
        <ResponsiveContainer width='100%' height={400}>
          <BarChart
            data={sortedCounties}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' stroke='#1f2937' />
            <XAxis
              dataKey='county'
              stroke='#94a3b8'
              angle={-45}
              textAnchor='end'
              height={80}
            />
            <YAxis stroke='#94a3b8' domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#121418',
                border: '1px solid #1f2937',
                color: '#e0e0e0',
              }}
            />
            <Bar dataKey='riskScore' fill='#00ff88' radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      {/* Export */}
      {/* <div className='flex justify-end'>
        <Button className='bg-[#00ff88] text-black hover:bg-[#00ff88]/90'>
          <Download className='w-4 h-4 mr-2' />
          Export Report
        </Button>
      </div> */}
    </div>
  );
}
