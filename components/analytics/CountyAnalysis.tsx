'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface CountyAnalysisProps {
  data?: Array<{
    county: string;
    tenders: number;
    risk_score: number;
  }>;
}

export function CountyAnalysis({ data }: CountyAnalysisProps) {
  const chartData = data || [
    { county: 'Nairobi', tenders: 45, risk_score: 68 },
    { county: 'Kisumu', tenders: 28, risk_score: 52 },
    { county: 'Mombasa', tenders: 32, risk_score: 71 },
    { county: 'Nakuru', tenders: 19, risk_score: 45 },
    { county: 'Westlands', tenders: 23, risk_score: 58 },
  ];

  return (
    <ResponsiveContainer width='100%' height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray='3 3' stroke='#1f2937' />
        <XAxis dataKey='county' stroke='#94a3b8' />
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
        <Bar dataKey='tenders' fill='#00ff88' name='Tenders Count' />
        <Bar dataKey='risk_score' fill='#f59e0b' name='Avg Risk Score' />
      </BarChart>
    </ResponsiveContainer>
  );
}
