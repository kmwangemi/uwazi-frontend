'use client';

import { RiskBadge } from '@/components/RiskBadge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download } from 'lucide-react';
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

const COLORS = {
  critical: '#00ff88',
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#64748b',
};

// Sample data for counties
const countyData = [
  {
    county: 'Nairobi',
    riskScore: 78,
    tenderCount: 245,
    totalValue: 2450000000,
    riskLevel: 'high',
    ghostSuppliers: 34,
    priceDeviations: 12,
    bidRigging: 8,
  },
  {
    county: 'Mombasa',
    riskScore: 62,
    tenderCount: 156,
    totalValue: 1560000000,
    riskLevel: 'medium',
    ghostSuppliers: 21,
    priceDeviations: 7,
    bidRigging: 4,
  },
  {
    county: 'Kisumu',
    riskScore: 55,
    tenderCount: 123,
    totalValue: 1230000000,
    riskLevel: 'medium',
    ghostSuppliers: 16,
    priceDeviations: 5,
    bidRigging: 3,
  },
  {
    county: 'Nakuru',
    riskScore: 71,
    tenderCount: 198,
    totalValue: 1980000000,
    riskLevel: 'high',
    ghostSuppliers: 28,
    priceDeviations: 9,
    bidRigging: 6,
  },
  {
    county: 'Kericho',
    riskScore: 48,
    tenderCount: 87,
    totalValue: 870000000,
    riskLevel: 'medium',
    ghostSuppliers: 12,
    priceDeviations: 3,
    bidRigging: 2,
  },
  {
    county: 'Eldoret',
    riskScore: 65,
    tenderCount: 142,
    totalValue: 1420000000,
    riskLevel: 'medium',
    ghostSuppliers: 24,
    priceDeviations: 6,
    bidRigging: 4,
  },
  {
    county: 'Thika',
    riskScore: 58,
    tenderCount: 104,
    totalValue: 1040000000,
    riskLevel: 'medium',
    ghostSuppliers: 18,
    priceDeviations: 4,
    bidRigging: 3,
  },
  {
    county: 'Gilgil',
    riskScore: 42,
    tenderCount: 76,
    totalValue: 760000000,
    riskLevel: 'low',
    ghostSuppliers: 10,
    priceDeviations: 2,
    bidRigging: 1,
  },
];

// Trend data over months
const trendData = [
  { month: 'Jan', criticalCount: 3, highCount: 8, mediumCount: 12 },
  { month: 'Feb', criticalCount: 5, highCount: 11, mediumCount: 14 },
  { month: 'Mar', criticalCount: 4, highCount: 9, mediumCount: 13 },
  { month: 'Apr', criticalCount: 6, highCount: 13, mediumCount: 16 },
  { month: 'May', criticalCount: 8, highCount: 15, mediumCount: 18 },
  { month: 'Jun', criticalCount: 7, highCount: 14, mediumCount: 17 },
];

// Risk distribution by type
const riskTypeData = [
  { name: 'Ghost Suppliers', value: 245, color: COLORS.critical },
  { name: 'Price Deviation', value: 156, color: COLORS.high },
  { name: 'Bid Rigging', value: 87, color: COLORS.medium },
  { name: 'Specification Issue', value: 123, color: COLORS.low },
];

export default function CountyRiskPage() {
  const [sortBy, setSortBy] = useState<'risk' | 'tenders' | 'value'>('risk');

  const sortedCounties = [...countyData].sort((a, b) => {
    if (sortBy === 'risk') return b.riskScore - a.riskScore;
    if (sortBy === 'tenders') return b.tenderCount - a.tenderCount;
    return b.totalValue - a.totalValue;
  });

  const highRiskCounties = countyData.filter(
    c => c.riskLevel === 'high',
  ).length;
  const totalTenders = countyData.reduce((sum, c) => sum + c.tenderCount, 0);
  const totalValue = countyData.reduce((sum, c) => sum + c.totalValue, 0);

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
            KES {(totalValue / 1000000000).toFixed(1)}B
          </p>
          <p className='text-xs text-[#64748b] mt-2'>Under analysis</p>
        </Card>
      </div>
      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Trend Chart */}
        <Card className='bg-[#121418] border-[#1f2937] p-6'>
          <h2 className='text-lg font-semibold text-white mb-4'>
            Risk Trend (6 Months)
          </h2>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray='3 3' stroke='#1f2937' />
              <XAxis stroke='#94a3b8' />
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
                stroke={COLORS.critical}
                name='Critical'
              />
              <Line
                type='monotone'
                dataKey='highCount'
                stroke={COLORS.high}
                name='High'
              />
              <Line
                type='monotone'
                dataKey='mediumCount'
                stroke={COLORS.medium}
                name='Medium'
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        {/* Risk Type Distribution */}
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
                fill='#8884d8'
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
      {/* County Comparison */}
      <Card className='bg-[#121418] border-[#1f2937] p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold text-white'>
            County Comparison
          </h2>
          <div className='flex gap-2'>
            <Button
              size='sm'
              variant={sortBy === 'risk' ? 'default' : 'outline'}
              onClick={() => setSortBy('risk')}
              className={
                sortBy === 'risk'
                  ? 'bg-[#00ff88] text-black'
                  : 'border-[#1f2937]'
              }
            >
              Risk Score
            </Button>
            <Button
              size='sm'
              variant={sortBy === 'tenders' ? 'default' : 'outline'}
              onClick={() => setSortBy('tenders')}
              className={
                sortBy === 'tenders'
                  ? 'bg-[#00ff88] text-black'
                  : 'border-[#1f2937]'
              }
            >
              Tenders
            </Button>
            <Button
              size='sm'
              variant={sortBy === 'value' ? 'default' : 'outline'}
              onClick={() => setSortBy('value')}
              className={
                sortBy === 'value'
                  ? 'bg-[#00ff88] text-black'
                  : 'border-[#1f2937]'
              }
            >
              Value
            </Button>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-[#1f2937]'>
                <th className='text-left py-3 px-4 text-[#94a3b8] font-semibold'>
                  County
                </th>
                <th className='text-right py-3 px-4 text-[#94a3b8] font-semibold'>
                  Risk Score
                </th>
                <th className='text-right py-3 px-4 text-[#94a3b8] font-semibold'>
                  Tenders
                </th>
                <th className='text-right py-3 px-4 text-[#94a3b8] font-semibold'>
                  Total Value
                </th>
                <th className='text-right py-3 px-4 text-[#94a3b8] font-semibold'>
                  Ghost
                </th>
                <th className='text-right py-3 px-4 text-[#94a3b8] font-semibold'>
                  Price Dev
                </th>
                <th className='text-right py-3 px-4 text-[#94a3b8] font-semibold'>
                  Bid Rig
                </th>
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
                    KES {(county.totalValue / 1000000000).toFixed(1)}B
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
      {/* Risk Analysis Chart */}
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
      {/* Export Button */}
      <div className='flex justify-end'>
        <Button className='bg-[#00ff88] text-black hover:bg-[#00ff88]/90'>
          <Download className='w-4 h-4 mr-2' />
          Export Report
        </Button>
      </div>
    </div>
  );
}
