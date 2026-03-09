'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTender } from '@/hooks/queries/useTenders';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  FileText,
  Loader2,
  Upload,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// ── Schema ────────────────────────────────────────────────────────────────────

const bidSchema = z.object({
  // Step 1
  quotePrice: z
    .string()
    .min(1, 'Quote price is required')
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Quote price must be a positive number',
    }),
  deliveryTimeline: z
    .string()
    .min(1, 'Delivery timeline is required')
    .refine(val => !isNaN(parseInt(val)) && parseInt(val) > 0, {
      message: 'Delivery timeline must be a positive number',
    }),
  paymentTerms: z.string().min(1, 'Payment terms are required'),
  warranty: z.string().optional(),

  // Step 2
  technicalDocuments: z
    .array(z.instanceof(File))
    .min(1, 'At least one technical document is required'),
  technicalProposal: z.string().optional(),
  qualityApproach: z.string().optional(),
  riskMitigation: z.string().optional(),

  // Step 3
  financialDocuments: z
    .array(z.instanceof(File))
    .min(1, 'At least one financial document is required'),

  // Step 4
  complianceDocuments: z
    .array(z.instanceof(File))
    .min(1, 'At least one compliance document is required'),

  // Step 5
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

type BidFormValues = z.infer<typeof bidSchema>;

// ── Step validation fields map ────────────────────────────────────────────────

const STEP_FIELDS: Record<number, (keyof BidFormValues)[]> = {
  1: ['quotePrice', 'deliveryTimeline', 'paymentTerms'],
  2: ['technicalDocuments'],
  3: ['financialDocuments'],
  4: ['complianceDocuments'],
  5: ['termsAccepted'],
};

const STEPS = [
  { step: 1, title: 'Bid Amount & Timeline', icon: '💰' },
  { step: 2, title: 'Technical Proposal', icon: '📋' },
  { step: 3, title: 'Financial Proposal', icon: '💵' },
  { step: 4, title: 'Compliance Documents', icon: '✓' },
  { step: 5, title: 'Review & Submit', icon: '🎯' },
];

// ── File Upload Zone ──────────────────────────────────────────────────────────

