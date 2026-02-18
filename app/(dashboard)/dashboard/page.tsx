'use client';

import { StatsCard } from '@/components/shared/StatsCard';
import { Card } from '@/components/ui/card';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { mockDashboardStats } from '@/lib/mockData';
import { AlertCircle, Check, FolderOpen, TrendingUp } from 'lucide-react';
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

const RISK_COLORS = {
  critical: '#EF4444',
  high: '#F59E0B',
  medium: '#FBBF24',
  low: '#10B981',
};

export default function DashboardPage() {
  const stats = mockDashboardStats;

  // Prepare data for charts
  const riskDistribution = [
    {
      name: 'Critical',
      value: stats.tenders_by_risk.critical,
      fill: RISK_COLORS.critical,
    },
    { name: 'High', value: stats.tenders_by_risk.high, fill: RISK_COLORS.high },
    {
      name: 'Medium',
      value: stats.tenders_by_risk.medium,
      fill: RISK_COLORS.medium,
    },
    { name: 'Low', value: stats.tenders_by_risk.low, fill: RISK_COLORS.low },
  ];

  const countySavingsData = stats.savings_by_county
    .slice(0, 10)
    .map(county => ({
      county: county.county.substring(0, 6),
      savings: county.savings / 1000000000,
      name: county.county,
    }));

  const fraudTrendsData = stats.fraud_trends.slice(-30).map(trend => ({
    date: new Date(trend.date).toLocaleDateString('en-KE', {
      month: 'short',
      day: 'numeric',
    }),
    flagged: trend.flagged_tenders,
    total: trend.total_tenders,
  }));

  return (
    <div className='space-y-8'>
      {/* Page title */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
        <p className='mt-1 text-gray-600'>
          Real-time procurement monitoring and fraud detection
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='Total Tenders Monitored'
          value={stats.total_tenders.toLocaleString()}
          icon={<FolderOpen className='h-6 w-6' />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title='Flagged Tenders'
          value={stats.flagged_tenders.toLocaleString()}
          icon={<AlertCircle className='h-6 w-6 text-red-600' />}
          trend={{ value: 8, isPositive: false }}
          className='border-l-4 border-l-red-600'
        />
        <StatsCard
          title='Estimated Savings'
          value={formatCurrency(stats.estimated_savings, false)}
          icon={<Check className='h-6 w-6 text-green-600' />}
          trend={{ value: 15, isPositive: true }}
          className='border-l-4 border-l-green-600'
        />
        <StatsCard
          title='Active Investigations'
          value={stats.active_investigations.toLocaleString()}
          icon={<TrendingUp className='h-6 w-6 text-orange-600' />}
          trend={{ value: 5, isPositive: true }}
          className='border-l-4 border-l-orange-600'
        />
      </div>

      {/* Charts Grid */}
      <div className='grid gap-8 lg:grid-cols-3'>
        {/* Risk Distribution Pie Chart */}
        <Card className='p-6 lg:col-span-1'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>
            Risk Distribution
          </h2>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx='50%'
                cy='50%'
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill='#8884d8'
                dataKey='value'
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Fraud Trends Chart */}
        <Card className='p-6 lg:col-span-2'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>
            Fraud Detection Trends (Last 30 days)
          </h2>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={fraudTrendsData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='date' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type='monotone'
                dataKey='flagged'
                stroke='#EF4444'
                name='Flagged Tenders'
                dot={false}
              />
              <Line
                type='monotone'
                dataKey='total'
                stroke='#3B82F6'
                name='Total Tenders'
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Savings by County */}
      <Card className='p-6'>
        <h2 className='text-lg font-semibold text-gray-900 mb-4'>
          Top Counties by Estimated Savings (KSh Billions)
        </h2>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart
            data={countySavingsData}
            layout='vertical'
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis type='number' />
            <YAxis dataKey='county' type='category' width={90} />
            <Tooltip
              formatter={value => `KSh ${Number(value).toFixed(1)}B`}
              labelFormatter={label => label}
            />
            <Bar dataKey='savings' fill='#10B981' />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Top Corrupt Entities */}
      <Card className='p-6'>
        <h2 className='text-lg font-semibold text-gray-900 mb-4'>
          Top Entities by Corruption Risk
        </h2>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='border-b border-gray-200 bg-gray-50'>
              <tr>
                <th className='px-4 py-3 text-left font-semibold text-gray-700'>
                  Entity
                </th>
                <th className='px-4 py-3 text-right font-semibold text-gray-700'>
                  Tenders
                </th>
                <th className='px-4 py-3 text-right font-semibold text-gray-700'>
                  Flagged
                </th>
                <th className='px-4 py-3 text-right font-semibold text-gray-700'>
                  Rate
                </th>
                <th className='px-4 py-3 text-right font-semibold text-gray-700'>
                  Risk Score
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {stats.top_corrupt_entities.map(entity => (
                <tr key={entity.entity_code} className='hover:bg-gray-50'>
                  <td className='px-4 py-3 font-medium text-gray-900'>
                    {entity.entity_name}
                  </td>
                  <td className='px-4 py-3 text-right text-gray-600'>
                    {entity.total_tenders}
                  </td>
                  <td className='px-4 py-3 text-right text-red-600 font-semibold'>
                    {entity.flagged_tenders}
                  </td>
                  <td className='px-4 py-3 text-right text-gray-600'>
                    {formatPercentage(entity.corruption_rate)}
                  </td>
                  <td className='px-4 py-3 text-right'>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                        entity.risk_score >= 75
                          ? 'bg-red-100 text-red-800'
                          : entity.risk_score >= 50
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {entity.risk_score}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
