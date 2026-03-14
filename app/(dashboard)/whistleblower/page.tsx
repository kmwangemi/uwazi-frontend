'use client';

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
import { useSubmitWhistleblowerReport } from '@/lib/queries/useWhistleblowerQueries';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, Loader, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// ── Constants ─────────────────────────────────────────────────────────────────

const ALLEGATION_TYPES = [
  'Bid Rigging',
  'Ghost Suppliers',
  'Inflated Prices',
  'Conflict of Interest',
  'Kickbacks / Bribery',
  'Specification Manipulation',
  'Fraudulent Documents',
  'Other',
];

// ── Schema ────────────────────────────────────────────────────────────────────

const whistleblowerSchema = z.object({
  allegation_type: z.string().min(1, 'Please select an allegation type'),
  tender_reference: z.string().optional(),
  entity_name: z.string().optional(),
  description: z
    .string()
    .min(100, 'Description must be at least 100 characters'),
  evidence_description: z.string().optional(),
  contact_preference: z.enum(['none', 'email']).default('none'),
});

type WhistleblowerForm = z.infer<typeof whistleblowerSchema>;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function WhistleblowerPage() {
  const {
    mutate: submitReport,
    isPending,
    isSuccess,
    isError,
    data: result,
  } = useSubmitWhistleblowerReport();

  const form = useForm<WhistleblowerForm>({
    resolver: zodResolver(whistleblowerSchema),
    defaultValues: {
      allegation_type: '',
      tender_reference: '',
      entity_name: '',
      description: '',
      evidence_description: '',
      contact_preference: 'none',
    },
  });

  const contactPref = form.watch('contact_preference');
  const descriptionLength = form.watch('description').length;

  const onSubmit = (values: WhistleblowerForm) => submitReport(values);

  // ── Success state ─────────────────────────────────────────────────────────

  if (isSuccess && result) {
    return (
      <div className='max-w-2xl mx-auto py-16 text-center space-y-6'>
        <CheckCircle2 className='w-16 h-16 text-[#00ff88] mx-auto' />
        <h2 className='text-2xl font-bold text-white'>Report Submitted</h2>
        <p className='text-[#94a3b8]'>
          Your report has been received and will be reviewed securely.
        </p>
        <Card className='bg-[#121418] border-[#1f2937] p-6 text-left space-y-3'>
          <div className='flex justify-between'>
            <span className='text-[#94a3b8] text-sm'>Report ID</span>
            <span className='font-mono text-[#00ff88] text-sm'>
              {result.report_id}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-[#94a3b8] text-sm'>Credibility Score</span>
            <span className='text-white text-sm'>
              {result.credibility_score}/100
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-[#94a3b8] text-sm'>Urgency</span>
            <span
              className={`text-sm font-semibold uppercase ${
                result.urgency === 'critical'
                  ? 'text-[#00ff88]'
                  : result.urgency === 'high'
                    ? 'text-[#ef4444]'
                    : result.urgency === 'medium'
                      ? 'text-[#f59e0b]'
                      : 'text-[#64748b]'
              }`}
            >
              {result.urgency}
            </span>
          </div>
          <div className='pt-2 border-t border-[#1f2937]'>
            <p className='text-[#94a3b8] text-xs'>{result.triage_summary}</p>
          </div>
        </Card>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      {/* Header */}
      <div className='text-center py-8'>
        <Lock className='w-12 h-12 text-[#00ff88] mx-auto mb-4' />
        <h1 className='text-3xl font-bold text-white mb-2'>
          Anonymous Whistleblower Portal
        </h1>
        <p className='text-[#94a3b8]'>
          Report corruption and procurement fraud safely and anonymously
        </p>
      </div>
      {/* Privacy Notice */}
      <Card className='bg-[#121418] border border-[#00ff88]/30 p-6'>
        <div className='flex gap-4'>
          <CheckCircle2 className='w-5 h-5 text-[#00ff88] shrink-0 mt-0.5' />
          <div className='text-sm'>
            <p className='font-semibold text-white mb-1'>
              Your Identity is Never Recorded
            </p>
            <p className='text-[#94a3b8]'>
              We do not collect, store, or track any personally identifiable
              information. Your anonymity is protected by design.
            </p>
          </div>
        </div>
      </Card>
      {/* Form */}
      <Card className='bg-[#121418] border-[#1f2937] p-8'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* API Error */}
            {isError && (
              <div className='p-4 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded flex gap-3'>
                <AlertCircle className='w-5 h-5 text-[#ef4444] shrink-0 mt-0.5' />
                <p className='text-[#ef4444] text-sm'>
                  Submission failed. Please try again.
                </p>
              </div>
            )}
            {/* Allegation Type */}
            <FormField
              control={form.control}
              name='allegation_type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-white font-semibold'>
                    Type of Allegation <span className='text-[#ef4444]'>*</span>
                  </FormLabel>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-1'>
                    {ALLEGATION_TYPES.map(type => (
                      <button
                        key={type}
                        type='button'
                        onClick={() => field.onChange(type)}
                        className={`p-3 rounded border-2 transition text-sm font-semibold ${
                          field.value === type
                            ? 'border-[#00ff88] bg-[#00ff88]/10 text-[#00ff88]'
                            : 'border-[#1f2937] bg-[#1a1d23] text-[#94a3b8] hover:border-[#00ff88]/50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <FormMessage className='text-xs text-[#ef4444]' />
                </FormItem>
              )}
            />
            {/* Tender Reference */}
            <FormField
              control={form.control}
              name='tender_reference'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-white font-semibold'>
                    Tender Reference (optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='e.g., KCAC/2026/001'
                      className='bg-[#1a1d23] border-[#1f2937] text-white'
                    />
                  </FormControl>
                  <FormMessage className='text-xs text-[#ef4444]' />
                </FormItem>
              )}
            />
            {/* Entity Name */}
            <FormField
              control={form.control}
              name='entity_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-white font-semibold'>
                    Entity Name (optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='e.g., Ministry of Health'
                      className='bg-[#1a1d23] border-[#1f2937] text-white'
                    />
                  </FormControl>
                  <FormMessage className='text-xs text-[#ef4444]' />
                </FormItem>
              )}
            />
            {/* Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-white font-semibold'>
                    Description <span className='text-[#ef4444]'>*</span>
                    <span className='text-[#64748b] font-normal ml-1'>
                      (minimum 100 characters)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='Provide detailed information about the suspected corruption or fraud...'
                      rows={6}
                      className='bg-[#1a1d23] border-[#1f2937] text-white placeholder-[#64748b]'
                    />
                  </FormControl>
                  <p
                    className={`text-xs mt-1 ${descriptionLength >= 100 ? 'text-[#00ff88]' : 'text-[#94a3b8]'}`}
                  >
                    {descriptionLength} / 100 characters
                  </p>
                  <FormMessage className='text-xs text-[#ef4444]' />
                </FormItem>
              )}
            />
            {/* Evidence */}
            <FormField
              control={form.control}
              name='evidence_description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-white font-semibold'>
                    Supporting Evidence (optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='Describe any evidence, documents, or witnesses...'
                      rows={4}
                      className='bg-[#1a1d23] border-[#1f2937] text-white placeholder-[#64748b]'
                    />
                  </FormControl>
                  <FormMessage className='text-xs text-[#ef4444]' />
                </FormItem>
              )}
            />
            {/* Contact Preference */}
            <FormField
              control={form.control}
              name='contact_preference'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-white font-semibold'>
                    Contact Preference
                  </FormLabel>
                  <div className='space-y-2 mt-1'>
                    {(
                      [
                        { value: 'none', label: '✓ No contact (most secure)' },
                        { value: 'email', label: '✉ Secure encrypted email' },
                      ] as const
                    ).map(option => (
                      <button
                        key={option.value}
                        type='button'
                        onClick={() => field.onChange(option.value)}
                        className={`w-full p-3 rounded border-2 transition text-sm font-semibold ${
                          field.value === option.value
                            ? 'border-[#00ff88] bg-[#00ff88]/10 text-[#00ff88]'
                            : 'border-[#1f2937] bg-[#1a1d23] text-[#94a3b8]'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <FormMessage className='text-xs text-[#ef4444]' />
                </FormItem>
              )}
            />
            {/* Submit */}
            <Button
              type='submit'
              disabled={isPending}
              className='w-full bg-[#00ff88] text-black hover:bg-[#00ff88]/90 font-semibold'
            >
              {isPending ? (
                <>
                  <Loader className='w-4 h-4 mr-2 animate-spin' />
                  Submitting...
                </>
              ) : (
                'Submit Report'
              )}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
