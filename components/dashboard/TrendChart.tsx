'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'

interface TrendChartProps {
  isLoading?: boolean
}

// Sample data - will be replaced with API data
const sampleData = [
  { date: 'Mar 14', critical: 2, high: 5, medium: 8 },
  { date: 'Mar 15', critical: 3, high: 6, medium: 9 },
  { date: 'Mar 16', critical: 2, high: 7, medium: 10 },
  { date: 'Mar 17', critical: 4, high: 8, medium: 11 },
  { date: 'Mar 18', critical: 5, high: 9, medium: 12 },
  { date: 'Mar 19', critical: 4, high: 10, medium: 13 },
  { date: 'Mar 20', critical: 6, high: 11, medium: 14 },
]

export function TrendChart({ isLoading }: TrendChartProps) {
  if (isLoading) {
    return <Skeleton className="h-72" />
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={sampleData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00ff88" stopOpacity={0.01} />
          </linearGradient>
          <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.01} />
          </linearGradient>
          <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#1f2937"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          stroke="#64748b"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#64748b"
          style={{ fontSize: '12px' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#121418',
            border: '1px solid #1f2937',
            borderRadius: '6px',
          }}
          cursor={{ fill: 'rgba(0, 255, 136, 0.1)' }}
        />
        <Area
          type="monotone"
          dataKey="critical"
          stackId="1"
          stroke="#00ff88"
          fillOpacity={1}
          fill="url(#colorCritical)"
          name="Critical"
        />
        <Area
          type="monotone"
          dataKey="high"
          stackId="1"
          stroke="#ef4444"
          fillOpacity={1}
          fill="url(#colorHigh)"
          name="High"
        />
        <Area
          type="monotone"
          dataKey="medium"
          stackId="1"
          stroke="#f59e0b"
          fillOpacity={1}
          fill="url(#colorMedium)"
          name="Medium"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
