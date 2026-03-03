'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTender } from '@/hooks/queries/useTenders';
import { formatCurrency, formatDate } from '@/lib/formatters';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  FileText,
  Upload,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SubmitBidPage() {
  const router = useRouter();
  const params = useParams();
  const tenderId = params.id as string; // ✅ string UUID, not parseInt

  const { data: tender, isLoading, isError } = useTender(tenderId);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    quotePrice: '',
    deliveryTimeline: '',
    paymentTerms: '',
    warranty: '',
    technicalDocuments: [] as File[],
    financialDocuments: [] as File[],
    complianceDocuments: [] as File[],
    technicalProposal: '',
    riskMitigation: '',
    qualityApproach: '',
    termsAccepted: false,
  });

  const totalSteps = 5;

  const priceVariance =
    formData.quotePrice && tender
      ? (
          ((parseFloat(formData.quotePrice) - tender.amount) / tender.amount) *
          100
        ).toFixed(1)
      : null;

  const priceWithinRange =
    priceVariance !== null ? Math.abs(parseFloat(priceVariance)) <= 20 : true;

  const handleFileUpload = (
    category: 'technical' | 'financial' | 'compliance',
    files: FileList,
  ) => {
    const fileArray = Array.from(files);
    if (category === 'technical') {
      setFormData(prev => ({ ...prev, technicalDocuments: fileArray }));
    } else if (category === 'financial') {
      setFormData(prev => ({ ...prev, financialDocuments: fileArray }));
    } else {
      setFormData(prev => ({ ...prev, complianceDocuments: fileArray }));
    }
  };

  const handleSubmitBid = () => {
    const bidId = `BID-${Date.now()}`;
    toast.success('Bid submitted successfully!', {
      description: `Your bid reference: ${bidId}`,
    });
    setTimeout(() => router.push('/tenders/my-bids'), 2000);
  };

  const canProceedToNext = (() => {
    if (currentStep === 1) {
      return !!(
        formData.quotePrice &&
        formData.deliveryTimeline &&
        formData.paymentTerms &&
        priceWithinRange
      );
    }
    if (currentStep === 2) return formData.technicalDocuments.length > 0;
    if (currentStep === 3) return formData.financialDocuments.length > 0;
    if (currentStep === 4) return formData.complianceDocuments.length > 0;
    if (currentStep === 5) return formData.termsAccepted;
    return false;
  })();

  // Loading state
  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-gray-500'>Loading tender details...</p>
      </div>
    );
  }

  // Error / not found state
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
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left: Progress */}
          <div className='lg:col-span-1'>
            <Card className='p-4 sticky top-4 h-fit'>
              <h3 className='font-semibold text-gray-900 mb-4'>
                Bid Submission Progress
              </h3>
              <div className='space-y-3'>
                {[
                  { step: 1, title: 'Bid Amount & Timeline', icon: '💰' },
                  { step: 2, title: 'Technical Proposal', icon: '📋' },
                  { step: 3, title: 'Financial Proposal', icon: '💵' },
                  { step: 4, title: 'Compliance Documents', icon: '✓' },
                  { step: 5, title: 'Review & Submit', icon: '🎯' },
                ].map(item => (
                  <button
                    key={item.step}
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
                      <span className='text-sm font-medium'>{item.title}</span>
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
                  {tender.deadline // ✅ was submission_deadline
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
          {/* Right: Form Content */}
          <div className='lg:col-span-2'>
            <Card className='p-6'>
              {/* Step 1: Amount & Timeline */}
              {currentStep === 1 && (
                <div className='space-y-6'>
                  <div>
                    <label className='block text-sm font-semibold text-gray-900 mb-2'>
                      Quote Price (KES) *
                    </label>
                    <Input
                      type='number'
                      placeholder='Enter your quote price'
                      value={formData.quotePrice}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          quotePrice: e.target.value,
                        }))
                      }
                      className='text-lg'
                    />
                    {formData.quotePrice && priceVariance !== null && (
                      <div
                        className={`mt-2 text-sm ${priceWithinRange ? 'text-green-600' : 'text-red-600'}`}
                      >
                        <p>
                          {priceWithinRange ? '✓' : '⚠'} {priceVariance}% of
                          budget {!priceWithinRange && '(Outside 20% range)'}
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className='block text-sm font-semibold text-gray-900 mb-2'>
                      Delivery Timeline (Days) *
                    </label>
                    <Input
                      type='number'
                      placeholder='e.g., 90'
                      value={formData.deliveryTimeline}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          deliveryTimeline: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-semibold text-gray-900 mb-2'>
                      Payment Terms *
                    </label>
                    <select
                      value={formData.paymentTerms}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          paymentTerms: e.target.value,
                        }))
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-background text-sm'
                    >
                      <option value=''>Select payment terms</option>
                      <option value='net30'>Net 30 days</option>
                      <option value='net60'>Net 60 days</option>
                      <option value='progressive'>Progressive Payment</option>
                      <option value='upfront'>
                        Upfront 30%, Balance on Delivery
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-semibold text-gray-900 mb-2'>
                      Warranty Period
                    </label>
                    <Input
                      type='text'
                      placeholder='e.g., 12 months'
                      value={formData.warranty}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          warranty: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              )}
              {/* Step 2: Technical Proposal */}
              {currentStep === 2 && (
                <div className='space-y-6'>
                  <div>
                    <label className='block text-sm font-semibold text-gray-900 mb-3'>
                      Technical Proposal Documents *
                    </label>
                    <div
                      className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer'
                      onClick={() =>
                        document.getElementById('tech-upload')?.click()
                      }
                    >
                      <Upload className='h-8 w-8 text-gray-400 mx-auto mb-2' />
                      <p className='text-sm text-gray-600 mb-1'>
                        Upload technical documents
                      </p>
                      <p className='text-xs text-gray-500'>
                        PDF, DOC, XLS files accepted
                      </p>
                      <input
                        id='tech-upload'
                        type='file'
                        multiple
                        hidden
                        onChange={e =>
                          e.target.files &&
                          handleFileUpload('technical', e.target.files)
                        }
                      />
                    </div>
                    {formData.technicalDocuments.length > 0 && (
                      <ul className='mt-4 space-y-2'>
                        {formData.technicalDocuments.map((file, idx) => (
                          <li
                            key={idx}
                            className='flex items-center gap-2 p-2 bg-green-50 rounded'
                          >
                            <FileText className='h-4 w-4 text-green-600' />
                            <span className='text-sm text-green-900'>
                              {file.name}
                            </span>
                            <CheckCircle2 className='h-4 w-4 text-green-600 ml-auto' />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div>
                    <label className='block text-sm font-semibold text-gray-900 mb-2'>
                      Implementation Plan
                    </label>
                    <Textarea
                      placeholder='Describe your implementation approach...'
                      value={formData.technicalProposal}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          technicalProposal: e.target.value,
                        }))
                      }
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-semibold text-gray-900 mb-2'>
                      Quality Assurance Approach
                    </label>
                    <Textarea
                      placeholder='Describe your QA process...'
                      value={formData.qualityApproach}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          qualityApproach: e.target.value,
                        }))
                      }
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-semibold text-gray-900 mb-2'>
                      Risk Mitigation Strategy
                    </label>
                    <Textarea
                      placeholder='How will you mitigate project risks...'
                      value={formData.riskMitigation}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          riskMitigation: e.target.value,
                        }))
                      }
                      rows={3}
                    />
                  </div>
                </div>
              )}
              {/* Step 3: Financial Proposal */}
              {currentStep === 3 && (
                <div className='space-y-6'>
                  <div>
                    <label className='block text-sm font-semibold text-gray-900 mb-3'>
                      Financial Documents *
                    </label>
                    <div
                      className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer'
                      onClick={() =>
                        document.getElementById('fin-upload')?.click()
                      }
                    >
                      <Upload className='h-8 w-8 text-gray-400 mx-auto mb-2' />
                      <p className='text-sm text-gray-600 mb-1'>
                        Upload financial documents
                      </p>
                      <p className='text-xs text-gray-500'>
                        Invoices, cost breakdown, payment terms
                      </p>
                      <input
                        id='fin-upload'
                        type='file'
                        multiple
                        hidden
                        onChange={e =>
                          e.target.files &&
                          handleFileUpload('financial', e.target.files)
                        }
                      />
                    </div>
                    {formData.financialDocuments.length > 0 && (
                      <ul className='mt-4 space-y-2'>
                        {formData.financialDocuments.map((file, idx) => (
                          <li
                            key={idx}
                            className='flex items-center gap-2 p-2 bg-green-50 rounded'
                          >
                            <FileText className='h-4 w-4 text-green-600' />
                            <span className='text-sm text-green-900'>
                              {file.name}
                            </span>
                            <CheckCircle2 className='h-4 w-4 text-green-600 ml-auto' />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <Card className='p-4 bg-blue-50 border-blue-200'>
                    <p className='text-sm text-blue-900'>
                      <strong>Accepted Payment Terms:</strong> Net 30, Net 60,
                      Progressive Payment, or Upfront 30%
                    </p>
                  </Card>
                </div>
              )}
              {/* Step 4: Compliance Documents */}
              {currentStep === 4 && (
                <div className='space-y-6'>
                  <div>
                    <label className='block text-sm font-semibold text-gray-900 mb-3'>
                      Compliance Documents *
                    </label>
                    <div
                      className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer'
                      onClick={() =>
                        document.getElementById('comp-upload')?.click()
                      }
                    >
                      <Upload className='h-8 w-8 text-gray-400 mx-auto mb-2' />
                      <p className='text-sm text-gray-600 mb-1'>
                        Upload compliance documents
                      </p>
                      <p className='text-xs text-gray-500'>
                        Registration, tax clearance, insurance, certifications
                      </p>
                      <input
                        id='comp-upload'
                        type='file'
                        multiple
                        hidden
                        onChange={e =>
                          e.target.files &&
                          handleFileUpload('compliance', e.target.files)
                        }
                      />
                    </div>
                    {formData.complianceDocuments.length > 0 && (
                      <ul className='mt-4 space-y-2'>
                        {formData.complianceDocuments.map((file, idx) => (
                          <li
                            key={idx}
                            className='flex items-center gap-2 p-2 bg-green-50 rounded'
                          >
                            <FileText className='h-4 w-4 text-green-600' />
                            <span className='text-sm text-green-900'>
                              {file.name}
                            </span>
                            <CheckCircle2 className='h-4 w-4 text-green-600 ml-auto' />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <Card className='p-4 bg-amber-50 border-amber-200'>
                    <p className='text-sm text-amber-900'>
                      <strong>Required:</strong> Company registration, Tax
                      Clearance, Insurance, Industry certifications, Bank
                      references
                    </p>
                  </Card>
                </div>
              )}
              {/* Step 5: Review & Submit */}
              {currentStep === 5 && (
                <div className='space-y-6'>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                      Review Your Bid
                    </h3>
                    <div className='space-y-3 bg-gray-50 p-4 rounded-lg'>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Tender:</span>
                        <span className='font-semibold text-right max-w-xs truncate'>
                          {tender.title}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Reference:</span>
                        <span className='font-semibold'>
                          {tender.tender_number}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Quote Price:</span>
                        <span className='font-semibold'>
                          {formatCurrency(parseFloat(formData.quotePrice))}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>
                          Delivery Timeline:
                        </span>
                        <span className='font-semibold'>
                          {formData.deliveryTimeline} days
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Payment Terms:</span>
                        <span className='font-semibold capitalize'>
                          {formData.paymentTerms.replace('-', ' ')}
                        </span>
                      </div>
                      {formData.warranty && (
                        <div className='flex justify-between'>
                          <span className='text-gray-600'>Warranty:</span>
                          <span className='font-semibold'>
                            {formData.warranty}
                          </span>
                        </div>
                      )}
                      <div className='border-t border-gray-300 pt-3 flex justify-between'>
                        <span className='text-gray-600'>
                          Documents Attached:
                        </span>
                        <span className='font-semibold'>
                          {formData.technicalDocuments.length +
                            formData.financialDocuments.length +
                            formData.complianceDocuments.length}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-start gap-3'>
                    <input
                      type='checkbox'
                      id='terms'
                      checked={formData.termsAccepted}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          termsAccepted: e.target.checked,
                        }))
                      }
                      className='mt-1'
                    />
                    <label
                      htmlFor='terms'
                      className='text-sm text-gray-700 cursor-pointer'
                    >
                      I confirm that all information provided is accurate and
                      complete. I accept the tender terms and conditions.
                    </label>
                  </div>
                </div>
              )}
              {/* Navigation */}
              <div className='mt-8 flex justify-between'>
                <Button
                  variant='outline'
                  onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                <div className='flex gap-3 items-center'>
                  <span className='text-sm text-gray-600'>
                    Step {currentStep} of {totalSteps}
                  </span>
                  {currentStep < totalSteps ? (
                    <Button
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      disabled={!canProceedToNext}
                    >
                      Next
                      <ChevronRight className='h-4 w-4 ml-2' />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmitBid}
                      disabled={!formData.termsAccepted}
                      className='bg-green-600 hover:bg-green-700'
                    >
                      Submit Bid
                      <CheckCircle2 className='h-4 w-4 ml-2' />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
