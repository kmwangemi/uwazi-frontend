'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface RiskDistributionProps {
  data?: {
    critical: number
    high: number
    medium: number
    low: number
  }
}

export function RiskDistribution({ data }: RiskDistributionProps) {
  const chartData = [
    {
      name: 'Critical',
      value: data?.critical || 12,
      fill: '#00ff88',
    },
    {
      name: 'High',
      value: data?.high || 28,
      fill: '#ef4444',
    },
    {
      name: 'Medium',
      value: data?.medium || 45,
      fill: '#f59e0b',
    },
    {
      name: 'Low',
      value: data?.low || 15,
      fill: '#64748b',
    },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: ${value}`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#121418',
            border: '1px solid #1f2937',
            borderRadius: '6px',
          }}
          labelStyle={{ color: '#e0e0e0' }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
