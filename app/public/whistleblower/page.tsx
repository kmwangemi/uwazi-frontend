'use client';

import { WhistleblowerForm } from '@/components/forms/WhistleblowerForm';
import { Card } from '@/components/ui/card';
import { Lock, Shield } from 'lucide-react';

export default function PublicWhistleblowerPage() {
  return (
    <div className='min-h-screen bg-[#0a0c0f] py-12 px-4'>
      <div className='max-w-2xl mx-auto space-y-8'>
        {/* Header */}
        <div className='text-center space-y-3'>
          <div className='flex justify-center'>
            <Lock className='w-12 h-12 text-[#00ff88]' />
          </div>
          <div>
            <h1 className='text-4xl font-bold text-white'>
              Anonymous Whistleblower Portal
            </h1>
            <p className='text-[#94a3b8] mt-2'>
              Report corruption and procurement fraud safely and anonymously
            </p>
          </div>
        </div>
        {/* Privacy Notice */}
        <Card className='bg-[#121418] border border-[#00ff88]/30 p-6'>
          <div className='flex gap-4'>
            <Shield className='w-5 h-5 text-[#00ff88] shrink-0 mt-0.5' />
            <div className='text-sm'>
              <p className='font-semibold text-white mb-1'>
                Your Identity is Never Recorded
              </p>
              <p className='text-[#94a3b8]'>
                We do not collect, store, or track any personally identifiable
                information. Your anonymity is protected by design. No login
                required - report anonymously right now.
              </p>
            </div>
          </div>
        </Card>
        {/* Form Card */}
        <Card className='bg-[#121418] border-[#1f2937] p-8'>
          <WhistleblowerForm isPublic={true} />
        </Card>
        {/* Footer Info */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Card className='bg-[#1a1d23] border-[#1f2937] p-4'>
            <div className='text-xs text-[#94a3b8] mb-2 font-semibold uppercase'>
              No Registration
            </div>
            <p className='text-sm text-white'>
              Report anonymously without creating an account
            </p>
          </Card>
          <Card className='bg-[#1a1d23] border-[#1f2937] p-4'>
            <div className='text-xs text-[#94a3b8] mb-2 font-semibold uppercase'>
              Encrypted
            </div>
            <p className='text-sm text-white'>
              All communications are encrypted end-to-end
            </p>
          </Card>
          <Card className='bg-[#1a1d23] border-[#1f2937] p-4'>
            <div className='text-xs text-[#94a3b8] mb-2 font-semibold uppercase'>
              Protected
            </div>
            <p className='text-sm text-white'>
              Whistleblower protection laws apply
            </p>
          </Card>
        </div>
        {/* Important Info */}
        <Card className='bg-[#1a1d23] border-[#1f2937] p-6'>
          <h3 className='text-white font-semibold mb-3'>What Happens Next?</h3>
          <ol className='space-y-2 text-sm text-[#94a3b8]'>
            <li className='flex gap-3'>
              <span className='font-bold text-[#00ff88]'>1.</span>
              <span>
                Your report is received and automatically assessed for
                credibility
              </span>
            </li>
            <li className='flex gap-3'>
              <span className='font-bold text-[#00ff88]'>2.</span>
              <span>An investigator reviews your report within 24 hours</span>
            </li>
            <li className='flex gap-3'>
              <span className='font-bold text-[#00ff88]'>3.</span>
              <span>
                If credible, an investigation is initiated immediately
              </span>
            </li>
            <li className='flex gap-3'>
              <span className='font-bold text-[#00ff88]'>4.</span>
              <span>
                You may be contacted via your preferred method (if provided)
              </span>
            </li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