function FileUploadZone({
  inputId,
  label,
  hint,
  files,
  error,
  onChange,
}: {
  inputId: string;
  label: string;
  hint: string;
  files: File[];
  error?: string;
  onChange: (files: File[]) => void;
}) {
  return (
    <div>
      <label className='block text-sm font-semibold text-gray-900 mb-3'>
        {label} *
      </label>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer ${
          error ? 'border-red-400 bg-red-50' : 'border-gray-300'
        }`}
        onClick={() => document.getElementById(inputId)?.click()}
      >
        <Upload className='h-8 w-8 text-gray-400 mx-auto mb-2' />
        <p className='text-sm text-gray-600 mb-1'>Click to upload</p>
        <p className='text-xs text-gray-500'>{hint}</p>
        <input
          id={inputId}
          type='file'
          multiple
          hidden
          onChange={e => {
            if (e.target.files) onChange(Array.from(e.target.files));
          }}
        />
      </div>
      {error && <p className='text-xs text-red-600 mt-1'>{error}</p>}
      {files.length > 0 && (
        <ul className='mt-4 space-y-2'>
          {files.map((file, idx) => (
            <li
              key={idx}
              className='flex items-center gap-2 p-2 bg-green-50 rounded'
            >
              <FileText className='h-4 w-4 text-green-600' />
              <span className='text-sm text-green-900'>{file.name}</span>
              <CheckCircle2 className='h-4 w-4 text-green-600 ml-auto' />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SubmitBidPage() {
  const router = useRouter();
  const params = useParams();
  const tenderId = params.id as string;

  const { data: tender, isLoading, isError } = useTender(tenderId);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<BidFormValues>({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      quotePrice: '',
      deliveryTimeline: '',
      paymentTerms: '',
      warranty: '',
      technicalDocuments: [],
      financialDocuments: [],
      complianceDocuments: [],
      technicalProposal: '',
      riskMitigation: '',
      qualityApproach: '',
      termsAccepted: false,
    },
  });

  const quotePrice = watch('quotePrice');
  const technicalDocuments = watch('technicalDocuments');
  const financialDocuments = watch('financialDocuments');
  const complianceDocuments = watch('complianceDocuments');
  const termsAccepted = watch('termsAccepted');

  const priceVariance =
    quotePrice && tender
      ? (
          ((parseFloat(quotePrice) - tender.amount) / tender.amount) *
          100
        ).toFixed(1)
      : null;
  const priceWithinRange =
    priceVariance !== null ? Math.abs(parseFloat(priceVariance)) <= 20 : true;

  const handleNext = async () => {
    const fields = STEP_FIELDS[currentStep];
    const valid = await trigger(fields);
    if (valid) setCurrentStep(prev => prev + 1);
  };

  const onSubmit = async (data: BidFormValues) => {
    setIsSubmitting(true);
    console.log('data--->', JSON.stringify(data));
    try {
      // TODO: replace with real bid service call
      // await bidsService.createBid({ tenderId, ...data })
      await new Promise(res => setTimeout(res, 1000)); // simulate API
      const bidRef = `BID-${Date.now()}`;
      toast.success('Bid submitted successfully!', {
        description: `Your bid reference: ${bidRef}`,
      });
      setTimeout(() => router.push('/tenders/my-bids'), 2000);
    } catch {
      toast.error('Failed to submit bid. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Loading / error states ──────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-gray-400' />
      </div>
    );
  }

  if (isError || !tender) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Card className='p-8 max-w-md text-center'>
          <AlertCircle className='h-12 w-12 text-red-600 mx-auto mb-4' />
          <p className='text-gray-900 font-semibold mb-4'>Tender not found</p>
          <Button onClick={() => router.push('/tenders/available')}>
            Back to Available Tenders
          </Button>
        </Card>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className='min-h-screen bg-background py-8 px-4'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <button
            onClick={() => router.back()}
            className='flex items-center gap-2 text-primary hover:text-primary/80 mb-4'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to tender details
          </button>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Submit Your Bid
          </h1>
          <p className='text-gray-600'>{tender.title}</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Left: Progress sidebar */}
            <div className='lg:col-span-1'>
              <Card className='p-4 sticky top-4 h-fit'>
                <h3 className='font-semibold text-gray-900 mb-4'>
                  Bid Submission Progress
                </h3>
                <div className='space-y-3'>
                  {STEPS.map(item => (
                    <button
                      key={item.step}
                      type='button'
                      onClick={() => setCurrentStep(item.step)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        currentStep === item.step
                          ? 'bg-primary text-white'
                          : currentStep > item.step
                            ? 'bg-green-100 text-green-900'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium'>
                          {item.title}
                        </span>
                        {currentStep > item.step && (
                          <CheckCircle2 className='h-4 w-4' />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <div className='mt-6 pt-6 border-t border-gray-200'>
                  <p className='text-xs text-gray-600 mb-1'>Tender Deadline</p>
                  <p className='text-sm font-semibold text-gray-900 mb-3'>
                    {tender.deadline
                      ? formatDate(new Date(tender.deadline))
                      : 'N/A'}
                  </p>
                  <p className='text-xs text-gray-600'>Budget Range:</p>
                  <p className='text-sm font-semibold text-primary'>
                    {formatCurrency(tender.amount)}
                  </p>
                </div>
              </Card>
            </div>
            {/* Right: Step content */}
            <div className='lg:col-span-2'>
              <Card className='p-6'>
                {/* ── Step 1 ── */}
                {currentStep === 1 && (
                  <div className='space-y-6'>
                    <div>
                      <label className='block text-sm font-semibold text-gray-900 mb-2'>
                        Quote Price (KES) *
                      </label>
                      <Input
                        type='number'
                        placeholder='Enter your quote price'
                        className='text-lg'
                        {...register('quotePrice')}
                      />
                      {errors.quotePrice && (
                        <p className='text-xs text-red-600 mt-1'>
                          {errors.quotePrice.message}
                        </p>
                      )}
                      {quotePrice && priceVariance !== null && (
                        <p
                          className={`mt-2 text-sm ${priceWithinRange ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {priceWithinRange ? '✓' : '⚠'} {priceVariance}% of
                          budget {!priceWithinRange && '(Outside 20% range)'}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className='block text-sm font-semibold text-gray-900 mb-2'>
                        Delivery Timeline (Days) *
                      </label>
                      <Input
                        type='number'
                        placeholder='e.g., 90'
                        {...register('deliveryTimeline')}
                      />
                      {errors.deliveryTimeline && (
                        <p className='text-xs text-red-600 mt-1'>
                          {errors.deliveryTimeline.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className='block text-sm font-semibold text-gray-900 mb-2'>
                        Payment Terms *
                      </label>
                      <select
                        className={`w-full px-3 py-2 border rounded-lg bg-background text-sm ${
                          errors.paymentTerms
                            ? 'border-red-400'
                            : 'border-gray-300'
                        }`}
                        {...register('paymentTerms')}
                      >
                        <option value=''>Select payment terms</option>
                        <option value='net30'>Net 30 days</option>
                        <option value='net60'>Net 60 days</option>
                        <option value='progressive'>Progressive Payment</option>
                        <option value='upfront'>
                          Upfront 30%, Balance on Delivery
                        </option>
                      </select>
                      {errors.paymentTerms && (
                        <p className='text-xs text-red-600 mt-1'>
                          {errors.paymentTerms.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className='block text-sm font-semibold text-gray-900 mb-2'>
                        Warranty Period
                      </label>
                      <Input
                        type='text'
                        placeholder='e.g., 12 months'
                        {...register('warranty')}
                      />
                    </div>
                  </div>
                )}
                {/* ── Step 2 ── */}
                {currentStep === 2 && (
                  <div className='space-y-6'>
                    <Controller
                      name='technicalDocuments'
                      control={control}
                      render={({ field }) => (
                        <FileUploadZone
                          inputId='tech-upload'
                          label='Technical Proposal Documents'
                          hint='PDF, DOC, XLS files accepted'
                          files={field.value}
                          error={errors.technicalDocuments?.message}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <div>
                      <label className='block text-sm font-semibold text-gray-900 mb-2'>
                        Implementation Plan
                      </label>
                      <Textarea
                        placeholder='Describe your implementation approach...'
                        rows={4}
                        {...register('technicalProposal')}
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-semibold text-gray-900 mb-2'>
                        Quality Assurance Approach
                      </label>
                      <Textarea
                        placeholder='Describe your QA process...'
                        rows={3}
                        {...register('qualityApproach')}
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-semibold text-gray-900 mb-2'>
                        Risk Mitigation Strategy
                      </label>
                      <Textarea
                        placeholder='How will you mitigate project risks...'
                        rows={3}
                        {...register('riskMitigation')}
                      />
                    </div>
                  </div>
                )}
                {/* ── Step 3 ── */}
                {currentStep === 3 && (
                  <div className='space-y-6'>
                    <Controller
                      name='financialDocuments'
                      control={control}
                      render={({ field }) => (
                        <FileUploadZone
                          inputId='fin-upload'
                          label='Financial Documents'
                          hint='Invoices, cost breakdown, payment terms'
                          files={field.value}
                          error={errors.financialDocuments?.message}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <Card className='p-4 bg-blue-50 border-blue-200'>
                      <p className='text-sm text-blue-900'>
                        <strong>Accepted Payment Terms:</strong> Net 30, Net 60,
                        Progressive Payment, or Upfront 30%
                      </p>
                    </Card>
                  </div>
                )}
                {/* ── Step 4 ── */}
                {currentStep === 4 && (
                  <div className='space-y-6'>
                    <Controller
                      name='complianceDocuments'
                      control={control}
                      render={({ field }) => (
                        <FileUploadZone
                          inputId='comp-upload'
                          label='Compliance Documents'
                          hint='Registration, tax clearance, insurance, certifications'
                          files={field.value}
                          error={errors.complianceDocuments?.message}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <Card className='p-4 bg-amber-50 border-amber-200'>
                      <p className='text-sm text-amber-900'>
                        <strong>Required:</strong> Company registration, Tax
                        Clearance, Insurance, Industry certifications, Bank
                        references
                      </p>
                    </Card>
                  </div>
                )}
                {/* ── Step 5 ── */}
                {currentStep === 5 && (
                  <div className='space-y-6'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      Review Your Bid
                    </h3>
                    <div className='space-y-3 bg-gray-50 p-4 rounded-lg text-sm'>
                      {[
                        { label: 'Tender', value: tender.title },
                        { label: 'Reference', value: tender.tender_number },
                        {
                          label: 'Quote Price',
                          value: formatCurrency(parseFloat(quotePrice || '0')),
                        },
                        {
                          label: 'Delivery Timeline',
                          value: `${watch('deliveryTimeline')} days`,
                        },
                        {
                          label: 'Payment Terms',
                          value: watch('paymentTerms').replace('-', ' '),
                        },
                        ...(watch('warranty')
                          ? [{ label: 'Warranty', value: watch('warranty') }]
                          : []),
                      ].map(({ label, value }) => (
                        <div key={label} className='flex justify-between'>
                          <span className='text-gray-600'>{label}:</span>
                          <span className='font-semibold text-right max-w-xs truncate'>
                            {value}
                          </span>
                        </div>
                      ))}
                      <div className='border-t border-gray-300 pt-3 flex justify-between'>
                        <span className='text-gray-600'>
                          Documents Attached:
                        </span>
                        <span className='font-semibold'>
                          {technicalDocuments.length +
                            financialDocuments.length +
                            complianceDocuments.length}
                        </span>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <input
                        type='checkbox'
                        id='terms'
                        className='mt-1'
                        {...register('termsAccepted')}
                      />
                      <label
                        htmlFor='terms'
                        className='text-sm text-gray-700 cursor-pointer'
                      >
                        I confirm that all information provided is accurate and
                        complete. I accept the tender terms and conditions.
                      </label>
                    </div>
                    {errors.termsAccepted && (
                      <p className='text-xs text-red-600'>
                        {errors.termsAccepted.message}
                      </p>
                    )}
                  </div>
                )}
                {/* Navigation */}
                <div className='mt-8 flex justify-between'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() =>
                      setCurrentStep(prev => Math.max(1, prev - 1))
                    }
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  <div className='flex gap-3 items-center'>
                    <span className='text-sm text-gray-600'>
                      Step {currentStep} of {STEPS.length}
                    </span>
                    {currentStep < STEPS.length ? (
                      <Button type='button' onClick={handleNext}>
                        Next
                        <ChevronRight className='h-4 w-4 ml-2' />
                      </Button>
                    ) : (
                      <Button
                        type='submit'
                        disabled={!termsAccepted || isSubmitting}
                        className='bg-green-600 hover:bg-green-700'
                      >
                        {isSubmitting ? (
                          <Loader2 className='h-4 w-4 animate-spin mr-2' />
                        ) : (
                          <CheckCircle2 className='h-4 w-4 mr-2' />
                        )}
                        Submit Bid
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
