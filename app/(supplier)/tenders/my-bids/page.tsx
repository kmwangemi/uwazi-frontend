'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, formatDate } from '@/lib/formatters';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  TrendingUp,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Mock supplier bids data
const mockSupplierBids = [
  {
    id: 'BID001',
    tenderId: 1,
    tenderTitle: 'Road Construction - Nairobi-Nakuru Highway',
    tenderReference: 'TND/2024/001',
    bidAmount: 45000000,
    status: 'Awarded',
    submittedDate: '2024-02-10',
    deadline: '2024-03-15',
    totalScore: 87,
    recommendation: 'Approved',
    paymentTerms: 'Net 60',
    deliveryTimeline: 120,
    feedback: 'Strong technical proposal and competitive pricing',
  },
  {
    id: 'BID002',
    tenderId: 2,
    tenderTitle: 'School Desks and Chairs Supply',
    tenderReference: 'TND/2024/002',
    bidAmount: 2500000,
    status: 'Under Evaluation',
    submittedDate: '2024-02-12',
    deadline: '2024-03-20',
    totalScore: null,
    recommendation: null,
    paymentTerms: 'Net 30',
    deliveryTimeline: 45,
    feedback: null,
  },
  {
    id: 'BID003',
    tenderId: 3,
    tenderTitle: 'IT Equipment - Laptops & Servers',
    tenderReference: 'TND/2024/003',
    bidAmount: 8500000,
    status: 'Shortlisted',
    submittedDate: '2024-02-08',
    deadline: '2024-03-18',
    totalScore: null,
    recommendation: null,
    paymentTerms: 'Progressive',
    deliveryTimeline: 60,
    feedback: 'Awaiting final evaluation round',
  },
  {
    id: 'BID004',
    tenderId: 4,
    tenderTitle: 'Medical Supplies - Hospital Equipment',
    tenderReference: 'TND/2024/004',
    bidAmount: 12000000,
    status: 'Not Selected',
    submittedDate: '2024-01-25',
    deadline: '2024-02-28',
    totalScore: 62,
    recommendation: 'Rejected',
    paymentTerms: 'Net 30',
    deliveryTimeline: 90,
    feedback:
      'Price significantly above budget. Recommend cost reduction strategy.',
  },
  {
    id: 'BID005',
    tenderId: 5,
    tenderTitle: 'Vehicle Maintenance Services',
    tenderReference: 'TND/2024/005',
    bidAmount: 5500000,
    status: 'Submitted',
    submittedDate: '2024-02-14',
    deadline: '2024-03-10',
    totalScore: null,
    recommendation: null,
    paymentTerms: 'Monthly',
    deliveryTimeline: 365,
    feedback: null,
  },
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Awarded: 'bg-green-100 text-green-800',
    'Under Evaluation': 'bg-blue-100 text-blue-800',
    Shortlisted: 'bg-purple-100 text-purple-800',
    Submitted: 'bg-gray-100 text-gray-800',
    'Not Selected': 'bg-red-100 text-red-800',
    'Tender Closed': 'bg-gray-400 text-white',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Awarded':
      return <CheckCircle className='h-5 w-5 text-green-600' />;
    case 'Under Evaluation':
      return <Clock className='h-5 w-5 text-blue-600' />;
    case 'Shortlisted':
      return <TrendingUp className='h-5 w-5 text-purple-600' />;
    case 'Not Selected':
      return <X className='h-5 w-5 text-red-600' />;
    default:
      return <AlertCircle className='h-5 w-5 text-gray-600' />;
  }
};

