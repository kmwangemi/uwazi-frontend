'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/formatters';
import { mockDashboardStats } from '@/lib/mockData';
import { AlertCircle, CheckCircle, Search, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function TransparencyPage() {
  const stats = mockDashboardStats;

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='bg-gradient-to-br from-primary to-blue-700 text-white px-4 py-16 sm:py-20'>
        <div className='mx-auto max-w-4xl text-center'>
          <h1 className='text-4xl font-bold sm:text-5xl'>
            Kenya's Procurement Transparency Portal
          </h1>
          <p className='mt-4 text-xl text-blue-100'>
            Real-time monitoring of government spending and corruption detection
          </p>
          <div className='mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center'>
            <Link href='/whistleblower'>
              <Button size='lg' variant='secondary'>
                Report Corruption
              </Button>
            </Link>
            <Button
              size='lg'
              variant='outline'
              className='border-white text-white hover:bg-white/10'
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className='mx-auto mt-12 max-w-2xl'>
          <div className='relative'>
            <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-300' />
            <Input
              placeholder='Search by tender number, entity, or supplier...'
              className='border-0 bg-white pl-12 py-3 text-gray-900 placeholder:text-gray-500'
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='px-4 py-16'>
        <div className='mx-auto max-w-6xl'>
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            <Card className='p-6 text-center'>
              <p className='text-3xl font-bold text-primary'>
                {stats.total_tenders.toLocaleString()}
              </p>
              <p className='mt-2 text-sm text-gray-600'>Tenders Monitored</p>
            </Card>
            <Card className='p-6 text-center'>
              <p className='text-3xl font-bold text-red-600'>
                {stats.flagged_tenders.toLocaleString()}
              </p>
              <p className='mt-2 text-sm text-gray-600'>Flagged for Fraud</p>
            </Card>
            <Card className='p-6 text-center'>
              <p className='text-3xl font-bold text-green-600'>
                {formatCurrency(stats.estimated_savings, false)}
              </p>
              <p className='mt-2 text-sm text-gray-600'>Estimated Savings</p>
            </Card>
            <Card className='p-6 text-center'>
              <p className='text-3xl font-bold text-orange-600'>
                {stats.active_investigations}
              </p>
              <p className='mt-2 text-sm text-gray-600'>Active Cases</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Insights */}
      <section className='bg-gray-50 px-4 py-16'>
        <div className='mx-auto max-w-6xl'>
          <h2 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
            Key Insights
          </h2>
          <div className='grid gap-6 md:grid-cols-3'>
            {[
              {
                icon: <AlertCircle className='h-8 w-8' />,
                title: 'High-Risk Tenders',
                description:
                  'Over 1,300 high-risk procurement contracts identified this year',
                color: 'text-red-600',
              },
              {
                icon: <CheckCircle className='h-8 w-8' />,
                title: 'Verification System',
                description:
                  'All 47 counties covered with real-time supplier verification',
                color: 'text-green-600',
              },
              {
                icon: <TrendingUp className='h-8 w-8' />,
                title: 'Savings Achieved',
                description: 'KSh 67.5 billion in potential fraud prevented',
                color: 'text-blue-600',
              },
            ].map((insight, i) => (
              <Card key={i} className='p-6'>
                <div
                  className={`inline-flex rounded-lg bg-gray-100 p-3 ${insight.color}`}
                >
                  {insight.icon}
                </div>
                <h3 className='mt-4 font-semibold text-gray-900'>
                  {insight.title}
                </h3>
                <p className='mt-2 text-sm text-gray-600'>
                  {insight.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className='px-4 py-16'>
        <div className='mx-auto max-w-2xl text-center rounded-xl bg-primary/10 p-8'>
          <h2 className='text-2xl font-bold text-gray-900'>
            Have Information About Fraud?
          </h2>
          <p className='mt-3 text-gray-700'>
            We maintain strict confidentiality for all whistleblowers. Report
            corruption anonymously and help protect Kenya's public resources.
          </p>
          <Link href='/whistleblower' className='mt-6 block'>
            <Button size='lg'>Submit Anonymous Report</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
