'use client';

import { RiskScoreMeter } from '@/components/shared/RiskScoreMeter';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { mockTenders } from '@/lib/mockData';
import { ArrowLeft, Download, Flag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function TenderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const tender = mockTenders.find(t => t.id === Number(id));
  const [flagged, setFlagged] = useState(false);
  if (!tender) {
    return (
      <div className='space-y-6'>
        <Button variant='outline' onClick={() => router.back()}>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back
        </Button>
        <div className='text-center py-12'>
          <h2 className='text-2xl font-bold text-gray-900'>Tender not found</h2>
        </div>
      </div>
    );
  }
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Open: 'bg-green-100 text-green-800',
      Closed: 'bg-gray-100 text-gray-800',
      Awarded: 'bg-blue-100 text-blue-800',
      'Under Review': 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <Button variant='outline' size='sm' onClick={() => router.back()}>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back
        </Button>
        <div className='flex gap-2'>
          <Button
            variant={flagged ? 'default' : 'outline'}
            size='sm'
            onClick={() => setFlagged(!flagged)}
          >
            <Flag className='h-4 w-4 mr-2' />
            {flagged ? 'Flagged' : 'Flag for Review'}
          </Button>
          <Button variant='outline' size='sm'>
            <Download className='h-4 w-4 mr-2' />
            Download
          </Button>
        </div>
      </div>
      <div className='space-y-4'>
        <div className='flex items-start justify-between gap-4'>
          <div className='space-y-2 flex-1'>
            <div className='flex items-center gap-2'>
              <h1 className='text-3xl font-bold text-gray-900'>
                {tender.title}
              </h1>
              <Badge className={getStatusColor(tender.status)}>
                {tender.status}
              </Badge>
            </div>
            <p className='text-gray-600'>{tender.tender_number}</p>
          </div>
          <div className='text-right'>
            <p className='text-3xl font-bold text-gray-900'>
              {formatCurrency(tender.amount)}
            </p>
            <p className='text-gray-600'>Budgeted Amount</p>
          </div>
        </div>
        {tender.risk_score >= 70 && (
          <Alert className='border-red-200 bg-red-50'>
            <Flag className='h-4 w-4 text-red-600' />
            <AlertDescription className='text-red-800'>
              This tender has a high corruption risk score ({tender.risk_score}
              ). Additional scrutiny recommended.
            </AlertDescription>
          </Alert>
        )}
      </div>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card className='p-4'>
          <p className='text-sm text-gray-600'>Corruption Risk</p>
          <div className='mt-2'>
            <RiskScoreMeter score={tender.risk_score} />
          </div>
        </Card>
        <Card className='p-4'>
          <p className='text-sm text-gray-600'>Posted Date</p>
          <p className='text-lg font-semibold mt-2'>
            {formatDate(new Date(tender.created_at))}
          </p>
        </Card>
        <Card className='p-4'>
          <p className='text-sm text-gray-600'>Deadline</p>
          <p className='text-lg font-semibold mt-2'>
            {tender.submission_deadline
              ? formatDate(new Date(tender.submission_deadline))
              : 'N/A'}
          </p>
        </Card>
        <Card className='p-4'>
          <p className='text-sm text-gray-600'>Procuring Entity</p>
          <p className='text-lg font-semibold mt-2 line-clamp-2'>
            {tender.procuring_entity}
          </p>
        </Card>
      </div>
      <Card className='p-6'>
        <Tabs defaultValue='details' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='details'>Details</TabsTrigger>
            <TabsTrigger value='analysis'>Risk Analysis</TabsTrigger>
            <TabsTrigger value='documents'>Documents</TabsTrigger>
            <TabsTrigger value='history'>History</TabsTrigger>
          </TabsList>
          <TabsContent value='details' className='space-y-4'>
            <div className='grid grid-cols-2 gap-6'>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Description
                </h3>
                <p className='text-gray-700'>{tender.description}</p>
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>Category</h3>
                <p className='text-gray-700 bg-gray-50 px-3 py-2 rounded-md inline-block'>
                  {tender.category}
                </p>
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>County</h3>
                <p className='text-gray-700'>{tender.county}</p>
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Tender Type
                </h3>
                <p className='text-gray-700'>{tender.tender_type}</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value='analysis' className='space-y-4'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <h3 className='font-semibold text-gray-900'>
                  Red Flags Detected
                </h3>
                <ul className='space-y-2'>
                  {tender.corruption_flags &&
                  tender.corruption_flags.length > 0 ? (
                    tender.corruption_flags.map((flag, idx) => (
                      <li key={idx} className='flex items-start gap-2 text-sm'>
                        <span className='text-red-600 mt-1'>•</span>
                        <span className='text-gray-700'>
                          {flag.description}
                        </span>
                      </li>
                    ))
                  ) : (
                    <p className='text-gray-600'>No major red flags detected</p>
                  )}
                </ul>
              </div>
              <div className='space-y-2'>
                <h3 className='font-semibold text-gray-900'>Risk Factors</h3>
                <ul className='space-y-2'>
                  <li className='text-sm text-gray-700'>
                    • Budget significantly higher than similar tenders
                  </li>
                  <li className='text-sm text-gray-700'>
                    • Short deadline for submissions
                  </li>
                  <li className='text-sm text-gray-700'>
                    • Limited number of potential bidders
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
          <TabsContent value='documents' className='space-y-4'>
            <div className='space-y-2'>
              <div className='border border-gray-200 rounded-md p-3 flex items-center justify-between hover:bg-gray-50'>
                <div className='text-sm'>
                  <p className='font-medium text-gray-900'>
                    Tender Document.pdf
                  </p>
                  <p className='text-gray-600'>5.2 MB • PDF</p>
                </div>
                <Button variant='ghost' size='sm'>
                  <Download className='h-4 w-4' />
                </Button>
              </div>
              <div className='border border-gray-200 rounded-md p-3 flex items-center justify-between hover:bg-gray-50'>
                <div className='text-sm'>
                  <p className='font-medium text-gray-900'>
                    Specifications.xlsx
                  </p>
                  <p className='text-gray-600'>2.1 MB • Excel</p>
                </div>
                <Button variant='ghost' size='sm'>
                  <Download className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value='history' className='space-y-4'>
            <div className='space-y-3'>
              <div className='border-l-2 border-blue-500 pl-4 py-2'>
                <p className='font-medium text-gray-900'>Tender Posted</p>
                <p className='text-sm text-gray-600'>
                  {formatDate(new Date(tender.created_at))}
                </p>
              </div>
              <div className='border-l-2 border-gray-300 pl-4 py-2'>
                <p className='font-medium text-gray-900'>
                  Status Updated to: Under Review
                </p>
                <p className='text-sm text-gray-600'>2 hours ago</p>
              </div>
              <div className='border-l-2 border-gray-300 pl-4 py-2'>
                <p className='font-medium text-gray-900'>
                  Risk Assessment Completed
                </p>
                <p className='text-sm text-gray-600'>1 day ago</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
