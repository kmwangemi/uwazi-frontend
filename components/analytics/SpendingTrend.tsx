'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface SpendingTrendProps {
  data?: Array<{
    month: string;
    budgeted: number;
    actual: number;
    flagged: number;
  }>;
}

export function SpendingTrend({ data }: SpendingTrendProps) {
  const chartData = data || [
    { month: 'Jan', budgeted: 250, actual: 245, flagged: 18 },
    { month: 'Feb', budgeted: 280, actual: 295, flagged: 22 },
    { month: 'Mar', budgeted: 320, actual: 310, flagged: 25 },
    { month: 'Apr', budgeted: 300, actual: 335, flagged: 28 },
    { month: 'May', budgeted: 350, actual: 365, flagged: 31 },
    { month: 'Jun', budgeted: 400, actual: 420, flagged: 35 },
  ];

  return (
    <ResponsiveContainer width='100%' height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray='3 3' stroke='#1f2937' />
        <XAxis dataKey='month' stroke='#94a3b8' />
        <YAxis stroke='#94a3b8' />
        <Tooltip
          contentStyle={{
            backgroundColor: '#121418',
            border: '1px solid #1f2937',
            borderRadius: '6px',
          }}
          labelStyle={{ color: '#e0e0e0' }}
        />
        <Legend />
        <Line
          type='monotone'
          dataKey='budgeted'
          stroke='#64748b'
          strokeWidth={2}
          name='Budgeted (M)'
        />
        <Line
          type='monotone'
          dataKey='actual'
          stroke='#00ff88'
          strokeWidth={2}
          name='Actual (M)'
        />
        <Line
          type='monotone'
          dataKey='flagged'
          stroke='#ef4444'
          strokeWidth={2}
          name='Flagged (M)'
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
