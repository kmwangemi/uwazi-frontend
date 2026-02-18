'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockSuppliers, mockTenders } from '@/lib/mockData';
import { AlertCircle, ArrowLeft, CheckCircle, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function SupplierDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const supplier = mockSuppliers.find(s => s.id === Number(id));

  if (!supplier) {
    return (
      <div className='space-y-6'>
        <Button variant='outline' onClick={() => router.back()}>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back
        </Button>
        <div className='text-center py-12'>
          <h2 className='text-2xl font-bold text-gray-900'>
            Supplier not found
          </h2>
        </div>
      </div>
    );
  }

  const getVerificationColor = (status: string) => {
    const colors: Record<string, string> = {
      Verified: 'bg-green-100 text-green-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Rejected: 'bg-red-100 text-red-800',
      Flagged: 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const supplierTenders = mockTenders
    .filter(t => t.title.toLowerCase().includes(supplier.name.toLowerCase()))
    .slice(0, 5);

  return (
    <div className='space-y-6'>
      <Button variant='outline' size='sm' onClick={() => router.back()}>
        <ArrowLeft className='h-4 w-4 mr-2' />
        Back
      </Button>

      <div className='space-y-4'>
        <div className='flex items-start justify-between gap-4'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <h1 className='text-3xl font-bold text-gray-900'>
                {supplier.name}
              </h1>
              <Badge
                className={getVerificationColor(supplier.verification_status)}
              >
                {supplier.verification_status}
              </Badge>
            </div>
            <p className='text-gray-600'>{supplier.registration_number}</p>
          </div>
          <Button variant='outline' size='sm'>
            <Download className='h-4 w-4 mr-2' />
            Download Report
          </Button>
        </div>

        {supplier.verification_status === 'Flagged' && (
          <Alert className='border-orange-200 bg-orange-50'>
            <AlertCircle className='h-4 w-4 text-orange-600' />
            <AlertDescription className='text-orange-800'>
              This supplier has been flagged for additional verification. Review
              the analysis tab for details.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card className='p-4'>
          <p className='text-sm text-gray-600'>Location</p>
          <p className='text-lg font-semibold mt-2'>{supplier.county}</p>
        </Card>
        <Card className='p-4'>
          <p className='text-sm text-gray-600'>Year Registered</p>
          <p className='text-lg font-semibold mt-2'>
            {supplier.registered_year}
          </p>
        </Card>
        <Card className='p-4'>
          <p className='text-sm text-gray-600'>Completed Tenders</p>
          <p className='text-lg font-semibold mt-2'>
            {supplier.completed_tenders}
          </p>
        </Card>
        <Card className='p-4'>
          <p className='text-sm text-gray-600'>Total Won</p>
          <p className='text-lg font-semibold mt-2 text-green-600'>
            {supplier.total_contracts}
          </p>
        </Card>
      </div>

      <Card className='p-6'>
        <Tabs defaultValue='details' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='details'>Details</TabsTrigger>
            <TabsTrigger value='verification'>Verification</TabsTrigger>
            <TabsTrigger value='tenders'>Tenders</TabsTrigger>
            <TabsTrigger value='documents'>Documents</TabsTrigger>
          </TabsList>

          <TabsContent value='details' className='space-y-4'>
            <div className='grid grid-cols-2 gap-6'>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Registration Details
                </h3>
                <dl className='space-y-2 text-sm'>
                  <div>
                    <dt className='text-gray-600'>Registration Number</dt>
                    <dd className='font-medium text-gray-900'>
                      {supplier.registration_number}
                    </dd>
                  </div>
                  <div>
                    <dt className='text-gray-600'>Tax PIN</dt>
                    <dd className='font-medium text-gray-900'>
                      P000{supplier.id}24
                    </dd>
                  </div>
                  <div>
                    <dt className='text-gray-600'>Year Established</dt>
                    <dd className='font-medium text-gray-900'>
                      {supplier.registered_year}
                    </dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Contact Information
                </h3>
                <dl className='space-y-2 text-sm'>
                  <div>
                    <dt className='text-gray-600'>Address</dt>
                    <dd className='font-medium text-gray-900'>
                      123 Business Park, {supplier.county}
                    </dd>
                  </div>
                  <div>
                    <dt className='text-gray-600'>Email</dt>
                    <dd className='font-medium text-gray-900'>
                      info@{supplier.name.toLowerCase().replace(/\s/g, '')}.ke
                    </dd>
                  </div>
                  <div>
                    <dt className='text-gray-600'>Phone</dt>
                    <dd className='font-medium text-gray-900'>
                      +254 7XX XXX XXX
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='verification' className='space-y-4'>
            <div className='space-y-4'>
              <div className='flex items-start gap-3 p-3 bg-green-50 rounded-lg'>
                <CheckCircle className='h-5 w-5 text-green-600 shrink-0 mt-0.5' />
                <div>
                  <p className='font-medium text-green-900'>
                    Tax Compliance Verified
                  </p>
                  <p className='text-sm text-green-800'>
                    KRA registration confirmed and in good standing
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3 p-3 bg-blue-50 rounded-lg'>
                <CheckCircle className='h-5 w-5 text-blue-600 shrink-0 mt-0.5' />
                <div>
                  <p className='font-medium text-blue-900'>
                    Business Registration Verified
                  </p>
                  <p className='text-sm text-blue-800'>
                    BRELA registration verified as of {new Date().getFullYear()}
                  </p>
                </div>
              </div>
              {supplier.verification_status === 'Flagged' && (
                <div className='flex items-start gap-3 p-3 bg-orange-50 rounded-lg'>
                  <AlertCircle className='h-5 w-5 text-orange-600 shrink-0 mt-0.5' />
                  <div>
                    <p className='font-medium text-orange-900'>
                      Additional Review Required
                    </p>
                    <p className='text-sm text-orange-800'>
                      Pattern matching similar to flagged companies detected
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value='tenders' className='space-y-4'>
            <div className='space-y-2'>
              {supplierTenders.length > 0 ? (
                supplierTenders.map(tender => (
                  <div
                    key={tender.id}
                    className='border border-gray-200 rounded-lg p-3 hover:bg-gray-50'
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <p className='font-medium text-gray-900'>
                          {tender.title}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {tender.tender_number}
                        </p>
                      </div>
                      <Badge className='bg-blue-100 text-blue-800'>
                        {tender.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-gray-600 text-center py-4'>
                  No tender history found
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value='documents' className='space-y-4'>
            <div className='space-y-2'>
              <div className='border border-gray-200 rounded-md p-3 flex items-center justify-between hover:bg-gray-50'>
                <div className='text-sm'>
                  <p className='font-medium text-gray-900'>
                    Business Registration.pdf
                  </p>
                  <p className='text-gray-600'>1.2 MB • PDF</p>
                </div>
                <Button variant='ghost' size='sm'>
                  <Download className='h-4 w-4' />
                </Button>
              </div>
              <div className='border border-gray-200 rounded-md p-3 flex items-center justify-between hover:bg-gray-50'>
                <div className='text-sm'>
                  <p className='font-medium text-gray-900'>
                    Tax Compliance Certificate.pdf
                  </p>
                  <p className='text-gray-600'>0.8 MB • PDF</p>
                </div>
                <Button variant='ghost' size='sm'>
                  <Download className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
