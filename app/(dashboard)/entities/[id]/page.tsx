'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/formatters';
import { mockTenders } from '@/lib/mockData';
import { ArrowLeft, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function EntityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const entityTenders = mockTenders.filter(t => t.procuring_entity === id);

  if (entityTenders.length === 0) {
    return (
      <div className='space-y-6'>
        <Button variant='outline' onClick={() => router.back()}>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back
        </Button>
        <div className='text-center py-12'>
          <h2 className='text-2xl font-bold text-gray-900'>Entity not found</h2>
        </div>
      </div>
    );
  }

  const entity = entityTenders[0];
  const totalSpent = entityTenders.reduce((sum, t) => sum + t.amount, 0);
  const avgRisk =
    entityTenders.reduce((sum, t) => sum + t.risk_score, 0) /
    entityTenders.length;
  const highRiskTenders = entityTenders.filter(t => t.risk_score >= 70).length;

  // Group spending by category
  const spendingByCategory = entityTenders.reduce(
    (acc, t) => {
      const existing = acc.find(item => item.category === t.category);
      if (existing) {
        existing.amount += t.amount;
      } else {
        acc.push({ category: t.category, amount: t.amount });
      }
      return acc;
    },
    [] as Array<{ category: string; amount: number }>,
  );

  // Monthly spending trend (simulated)
  const monthlyTrend = [
    { month: 'Jan', amount: totalSpent * 0.1 },
    { month: 'Feb', amount: totalSpent * 0.12 },
    { month: 'Mar', amount: totalSpent * 0.15 },
    { month: 'Apr', amount: totalSpent * 0.13 },
    { month: 'May', amount: totalSpent * 0.18 },
    { month: 'Jun', amount: totalSpent * 0.32 },
  ];

  return (
    <div className='space-y-6'>
      <Button variant='outline' size='sm' onClick={() => router.back()}>
        <ArrowLeft className='h-4 w-4 mr-2' />
        Back
      </Button>

      <div className='space-y-4'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              {entity.procuring_entity}
            </h1>
            <p className='text-gray-600 mt-1'>{entity.county} County</p>
          </div>
          <Button variant='outline' size='sm'>
            <Download className='h-4 w-4 mr-2' />
            Download Report
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card className='p-4'>
          <p className='text-sm text-gray-600'>Total Tenders</p>
          <p className='text-3xl font-bold mt-2 text-gray-900'>
            {entityTenders.length}
          </p>
        </Card>
        <Card className='p-4'>
          <p className='text-sm text-gray-600'>Total Spending</p>
          <p className='text-2xl font-bold mt-2 text-gray-900'>
            {formatCurrency(totalSpent)}
          </p>
        </Card>
        <Card className='p-4'>
          <p className='text-sm text-gray-600'>Average Risk Score</p>
          <p className='text-3xl font-bold mt-2 text-gray-900'>
            {avgRisk.toFixed(0)}
          </p>
        </Card>
        <Card className='p-4'>
          <p className='text-sm text-gray-600'>High Risk Tenders</p>
          <p className='text-3xl font-bold mt-2 text-red-600'>
            {highRiskTenders}
          </p>
        </Card>
      </div>

      <Card className='p-6'>
        <Tabs defaultValue='analysis' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='analysis'>Analysis</TabsTrigger>
            <TabsTrigger value='spending'>Spending</TabsTrigger>
            <TabsTrigger value='tenders'>Tenders</TabsTrigger>
          </TabsList>

          <TabsContent value='analysis' className='space-y-4'>
            <div className='space-y-4'>
              <div>
                <h3 className='font-semibold text-gray-900 mb-3'>
                  Procurement Trends
                </h3>
                <ResponsiveContainer width='100%' height={300}>
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='month' />
                    <YAxis />
                    <Tooltip
                      formatter={value => formatCurrency(value as number)}
                    />
                    <Line
                      type='monotone'
                      dataKey='amount'
                      stroke='#2563EB'
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h3 className='font-semibold text-gray-900 mb-3'>
                  Risk Assessment
                </h3>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-gray-600'>Low Risk Tenders</span>
                    <span className='font-medium'>
                      {entityTenders.filter(t => t.risk_score < 40).length}
                    </span>
                  </div>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-gray-600'>Medium Risk Tenders</span>
                    <span className='font-medium'>
                      {
                        entityTenders.filter(
                          t => t.risk_score >= 40 && t.risk_score < 70,
                        ).length
                      }
                    </span>
                  </div>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-gray-600'>High Risk Tenders</span>
                    <span className='font-medium text-red-600'>
                      {highRiskTenders}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='spending' className='space-y-4'>
            <div>
              <h3 className='font-semibold text-gray-900 mb-3'>
                Spending by Category
              </h3>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={spendingByCategory}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis
                    dataKey='category'
                    angle={-45}
                    textAnchor='end'
                    height={80}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={value => formatCurrency(value as number)}
                  />
                  <Bar dataKey='amount' fill='#10B981' />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value='tenders' className='space-y-4'>
            <div className='space-y-2'>
              {entityTenders.slice(0, 10).map(tender => (
                <div
                  key={tender.id}
                  className='border border-gray-200 rounded-lg p-3 hover:bg-gray-50'
                >
                  <div className='flex items-start justify-between gap-2'>
                    <div className='flex-1'>
                      <p className='font-medium text-gray-900'>
                        {tender.title}
                      </p>
                      <p className='text-sm text-gray-600'>
                        {tender.tender_number}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='font-medium text-gray-900'>
                        {formatCurrency(tender.amount)}
                      </p>
                      <Badge
                        className={
                          tender.risk_score >= 70
                            ? 'bg-red-100 text-red-800'
                            : tender.risk_score >= 40
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }
                      >
                        Risk: {tender.risk_score}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
