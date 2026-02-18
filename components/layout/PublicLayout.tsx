'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ReactNode } from 'react';

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className='flex min-h-screen flex-col overflow-hidden bg-white'>
      {/* Header */}
      <header className='border-b border-gray-200 bg-white px-6 py-4'>
        <div className='mx-auto flex max-w-7xl items-center justify-between'>
          <Link href='/transparency' className='flex items-center gap-2'>
            <div className='text-xl font-bold text-primary'>PROCMON</div>
            <span className='text-sm text-gray-600'>Transparency Portal</span>
          </Link>
          <nav className='hidden gap-8 sm:flex'>
            <Link
              href='/transparency'
              className='text-sm font-medium text-gray-700 hover:text-primary'
            >
              Home
            </Link>
            <Link
              href='/tenders/available'
              className='text-sm font-medium text-gray-700 hover:text-primary'
            >
              Search Tenders
            </Link>
            <Link
              href='/whistleblower'
              className='text-sm font-medium text-gray-700 hover:text-primary'
            >
              Report Fraud
            </Link>
          </nav>
          <Link href='/login'>
            <Button size='sm'>Login to Dashboard</Button>
          </Link>
        </div>
      </header>
      {/* Main content */}
      <main className='flex-1 overflow-auto'>{children}</main>
      {/* Footer */}
      <footer className='border-t border-gray-200 bg-white px-6 py-8'>
        <div className='mx-auto max-w-7xl'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            <div>
              <h3 className='font-semibold text-gray-900'>About</h3>
              <p className='mt-2 text-sm text-gray-600'>
                Kenya's AI-Powered Procurement Monitoring System for fighting
                corruption.
              </p>
            </div>
            <div>
              <h3 className='font-semibold text-gray-900'>Resources</h3>
              <ul className='mt-2 space-y-2 text-sm'>
                <li>
                  <Link href='#' className='text-gray-600 hover:text-primary'>
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-gray-600 hover:text-primary'>
                    Guidelines
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-gray-600 hover:text-primary'>
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='font-semibold text-gray-900'>Contact</h3>
              <p className='mt-2 text-sm text-gray-600'>
                Email: info@procmon.ke
                <br />
                Phone: +254 (0) 20 2722 225
              </p>
            </div>
          </div>
          <div className='mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-600'>
            <p>
              &copy; 2024 Procurement Monitoring System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