export default function MyBidsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');

  const filteredBids =
    activeTab === 'all'
      ? mockSupplierBids
      : mockSupplierBids.filter(b => {
          if (activeTab === 'active')
            return ['Submitted', 'Under Evaluation', 'Shortlisted'].includes(
              b.status,
            );
          if (activeTab === 'won') return b.status === 'Awarded';
          if (activeTab === 'rejected') return b.status === 'Not Selected';
          return true;
        });

  return (
    <div className='min-h-screen bg-background py-8 px-4'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>My Bids</h1>
          <p className='text-gray-600'>
            Track the status of all your submitted bids
          </p>
        </div>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
          <Card className='p-4'>
            <p className='text-sm text-gray-600 mb-1'>Total Bids</p>
            <p className='text-3xl font-bold text-gray-900'>
              {mockSupplierBids.length}
            </p>
          </Card>
          <Card className='p-4'>
            <p className='text-sm text-gray-600 mb-1'>Active Bids</p>
            <p className='text-3xl font-bold text-blue-600'>
              {
                mockSupplierBids.filter(b =>
                  ['Submitted', 'Under Evaluation', 'Shortlisted'].includes(
                    b.status,
                  ),
                ).length
              }
            </p>
          </Card>
          <Card className='p-4'>
            <p className='text-sm text-gray-600 mb-1'>Won</p>
            <p className='text-3xl font-bold text-green-600'>
              {mockSupplierBids.filter(b => b.status === 'Awarded').length}
            </p>
          </Card>
          <Card className='p-4'>
            <p className='text-sm text-gray-600 mb-1'>Total Bid Value</p>
            <p className='text-2xl font-bold text-primary'>
              {formatCurrency(
                mockSupplierBids.reduce((sum, b) => sum + b.bidAmount, 0),
              )}
            </p>
          </Card>
        </div>
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className='mb-8'>
          <TabsList>
            <TabsTrigger value='all'>
              All Bids ({mockSupplierBids.length})
            </TabsTrigger>
            <TabsTrigger value='active'>
              Active (
              {
                mockSupplierBids.filter(b =>
                  ['Submitted', 'Under Evaluation', 'Shortlisted'].includes(
                    b.status,
                  ),
                ).length
              }
              )
            </TabsTrigger>
            <TabsTrigger value='won'>
              Won ({mockSupplierBids.filter(b => b.status === 'Awarded').length}
              )
            </TabsTrigger>
            <TabsTrigger value='rejected'>
              Not Selected (
              {mockSupplierBids.filter(b => b.status === 'Not Selected').length}
              )
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {/* Bid Cards Grid */}
        <div className='space-y-4'>
          {filteredBids.map(bid => (
            <Card
              key={bid.id}
              className='p-6 hover:shadow-md transition-shadow'
            >
              <div className='flex items-start justify-between gap-4'>
                {/* Left: Bid Info */}
                <div className='flex-1'>
                  <div className='flex items-center gap-3 mb-2'>
                    {getStatusIcon(bid.status)}
                    <Badge className={getStatusColor(bid.status)}>
                      {bid.status}
                    </Badge>
                  </div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                    {bid.tenderTitle}
                  </h3>
                  <p className='text-sm text-gray-600 mb-3'>
                    Ref: {bid.tenderReference}
                  </p>
                  {/* Status Timeline */}
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                    <div>
                      <p className='text-gray-600'>Bid Amount</p>
                      <p className='font-semibold text-gray-900'>
                        {formatCurrency(bid.bidAmount)}
                      </p>
                    </div>
                    <div>
                      <p className='text-gray-600'>Submitted</p>
                      <p className='font-semibold text-gray-900'>
                        {formatDate(new Date(bid.submittedDate))}
                      </p>
                    </div>
                    <div>
                      <p className='text-gray-600'>Deadline</p>
                      <p className='font-semibold text-gray-900'>
                        {formatDate(new Date(bid.deadline))}
                      </p>
                    </div>
                    <div>
                      <p className='text-gray-600'>Delivery Timeline</p>
                      <p className='font-semibold text-gray-900'>
                        {bid.deliveryTimeline} days
                      </p>
                    </div>
                  </div>
                  {/* Feedback / Next Steps */}
                  {bid.feedback && (
                    <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                      <p className='text-xs text-blue-600 font-semibold mb-1'>
                        Evaluator Feedback
                      </p>
                      <p className='text-sm text-blue-900'>{bid.feedback}</p>
                    </div>
                  )}
                  {bid.status === 'Awarded' && (
                    <div className='mt-4 p-3 bg-green-50 border border-green-200 rounded-lg'>
                      <p className='text-xs text-green-600 font-semibold mb-1'>
                        Congratulations!
                      </p>
                      <p className='text-sm text-green-900'>
                        Your bid has been awarded. Contract documents are ready
                        for signing.
                      </p>
                    </div>
                  )}
                  {bid.status === 'Shortlisted' && (
                    <div className='mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg'>
                      <p className='text-xs text-purple-600 font-semibold mb-1'>
                        Next Step
                      </p>
                      <p className='text-sm text-purple-900'>
                        Your bid made it to the shortlist. Awaiting final
                        evaluation round.
                      </p>
                    </div>
                  )}
                </div>
                {/* Right: Actions */}
                <div className='flex flex-col gap-2 ml-4'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => router.push(`/tenders/${bid.tenderId}`)}
                  >
                    <Eye className='h-4 w-4 mr-2' />
                    View Tender
                  </Button>
                  {bid.status === 'Awarded' && (
                    <Button
                      size='sm'
                      className='bg-green-600 hover:bg-green-700'
                    >
                      <Download className='h-4 w-4 mr-2' />
                      View Contract
                    </Button>
                  )}
                  {bid.totalScore !== null && (
                    <div className='text-center py-2'>
                      <p className='text-xs text-gray-600'>Score</p>
                      <p className='text-lg font-bold text-primary'>
                        {bid.totalScore}/100
                      </p>
                    </div>
                  )}
                  <Button variant='ghost' size='sm'>
                    Details →
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {filteredBids.length === 0 && (
            <Card className='p-12 text-center'>
              <AlertCircle className='h-12 w-12 text-gray-300 mx-auto mb-4' />
              <p className='text-gray-600 mb-4'>No bids in this category yet</p>
              <Button onClick={() => router.push('/tenders/available')}>
                Browse Tenders
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
