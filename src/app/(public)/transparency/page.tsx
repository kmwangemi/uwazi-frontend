'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Filter, Search } from 'lucide-react';
import { useState } from 'react';

export default function TransparencyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <div className='min-h-screen pt-8 pb-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Hero Section */}
        <div className='mb-12'>
          <h1 className='text-4xl font-bold text-white mb-4'>
            Public Procurement Data
          </h1>
          <p className='text-xl text-slate-300 max-w-2xl'>
            Access and explore publicly available procurement data from Kenya's
            government entities. All data is verified and updated regularly.
          </p>
        </div>
        {/* Search and Filter Section */}
        <Card className='bg-slate-800 border-slate-700 p-6 mb-8'>
          <div className='space-y-4'>
            {/* Search Bar */}
            <div className='relative'>
              <Search className='absolute left-3 top-3 h-5 w-5 text-slate-400' />
              <input
                type='text'
                placeholder='Search tenders, suppliers, or entities...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            {/* Filters */}
            <div className='flex flex-wrap gap-2'>
              <Button
                variant='outline'
                className='border-slate-600 text-slate-300 bg-transparent'
              >
                <Filter className='mr-2 h-4 w-4' />
                All Categories
              </Button>
              <Button
                variant='outline'
                className='border-slate-600 text-slate-300 bg-transparent'
              >
                All Counties
              </Button>
              <Button
                variant='outline'
                className='border-slate-600 text-slate-300 bg-transparent'
              >
                All Years
              </Button>
            </div>
          </div>
        </Card>
        {/* Statistics */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-12'>
          <Card className='bg-slate-800 border-slate-700 p-6'>
            <p className='text-slate-400 text-sm'>Total Tenders</p>
            <p className='text-3xl font-bold text-white mt-2'>15,234</p>
          </Card>
          <Card className='bg-slate-800 border-slate-700 p-6'>
            <p className='text-slate-400 text-sm'>Total Value</p>
            <p className='text-3xl font-bold text-white mt-2'>KSh 2.1T</p>
          </Card>
          <Card className='bg-slate-800 border-slate-700 p-6'>
            <p className='text-slate-400 text-sm'>Registered Suppliers</p>
            <p className='text-3xl font-bold text-white mt-2'>8,456</p>
          </Card>
          <Card className='bg-slate-800 border-slate-700 p-6'>
            <p className='text-slate-400 text-sm'>Government Entities</p>
            <p className='text-3xl font-bold text-white mt-2'>187</p>
          </Card>
        </div>
        {/* Tenders List */}
        <div>
          <h2 className='text-2xl font-bold text-white mb-4'>Recent Tenders</h2>
          <div className='space-y-4'>
            {/* Sample Tender Items */}
            {[1, 2, 3, 4, 5].map(i => (
              <Card
                key={i}
                className='bg-slate-800 border-slate-700 p-6 hover:border-slate-600 transition-colors cursor-pointer'
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <h3 className='font-semibold text-white mb-2'>
                      Supply and Installation of ICT Equipment - Tender #
                      {i.toString().padStart(4, '0')}
                    </h3>
                    <p className='text-slate-400 text-sm mb-3'>
                      Ministry of Education
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      <span className='text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded'>
                        Nairobi
                      </span>
                      <span className='text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded'>
                        Goods
                      </span>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-lg font-semibold text-white'>
                      KSh {(i * 5000000).toLocaleString()}
                    </p>
                    <p className='text-xs text-slate-400 mt-1'>
                      Published 2 weeks ago
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className='mt-8 flex justify-center'>
            <Button className='bg-blue-600 hover:bg-blue-700'>
              View All Tenders
            </Button>
          </div>
        </div>
        {/* Info Section */}
        <div className='mt-16 grid grid-cols-1 md:grid-cols-2 gap-8'>
          <Card className='bg-slate-800 border-slate-700 p-8'>
            <h3 className='text-xl font-bold text-white mb-4'>
              About This Data
            </h3>
            <p className='text-slate-300 mb-4'>
              This platform provides real-time access to procurement data from
              government entities across Kenya. All information is collected
              from official sources and updated daily.
            </p>
            <ul className='space-y-2 text-slate-400 text-sm'>
              <li>✓ Real-time data updates</li>
              <li>✓ Verified information from official sources</li>
              <li>✓ Data available for 47 counties</li>
              <li>✓ Historical data spanning 5+ years</li>
            </ul>
          </Card>
          <Card className='bg-slate-800 border-slate-700 p-8'>
            <h3 className='text-xl font-bold text-white mb-4'>Download Data</h3>
            <p className='text-slate-300 mb-4'>
              Export procurement data in various formats for analysis and
              research.
            </p>
            <div className='space-y-3'>
              <Button className='w-full bg-blue-600 hover:bg-blue-700'>
                <Download className='mr-2 h-4 w-4' />
                Download CSV
              </Button>
              <Button className='w-full bg-blue-600 hover:bg-blue-700'>
                <Download className='mr-2 h-4 w-4' />
                Download Excel
              </Button>
              <Button className='w-full bg-blue-600 hover:bg-blue-700'>
                <Download className='mr-2 h-4 w-4' />
                Download JSON
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
