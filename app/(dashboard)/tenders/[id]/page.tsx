'use client';

import { RiskScoreMeter } from '@/components/shared/RiskScoreMeter';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFlagTender, useTender } from '@/hooks/queries/useTenders';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { ArrowLeft, Download, FileText, Flag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

export default function TenderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();

  const { data: tender, isLoading, isError } = useTender(id);
  const { mutate: flagTender, isPending: isFlagging } = useFlagTender();

  const handleFlag = () => {
    if (!tender) return;
    flagTender(
      { id: tender.id, reason: 'Manually flagged for review' },
      {
        onSuccess: () => toast.success('Tender flagged for review'),
        onError: () => toast.error('Failed to flag tender'),
      },
    );
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      published: 'bg-green-100 text-green-800',
      awarded: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return colors[status] ?? 'bg-gray-100 text-gray-800';
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    return bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(0)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <Button variant='outline' size='sm' onClick={() => router.back()}>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back
        </Button>
        <div className='text-center py-12 text-gray-500'>Loading tender...</div>
      </div>
    );
  }

  if (isError || !tender) {
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

  return (
    <div className='space-y-6'>
      {/* Header actions */}
      <div className='flex items-center justify-between'>
        <Button variant='outline' size='sm' onClick={() => router.back()}>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back
        </Button>
        <div className='flex gap-2'>
          <Button
            variant={tender.is_flagged ? 'default' : 'outline'}
            size='sm'
            onClick={handleFlag}
            disabled={isFlagging}
          >
            <Flag className='h-4 w-4 mr-2' />
            {tender.is_flagged ? 'Flagged' : 'Flag for Review'}
          </Button>
          <Button variant='outline' size='sm'>
            <Download className='h-4 w-4 mr-2' />
            Download
          </Button>
        </div>
      </div>
      {/* Title + amount */}
      <div className='space-y-4'>
        <div className='flex items-start justify-between gap-4'>
          <div className='space-y-2 flex-1'>
            <div className='flex items-center gap-2 flex-wrap'>
              <h1 className='text-3xl font-bold text-gray-900'>
                {tender.title}
              </h1>
              <Badge className={getStatusColor(tender.status)}>
                {tender.status}
              </Badge>
              {tender.is_flagged && (
                <Badge className='bg-red-100 text-red-800'>Flagged</Badge>
              )}
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
      {/* Summary cards */}
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
            {tender.deadline ? formatDate(new Date(tender.deadline)) : 'N/A'}
          </p>
        </Card>
        <Card className='p-4'>
          <p className='text-sm text-gray-600'>Procuring Entity</p>
          <p className='text-lg font-semibold mt-2 line-clamp-2'>
            {tender.entity_name} {/* ✅ was procuring_entity */}
          </p>
        </Card>
      </div>
      {/* Tabs */}
      <Card className='p-6'>
        <Tabs defaultValue='details' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='details'>Details</TabsTrigger>
            <TabsTrigger value='analysis'>Risk Analysis</TabsTrigger>
            <TabsTrigger value='documents'>
              Documents
              {tender.attachments?.length ? (
                <span className='ml-1.5 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full'>
                  {tender.attachments.length}
                </span>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value='history'>History</TabsTrigger>
          </TabsList>
          {/* Details tab */}
          <TabsContent value='details' className='space-y-4'>
            <div className='grid grid-cols-2 gap-6'>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Description
                </h3>
                <p className='text-gray-700'>
                  {tender.description || 'No description provided.'}
                </p>
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>Category</h3>
                <p className='text-gray-700 bg-gray-50 px-3 py-2 rounded-md inline-block'>
                  {tender.category || 'N/A'}
                </p>
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>County</h3>
                <p className='text-gray-700'>{tender.county || 'N/A'}</p>
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Procurement Method
                </h3>
                <p className='text-gray-700'>
                  {tender.procurement_method || 'N/A'}
                </p>
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Source of Funds
                </h3>
                <p className='text-gray-700'>
                  {tender.source_of_funds || 'N/A'}
                </p>
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Entity Type
                </h3>
                <p className='text-gray-700'>{tender.entity_type || 'N/A'}</p>
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Opening Date
                </h3>
                <p className='text-gray-700'>
                  {tender.opening_date
                    ? formatDate(new Date(tender.opening_date))
                    : 'N/A'}
                </p>
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Contact Email
                </h3>
                <p className='text-gray-700'>{tender.contact_email || 'N/A'}</p>
              </div>
              {tender.tender_security_form && (
                <div>
                  <h3 className='font-semibold text-gray-900 mb-2'>
                    Tender Security
                  </h3>
                  <p className='text-gray-700'>
                    {tender.tender_security_form}
                    {tender.tender_security_amount
                      ? ` — ${formatCurrency(tender.tender_security_amount)}`
                      : ''}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          {/* Risk Analysis tab */}
          <TabsContent value='analysis' className='space-y-4'>
            <div className='space-y-4'>
              <div className='flex items-center gap-4'>
                <div>
                  <p className='text-sm text-gray-600 mb-1'>Risk Score</p>
                  <RiskScoreMeter score={tender.risk_score} />
                </div>
                {tender.risk_level && (
                  <div>
                    <p className='text-sm text-gray-600 mb-1'>Risk Level</p>
                    <Badge
                      className={
                        tender.risk_level === 'CRITICAL'
                          ? 'bg-red-100 text-red-800'
                          : tender.risk_level === 'HIGH'
                            ? 'bg-orange-100 text-orange-800'
                            : tender.risk_level === 'MEDIUM'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                      }
                    >
                      {tender.risk_level}
                    </Badge>
                  </div>
                )}
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
          {/* Documents tab */}
          <TabsContent value='documents' className='space-y-4'>
            {tender.attachments && tender.attachments.length > 0 ? (
              <ul className='space-y-2'>
                {tender.attachments.map((attachment, idx) => (
                  <li
                    key={idx}
                    className='border border-gray-200 rounded-md p-3 flex items-center justify-between hover:bg-gray-50'
                  >
                    <div className='flex items-center gap-3'>
                      <FileText className='h-4 w-4 text-gray-400 shrink-0' />
                      <div className='text-sm'>
                        <p className='font-medium text-gray-900'>
                          {attachment.file_name}
                        </p>
                        <p className='text-gray-500'>
                          {formatFileSize(attachment.size)}
                          {attachment.file_type
                            ? ` • ${attachment.file_type}`
                            : ''}
                        </p>
                      </div>
                    </div>
                    <Button variant='ghost' size='sm' asChild>
                      <a
                        href={attachment.url}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <Download className='h-4 w-4' />
                      </a>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-gray-500 text-sm'>
                No documents attached to this tender.
              </p>
            )}
          </TabsContent>
          {/* History tab */}
          <TabsContent value='history' className='space-y-4'>
            <div className='space-y-3'>
              <div className='border-l-2 border-blue-500 pl-4 py-2'>
                <p className='font-medium text-gray-900'>Tender Posted</p>
                <p className='text-sm text-gray-600'>
                  {formatDate(new Date(tender.created_at))}
                </p>
              </div>
              <div className='border-l-2 border-gray-300 pl-4 py-2'>
                <p className='font-medium text-gray-900'>Last Updated</p>
                <p className='text-sm text-gray-600'>
                  {formatDate(new Date(tender.updated_at))}
                </p>
              </div>
              {tender.is_flagged && (
                <div className='border-l-2 border-red-400 pl-4 py-2'>
                  <p className='font-medium text-gray-900'>
                    Flagged for Review
                  </p>
                  <p className='text-sm text-gray-600'>Manually flagged</p>
                </div>
              )}
              {tender.award_date && (
                <div className='border-l-2 border-green-500 pl-4 py-2'>
                  <p className='font-medium text-gray-900'>Tender Awarded</p>
                  <p className='text-sm text-gray-600'>
                    {formatDate(new Date(tender.award_date))}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
