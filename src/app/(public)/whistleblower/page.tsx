'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  type WhistleblowerSchema,
  whistleblowerSchema,
} from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, Lock, Shield } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function WhistleblowerPage() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WhistleblowerSchema>({
    resolver: zodResolver(whistleblowerSchema),
  });

  const onSubmit = async (data: WhistleblowerSchema) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Whistleblower report:', data);
      setSubmitted(true);
      // Reset form after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };
  if (submitted) {
    return (
      <div className='min-h-screen pt-8 pb-16'>
        <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
          <Card className='bg-slate-800 border-slate-700 p-8'>
            <div className='text-center'>
              <CheckCircle2 className='h-16 w-16 text-green-500 mx-auto mb-4' />
              <h1 className='text-3xl font-bold text-white mb-4'>
                Report Submitted
              </h1>
              <p className='text-slate-300 mb-6'>
                Thank you for your submission. Your report has been received and
                will be reviewed by our team.
                <br />
                <br />
                You will receive a reference number via your preferred contact
                method.
              </p>
              <p className='text-sm text-slate-400'>
                Your identity is protected. We maintain strict confidentiality
                for all whistleblower reports.
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <div className='min-h-screen pt-8 pb-16'>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Hero Section */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-white mb-4'>
            Report Corruption
          </h1>
          <p className='text-xl text-slate-300'>
            Safely and confidentially report procurement fraud, corruption, or
            other unethical practices.
          </p>
        </div>
        {/* Info Boxes */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
          <Card className='bg-blue-900/20 border-blue-700/50 p-6'>
            <div className='flex gap-4'>
              <Shield className='h-6 w-6 text-blue-400 shrink-0 mt-1' />
              <div>
                <h3 className='font-semibold text-white mb-2'>Protected</h3>
                <p className='text-slate-300 text-sm'>
                  Your identity is fully protected. We maintain strict
                  confidentiality.
                </p>
              </div>
            </div>
          </Card>
          <Card className='bg-green-900/20 border-green-700/50 p-6'>
            <div className='flex gap-4'>
              <Lock className='h-6 w-6 text-green-400 shrink-0 mt-1' />
              <div>
                <h3 className='font-semibold text-white mb-2'>Secure</h3>
                <p className='text-slate-300 text-sm'>
                  All communications are encrypted and stored securely.
                </p>
              </div>
            </div>
          </Card>
        </div>
        {/* Form Card */}
        <Card className='bg-slate-800 border-slate-700 p-8'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Issue Type */}
            <div className='space-y-2'>
              <label
                htmlFor='type'
                className='block text-sm font-medium text-white'
              >
                Type of Issue *
              </label>
              <select
                {...register('submission_type')}
                className='w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value=''>Select an issue type</option>
                <option value='TENDER_ISSUE'>Tender Irregularity</option>
                <option value='SUPPLIER_ISSUE'>Supplier Fraud</option>
                <option value='GENERAL_CORRUPTION'>General Corruption</option>
              </select>
              {errors.submission_type && (
                <p className='text-sm text-red-400'>
                  {errors.submission_type.message}
                </p>
              )}
            </div>
            {/* Title */}
            <div className='space-y-2'>
              <label
                htmlFor='title'
                className='block text-sm font-medium text-white'
              >
                Report Title *
              </label>
              <Input
                {...register('title')}
                placeholder='Brief summary of the issue'
                className='bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
              />
              {errors.title && (
                <p className='text-sm text-red-400'>{errors.title.message}</p>
              )}
            </div>
            {/* Description */}
            <div className='space-y-2'>
              <label
                htmlFor='description'
                className='block text-sm font-medium text-white'
              >
                Detailed Description *
              </label>
              <textarea
                {...register('description')}
                placeholder='Provide detailed information about the issue'
                rows={6}
                className='w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              {errors.description && (
                <p className='text-sm text-red-400'>
                  {errors.description.message}
                </p>
              )}
            </div>
            {/* Location */}
            <div className='space-y-2'>
              <label
                htmlFor='location'
                className='block text-sm font-medium text-white'
              >
                Location/County
              </label>
              <Input
                {...register('location')}
                placeholder='Where did this issue occur?'
                className='bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
              />
            </div>
            {/* Contact Preference */}
            <fieldset className='space-y-3'>
              <legend className='block text-sm font-medium text-white'>
                Preferred Contact Method *
              </legend>
              <div className='space-y-2'>
                {['EMAIL', 'PHONE', 'ANONYMOUS'].map(method => (
                  <label
                    key={method}
                    className='flex items-center gap-2 cursor-pointer'
                  >
                    <input
                      type='radio'
                      {...register('contact_preference')}
                      value={method}
                      className='w-4 h-4 accent-blue-600'
                    />
                    <span className='text-slate-300'>
                      {method === 'EMAIL' && 'Email Contact'}
                      {method === 'PHONE' && 'Phone Contact'}
                      {method === 'ANONYMOUS' && 'Remain Anonymous'}
                    </span>
                  </label>
                ))}
              </div>
              {errors.contact_preference && (
                <p className='text-sm text-red-400'>
                  {errors.contact_preference.message}
                </p>
              )}
            </fieldset>
            {/* Contact Info */}
            <div className='space-y-2'>
              <label
                htmlFor='contact_info'
                className='block text-sm font-medium text-white'
              >
                Email or Phone Number
              </label>
              <Input
                {...register('contact_info')}
                placeholder='Your contact information (if not anonymous)'
                className='bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
              />
            </div>
            {/* Disclaimer */}
            <Alert className='bg-yellow-900/20 border-yellow-700/50'>
              <AlertCircle className='h-4 w-4 text-yellow-600' />
              <AlertDescription className='text-yellow-800'>
                False reports may result in legal consequences. Please ensure
                all information is accurate and truthful.
              </AlertDescription>
            </Alert>
            {/* Submit Button */}
            <Button
              type='submit'
              disabled={isSubmitting}
              className='w-full bg-blue-600 hover:bg-blue-700 text-white'
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </form>
        </Card>
        {/* FAQ */}
        <div className='mt-12'>
          <h2 className='text-2xl font-bold text-white mb-6'>
            Frequently Asked Questions
          </h2>
          <div className='space-y-4'>
            {[
              {
                q: 'How long does it take to receive a response?',
                a: 'Most reports are reviewed within 5-10 business days. Complex cases may take longer.',
              },
              {
                q: 'Can I remain anonymous?',
                a: 'Yes, you can submit reports anonymously. We protect whistleblower identities.',
              },
              {
                q: 'What happens to my report?',
                a: 'Your report is reviewed by our investigation team and may be forwarded to relevant authorities.',
              },
            ].map(item => (
              <Card key={item.q} className='bg-slate-800 border-slate-700 p-6'>
                <h3 className='font-semibold text-white mb-2'>{item.q}</h3>
                <p className='text-slate-300'>{item.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
