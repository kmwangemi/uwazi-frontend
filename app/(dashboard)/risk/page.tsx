'use client';

import { RiskBadge } from '@/components/RiskBadge';
import { RiskGauge } from '@/components/RiskGauge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  useAnalyzeSpecifications,
  useCheckPrice,
} from '@/lib/queries/useRiskQueries';
import { formatDeviation } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// ── Schemas ───────────────────────────────────────────────────────────────────

const priceSchema = z.object({
  item_description: z.string().min(1, 'Description is required'),
  estimated_price: z.coerce.number().positive('Must be a positive number'),
  category: z.string().min(1, 'Category is required'),
  county: z.string().min(1, 'County is required'),
});

const specSchema = z.object({
  specification_text: z.string().min(10, 'Please enter at least 10 characters'),
});

type PriceForm = z.infer<typeof priceSchema>;
type SpecForm = z.infer<typeof specSchema>;

// ── Risk level color helper ───────────────────────────────────────────────────

const riskColor = (level: string) =>
  level === 'critical'
    ? 'text-[#00ff88]'
    : level === 'high'
      ? 'text-[#ef4444]'
      : level === 'medium'
        ? 'text-[#f59e0b]'
        : 'text-[#64748b]';

// ── Page ──────────────────────────────────────────────────────────────────────

