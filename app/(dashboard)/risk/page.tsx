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
  item_name: z.string().min(1, 'Description is required'),
  tender_price: z.coerce.number().positive('Must be a positive number'),
  category: z.string().optional(),
  county: z.string().optional(),
});

const specSchema = z.object({
  specification_text: z.string().min(10, 'Please enter at least 10 characters'),
});

type PriceForm = z.infer<typeof priceSchema>;
type SpecForm = z.infer<typeof specSchema>;

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
      item_name: '',
      tender_price: 0,
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

      {/* ── Price Benchmark Tab ───────────────────────────────────────────── */}
      {activeTab === 'price' && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Form */}
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
                  name='item_name'
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
                  name='tender_price'
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
                {/* Deviation */}
                <div>
                  <p className='text-sm text-[#94a3b8] mb-1'>Deviation</p>
                  <p
                    className={`text-2xl font-mono font-bold ${
                      priceResult.deviation_pct > 0
                        ? 'text-[#ef4444]'
                        : 'text-[#00ff88]'
                    }`}
                  >
                    {formatDeviation(priceResult.deviation_pct)}
                  </p>
                </div>

                {/* Benchmark min/avg/max */}
                {priceResult.benchmark && (
                  <div className='grid grid-cols-3 gap-3'>
                    {[
                      { label: 'Min', value: priceResult.benchmark.min_price },
                      { label: 'Avg', value: priceResult.benchmark.avg_price },
                      { label: 'Max', value: priceResult.benchmark.max_price },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className='bg-[#1a1d23] p-3 rounded border border-[#1f2937]'
                      >
                        <p className='text-xs text-[#94a3b8]'>{label}</p>
                        <p className='font-mono text-white text-sm'>
                          KES {((value ?? 0) / 1_000_000).toFixed(1)}M
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Risk level */}
                <div className='bg-[#1a1d23] p-3 rounded border border-[#1f2937]'>
                  <p className='text-sm text-[#94a3b8] mb-1'>Risk Level</p>
                  <RiskBadge level={priceResult.risk_level} showScore={false} />
                </div>

                {/* Verdict */}
                {priceResult.verdict && (
                  <div className='bg-[#1a1d23] p-3 rounded border border-[#1f2937]'>
                    <p className='text-sm text-[#94a3b8] mb-1'>Verdict</p>
                    <p className='text-white text-sm'>{priceResult.verdict}</p>
                  </div>
                )}

                {/* Flags */}
                {priceResult.flags?.length > 0 && (
                  <div className='space-y-2'>
                    <p className='text-sm text-[#94a3b8]'>Flags</p>
                    {priceResult.flags.map((flag, idx) => (
                      <div
                        key={idx}
                        className='bg-[#1a1d23] p-2 rounded border border-[#1f2937] text-xs text-[#f59e0b]'
                      >
                        {flag}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ── Specification Analysis Tab ────────────────────────────────────── */}
      {activeTab === 'spec' && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Form */}
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
                {/* Restrictiveness gauge */}
                <div>
                  <p className='text-sm text-[#94a3b8] mb-2'>
                    Restrictiveness Score
                  </p>
                  <RiskGauge
                    score={specResult.restrictiveness_score}
                    size='sm'
                  />
                </div>

                {/* Verdict */}
                {specResult.verdict && (
                  <div className='bg-[#1a1d23] p-3 rounded border border-[#1f2937]'>
                    <p className='text-sm text-[#94a3b8] mb-1'>Verdict</p>
                    <p className='text-white text-sm'>{specResult.verdict}</p>
                  </div>
                )}

                {/* Brand names — backend returns brand_names_found */}
                {specResult.brand_names_found?.length > 0 && (
                  <div>
                    <p className='text-sm text-[#f59e0b] mb-2'>
                      Brand Names Detected
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {specResult.brand_names_found.map((brand, idx) => (
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

                {/* Single source — backend returns boolean */}
                {specResult.single_source_detected && (
                  <div className='bg-[#ef4444]/10 border border-[#ef4444] rounded p-3'>
                    <p className='text-sm text-[#ef4444] font-semibold'>
                      Single Source Detected
                    </p>
                    <p className='text-xs text-[#ef4444] mt-1'>
                      Specification shows signs of being written for a single
                      vendor.
                    </p>
                  </div>
                )}

                {/* Issues */}
                {specResult.issues?.length > 0 && (
                  <div className='space-y-2'>
                    <p className='text-sm text-[#94a3b8]'>Issues Found</p>
                    {specResult.issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className='bg-[#1a1d23] p-3 rounded border border-[#1f2937]'
                      >
                        <div className='flex justify-between items-start mb-1'>
                          <p className='text-sm font-semibold text-white'>
                            {issue.description}
                          </p>
                          <RiskBadge
                            level={issue.severity as any}
                            size='sm'
                            showScore={false}
                          />
                        </div>
                        {issue.excerpt && (
                          <p className='text-xs text-[#64748b] font-mono mt-1'>
                            {issue.excerpt}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* AI analysis if present */}
                {specResult.ai_analysis && (
                  <div className='bg-[#1a1d23] p-3 rounded border border-[#1f2937]'>
                    <p className='text-sm text-[#94a3b8] mb-1'>AI Analysis</p>
                    <p className='text-white text-xs leading-relaxed font-mono'>
                      {specResult.ai_analysis}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      )}
      {/* ── County Overview Tab ───────────────────────────────────────────── */}
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
