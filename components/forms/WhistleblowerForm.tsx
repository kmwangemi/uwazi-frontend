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
import {
  whistleblowerSchema,
  type WhistleblowerInput,
} from '@/lib/schemas/whistleblower';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, Loader, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';

const ALLEGATION_TYPES = [
  'Price inflation',
  'Ghost supplier',
  'Bid rigging',
  'Kickback',
  'Specification manipulation',
  'Other',
];

interface WhistleblowerFormProps {
  isPublic?: boolean;
}

export function WhistleblowerForm({
  isPublic = false,
}: WhistleblowerFormProps) {
  const {
    mutate: submitReport,
    isPending,
    isError,
    isSuccess,
    data: result,
  } = useSubmitWhistleblowerReport();

  const form = useForm<WhistleblowerInput>({
    resolver: zodResolver(whistleblowerSchema),
    defaultValues: {
      allegation_type: undefined,
      tender_reference: '',
      entity_name: '',
      description: '',
      evidence_description: '',
      contact_preference: 'none',
    },
  });

  const onSubmit = (data: WhistleblowerInput) => submitReport(data);

  // ── Success ───────────────────────────────────────────────────────────────

  if (isSuccess && result) {
    return (
      <div className='max-w-2xl mx-auto space-y-6 py-8'>
        <div className='text-center'>
          <CheckCircle2 className='w-16 h-16 text-[#00ff88] mx-auto mb-4' />
          <h1 className='text-3xl font-bold text-white mb-2'>
            Report Received
          </h1>
          <p className='text-[#94a3b8]'>
            Your anonymous report has been submitted for review
          </p>
        </div>

        <Card className='bg-[#0f1117] border border-[#00ff88]/30 p-6'>
          <div className='text-center space-y-3'>
            <p className='text-sm text-[#94a3b8]'>Report Reference Number</p>
            <p className='font-mono text-2xl font-bold text-[#00ff88] select-all'>
              {result.report_id} {/* ✅ real ID from API, not Date.now() */}
            </p>
            <p className='text-xs text-[#64748b]'>
              Save this number for your records. Store it securely.
            </p>
          </div>
          <div className='mt-4 pt-4 border-t border-[#1f2937] grid grid-cols-2 gap-3 text-sm'>
            <div>
              <p className='text-[#94a3b8] text-xs'>Credibility Score</p>
              <p className='text-white font-mono'>
                {result.credibility_score}/100
              </p>
            </div>
            <div>
              <p className='text-[#94a3b8] text-xs'>Urgency</p>
              <p
                className={`font-semibold uppercase text-sm ${
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
              </p>
            </div>
            <div className='col-span-2'>
              <p className='text-[#94a3b8] text-xs mb-1'>Summary</p>
              <p className='text-[#e0e0e0] text-xs'>{result.triage_summary}</p>
            </div>
          </div>
        </Card>

        <Card className='bg-[#121418] border-[#1f2937] p-6'>
          <div className='flex gap-4'>
            <Lock className='w-5 h-5 text-[#00ff88] shrink-0 mt-0.5' />
            <div className='text-sm text-[#e0e0e0]'>
              <p className='font-semibold text-white mb-2'>
                Your Privacy is Protected
              </p>
              <ul className='space-y-1 text-xs text-[#94a3b8]'>
                <li>• Your identity is never recorded or stored</li>
                <li>• No IP addresses or device identifiers are logged</li>
                <li>• Communication is encrypted end-to-end</li>
                <li>• Only verified investigators can view your report</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        {/* API Error */}
        {isError && (
          <div className='p-4 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded flex gap-3'>
            <AlertCircle className='w-5 h-5 text-[#ef4444] shrink-0 mt-0.5' />
            <p className='text-[#ef4444] text-sm'>
              Failed to submit report. Please try again.
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
                Type of Allegation
              </FormLabel>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-2'>
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
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Tender Reference */}
        <FormField
          control={form.control}
          name='tender_reference'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white'>
                Tender Reference (Optional)
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder='e.g., KCAC/2026/001'
                  className='bg-[#1a1d23] border-[#1f2937] text-white placeholder-[#64748b]'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Entity Name */}
        <FormField
          control={form.control}
          name='entity_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white'>
                Entity Name (Optional)
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder='e.g., Ministry of Health'
                  className='bg-[#1a1d23] border-[#1f2937] text-white placeholder-[#64748b]'
                />
              </FormControl>
              <FormMessage />
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
                Description
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
                className={`text-xs mt-1 ${field.value.length >= 100 ? 'text-[#00ff88]' : 'text-[#94a3b8]'}`}
              >
                {field.value.length} / 100 characters
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Evidence */}
        <FormField
          control={form.control}
          name='evidence_description'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white'>
                Supporting Evidence (Optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder='Describe any evidence, documents, or witnesses...'
                  rows={4}
                  className='bg-[#1a1d23] border-[#1f2937] text-white placeholder-[#64748b]'
                />
              </FormControl>
              <FormMessage />
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
              <div className='space-y-2 mt-2'>
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
              <FormMessage />
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
  );
}