export default function RiskPage() {
  const [activeTab, setActiveTab] = useState<'price' | 'spec' | 'county'>(
    'price',
  );

  const {
    mutate: checkPrice,
    isPending: priceLoading,
    data: priceResult,
  } = useCheckPrice();
  const {
    mutate: analyzeSpec,
    isPending: specLoading,
    data: specResult,
  } = useAnalyzeSpecifications();

  const priceForm = useForm<PriceForm>({
    resolver: zodResolver(priceSchema),
    defaultValues: {
      item_description: '',
      estimated_price: 0,
      category: '',
      county: '',
    },
  });

  const specForm = useForm<SpecForm>({
    resolver: zodResolver(specSchema),
    defaultValues: { specification_text: '' },
  });

  const onPriceSubmit = (values: PriceForm) => checkPrice(values);
  const onSpecSubmit = (values: SpecForm) =>
    analyzeSpec(values.specification_text);

  const tabs = [
    { key: 'price', label: 'Price Benchmark' },
    { key: 'spec', label: 'Specification Analysis' },
    { key: 'county', label: 'County Overview' },
  ] as const;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-white mb-2'>Risk Analysis</h1>
        <p className='text-[#94a3b8]'>
          Advanced procurement risk assessment tools
        </p>
      </div>
      {/* Tabs */}
      <div className='flex gap-2 border-b border-[#1f2937] pb-4'>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === tab.key
                ? 'text-[#00ff88] border-b-2 border-[#00ff88]'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Price Benchmark Tab */}
      {activeTab === 'price' && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <Card className='bg-[#121418] border-[#1f2937] p-6'>
            <h2 className='text-lg font-semibold text-white mb-4'>
              Price Benchmark Checker
            </h2>
            <Form {...priceForm}>
              <form
                onSubmit={priceForm.handleSubmit(onPriceSubmit)}
                className='space-y-4'
              >
                <FormField
                  control={priceForm.control}
                  name='item_description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[#94a3b8]'>
                        Item Description
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='e.g., Office equipment supply'
                          className='bg-[#1a1d23] border-[#1f2937] text-white'
                        />
                      </FormControl>
                      <FormMessage className='text-xs text-[#ef4444]' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={priceForm.control}
                  name='estimated_price'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[#94a3b8]'>
                        Estimated Price (KES)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type='number'
                          placeholder='0'
                          className='bg-[#1a1d23] border-[#1f2937] text-white'
                        />
                      </FormControl>
                      <FormMessage className='text-xs text-[#ef4444]' />
                    </FormItem>
                  )}
                />
                <div className='grid grid-cols-2 gap-3'>
                  <FormField
                    control={priceForm.control}
                    name='category'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[#94a3b8]'>
                          Category
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='Supply'
                            className='bg-[#1a1d23] border-[#1f2937] text-white'
                          />
                        </FormControl>
                        <FormMessage className='text-xs text-[#ef4444]' />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={priceForm.control}
                    name='county'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[#94a3b8]'>County</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='Nairobi'
                            className='bg-[#1a1d23] border-[#1f2937] text-white'
                          />
                        </FormControl>
                        <FormMessage className='text-xs text-[#ef4444]' />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type='submit'
                  disabled={priceLoading}
                  className='w-full bg-[#00ff88] text-black hover:bg-[#00ff88]/90'
                >
                  {priceLoading ? (
                    <>
                      <Loader className='w-4 h-4 mr-2 animate-spin' />
                      Checking...
                    </>
                  ) : (
                    'Check Price'
                  )}
                </Button>
              </form>
            </Form>
          </Card>
          {/* Price Results */}
          {priceResult && (
            <Card className='bg-[#121418] border-[#1f2937] p-6'>
              <h3 className='text-lg font-semibold text-white mb-4'>
                Analysis Results
              </h3>
              <div className='space-y-4'>
                <div>
                  <p className='text-sm text-[#94a3b8] mb-1'>Deviation</p>
                  <p
                    className={`text-2xl font-mono font-bold ${priceResult.deviation_percent > 0 ? 'text-[#ef4444]' : 'text-[#00ff88]'}`}
                  >
                    {formatDeviation(priceResult.deviation_percent)}
                  </p>
                </div>
                <div className='grid grid-cols-3 gap-3'>
                  {[
                    { label: 'Min', value: priceResult.benchmark_min },
                    { label: 'Avg', value: priceResult.benchmark_avg },
                    { label: 'Max', value: priceResult.benchmark_max },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className='bg-[#1a1d23] p-3 rounded border border-[#1f2937]'
                    >
                      <p className='text-xs text-[#94a3b8]'>{label}</p>
                      <p className='font-mono text-white text-sm'>
                        KES {(value / 1_000_000).toFixed(1)}M
                      </p>
                    </div>
                  ))}
                </div>
                <div className='bg-[#1a1d23] p-3 rounded border border-[#1f2937]'>
                  <p className='text-sm text-[#94a3b8] mb-1'>Risk Level</p>
                  <RiskBadge level={priceResult.risk_level} showScore={false} />
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
      {/* Specification Analysis Tab */}
      {activeTab === 'spec' && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <Card className='bg-[#121418] border-[#1f2937] p-6'>
            <h2 className='text-lg font-semibold text-white mb-4'>
              Specification Analyzer
            </h2>
            <Form {...specForm}>
              <form
                onSubmit={specForm.handleSubmit(onSpecSubmit)}
                className='space-y-4'
              >
                <FormField
                  control={specForm.control}
                  name='specification_text'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[#94a3b8]'>
                        Specification Text
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder='Paste the specification text here...'
                          rows={8}
                          className='bg-[#1a1d23] border-[#1f2937] text-white placeholder-[#64748b] font-mono text-xs'
                        />
                      </FormControl>
                      <FormMessage className='text-xs text-[#ef4444]' />
                    </FormItem>
                  )}
                />
                <Button
                  type='submit'
                  disabled={specLoading}
                  className='w-full bg-[#00ff88] text-black hover:bg-[#00ff88]/90'
                >
                  {specLoading ? (
                    <>
                      <Loader className='w-4 h-4 mr-2 animate-spin' />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze'
                  )}
                </Button>
              </form>
            </Form>
          </Card>
          {/* Spec Results */}
          {specResult && (
            <Card className='bg-[#121418] border-[#1f2937] p-6'>
              <h3 className='text-lg font-semibold text-white mb-4'>
                Analysis Results
              </h3>
              <div className='space-y-4'>
                <div>
                  <p className='text-sm text-[#94a3b8] mb-2'>
                    Restrictiveness Score
                  </p>
                  <RiskGauge
                    score={specResult.restrictiveness_score}
                    size='sm'
                  />
                </div>
                {specResult.brand_names_detected.length > 0 && (
                  <div>
                    <p className='text-sm text-[#f59e0b] mb-2'>
                      Brand Names Detected
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {specResult.brand_names_detected.map((brand, idx) => (
                        <span
                          key={idx}
                          className='px-2 py-1 bg-[#f59e0b]/10 border border-[#f59e0b] text-[#f59e0b] text-xs rounded'
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {specResult.single_source_indicators.length > 0 && (
                  <div>
                    <p className='text-sm text-[#ef4444] mb-2'>
                      Single Source Indicators
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {specResult.single_source_indicators.map(
                        (indicator, idx) => (
                          <span
                            key={idx}
                            className='px-2 py-1 bg-[#ef4444]/10 border border-[#ef4444] text-[#ef4444] text-xs rounded'
                          >
                            {indicator}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}
                {specResult.issues.length > 0 && (
                  <div className='space-y-2'>
                    <p className='text-sm text-[#94a3b8]'>Issues Found</p>
                    {specResult.issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className='bg-[#1a1d23] p-3 rounded border border-[#1f2937]'
                      >
                        <div className='flex justify-between items-start mb-1'>
                          <p className='text-sm font-semibold text-white'>
                            {issue.issue}
                          </p>
                          <RiskBadge
                            level={issue.severity}
                            size='sm'
                            showScore={false}
                          />
                        </div>
                        <p className='text-xs text-[#94a3b8]'>
                          {issue.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      )}
      {/* County Overview Tab */}
      {activeTab === 'county' && (
        <Card className='bg-[#121418] border-[#1f2937] p-6'>
          <div className='space-y-4'>
            <div>
              <h2 className='text-lg font-semibold text-white mb-2'>
                County Risk Overview
              </h2>
              <p className='text-[#94a3b8] mb-4'>
                View detailed procurement risk analysis by county, including
                risk scores, tender counts, and comparative metrics across all
                county governments.
              </p>
            </div>
            <Link href='/county-risk'>
              <Button className='bg-[#00ff88] text-black hover:bg-[#00ff88]/90'>
                View County Risk Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
