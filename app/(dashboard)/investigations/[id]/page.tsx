'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { formatDate } from '@/lib/formatters';
import { mockInvestigations } from '@/lib/mockData';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  Edit,
  Send,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function InvestigationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const investigation = mockInvestigations.find(i => i.id === Number(id));
  const [newNote, setNewNote] = useState('');

  if (!investigation) {
    return (
      <div className='space-y-6'>
        <Button variant='outline' onClick={() => router.back()}>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back
        </Button>
        <div className='text-center py-12'>
          <h2 className='text-2xl font-bold text-gray-900'>
            Investigation not found
          </h2>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Open: 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      Closed: 'bg-gray-100 text-gray-800',
      Resolved: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      High: 'bg-red-100 text-red-800',
      Medium: 'bg-orange-100 text-orange-800',
      Low: 'bg-green-100 text-green-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Open')
      return <AlertCircle className='h-5 w-5 text-blue-600' />;
    if (status === 'In Progress')
      return <Clock className='h-5 w-5 text-yellow-600' />;
    if (status === 'Resolved')
      return <CheckCircle className='h-5 w-5 text-green-600' />;
    return null;
  };

  return (
    <div className='space-y-6'>
      <Button variant='outline' size='sm' onClick={() => router.back()}>
        <ArrowLeft className='h-4 w-4 mr-2' />
        Back
      </Button>

      <div className='space-y-4'>
        <div className='flex items-start justify-between gap-4'>
          <div className='space-y-2 flex-1'>
            <div className='flex items-center gap-2'>
              {getStatusIcon(investigation.status)}
              <h1 className='text-3xl font-bold text-gray-900'>
                {investigation.title}
              </h1>
            </div>
            <p className='text-gray-600'>{investigation.case_number}</p>
          </div>
          <Button variant='outline' size='sm'>
            <Edit className='h-4 w-4 mr-2' />
            Edit Case
          </Button>
        </div>

        <div className='flex flex-wrap gap-2'>
          <Badge className={getStatusColor(investigation.status)}>
            {investigation.status}
          </Badge>
          <Badge className={getPriorityColor(investigation.priority)}>
            Priority: {investigation.priority}
          </Badge>
        </div>

        {investigation.priority === 'HIGH' && (
          <Alert className='border-red-200 bg-red-50'>
            <AlertCircle className='h-4 w-4 text-red-600' />
            <AlertDescription className='text-red-800'>
              This is a high-priority investigation requiring immediate
              attention.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card className='p-4'>
          <p className='text-sm text-gray-600'>Case Number</p>
          <p className='text-lg font-semibold mt-2'>
            {investigation.case_number}
          </p>
        </Card>
        <Card className='p-4'>
          <p className='text-sm text-gray-600'>Date Created</p>
          <p className='text-lg font-semibold mt-2'>
            {formatDate(new Date(investigation.opened_date))}
          </p>
        </Card>
        <Card className='p-4'>
          <p className='text-sm text-gray-600'>Assigned To</p>
          <p className='text-lg font-semibold mt-2'>
            {investigation.investigator_name}
          </p>
        </Card>
        <Card className='p-4'>
          <p className='text-sm text-gray-600'>Related Entity</p>
          <p className='text-lg font-semibold mt-2 line-clamp-2'>
            {/* {investigation.relatedEntity} */}
          </p>
        </Card>
      </div>

      <Card className='p-6'>
        <Tabs defaultValue='details' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='details'>Details</TabsTrigger>
            <TabsTrigger value='timeline'>Timeline</TabsTrigger>
            <TabsTrigger value='notes'>Notes</TabsTrigger>
            <TabsTrigger value='evidence'>Evidence</TabsTrigger>
          </TabsList>

          <TabsContent value='details' className='space-y-4'>
            <div className='space-y-4'>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Description
                </h3>
                <p className='text-gray-700'>{investigation.description}</p>
              </div>

              <div className='grid grid-cols-2 gap-6'>
                <div>
                  <h4 className='font-semibold text-gray-900 mb-2'>
                    Investigation Type
                  </h4>
                  <p className='text-gray-700 bg-gray-50 px-3 py-2 rounded-md inline-block'>
                    Procurement Fraud
                  </p>
                </div>
                <div>
                  <h4 className='font-semibold text-gray-900 mb-2'>Severity</h4>
                  <p className='text-gray-700 bg-gray-50 px-3 py-2 rounded-md inline-block'>
                    {investigation.priority}
                  </p>
                </div>
              </div>

              <div>
                <h4 className='font-semibold text-gray-900 mb-2'>
                  Findings Summary
                </h4>
                <ul className='space-y-2 text-sm text-gray-700'>
                  <li className='flex items-start gap-2'>
                    <span className='text-red-600 mt-1'>•</span>
                    <span>Evidence of bid rigging in procurement process</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-red-600 mt-1'>•</span>
                    <span>Unauthorized entities submitting bids</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-red-600 mt-1'>•</span>
                    <span>Inflated pricing compared to market rates</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='timeline' className='space-y-4'>
            <div className='space-y-4'>
              <div className='border-l-4 border-blue-500 pl-4 py-3'>
                <div className='flex items-center gap-2 mb-1'>
                  <p className='font-semibold text-gray-900'>
                    Investigation Opened
                  </p>
                  <Badge className='bg-blue-100 text-blue-800'>Today</Badge>
                </div>
                <p className='text-sm text-gray-600'>
                  Case {investigation.case_number} created
                </p>
              </div>

              <div className='border-l-4 border-yellow-500 pl-4 py-3'>
                <div className='flex items-center gap-2 mb-1'>
                  <p className='font-semibold text-gray-900'>Status Updated</p>
                  <Badge className='bg-yellow-100 text-yellow-800'>
                    2 hours ago
                  </Badge>
                </div>
                <p className='text-sm text-gray-600'>
                  Status changed to In Progress
                </p>
              </div>

              <div className='border-l-4 border-gray-300 pl-4 py-3'>
                <div className='flex items-center gap-2 mb-1'>
                  <p className='font-semibold text-gray-900'>Evidence Added</p>
                  <Badge className='bg-gray-100 text-gray-800'>1 day ago</Badge>
                </div>
                <p className='text-sm text-gray-600'>
                  2 files uploaded to evidence section
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='notes' className='space-y-4'>
            <div className='space-y-4'>
              <div className='space-y-3'>
                {[
                  {
                    author: 'John Smith',
                    time: '2 hours ago',
                    text: 'Initial analysis complete. Flagged 3 suspicious bids.',
                  },
                  {
                    author: 'Sarah Johnson',
                    time: '1 day ago',
                    text: 'Witness interviews scheduled for next week.',
                  },
                  {
                    author: 'John Smith',
                    time: '2 days ago',
                    text: 'Case opened. Preliminary investigation started.',
                  },
                ].map((note, idx) => (
                  <div
                    key={idx}
                    className='border border-gray-200 rounded-lg p-3'
                  >
                    <div className='flex items-center gap-2 mb-1'>
                      <User className='h-4 w-4 text-gray-400' />
                      <p className='font-medium text-gray-900'>{note.author}</p>
                      <span className='text-xs text-gray-600'>{note.time}</span>
                    </div>
                    <p className='text-sm text-gray-700'>{note.text}</p>
                  </div>
                ))}
              </div>

              <div className='border-t border-gray-200 pt-4'>
                <div className='space-y-2'>
                  <label className='block text-sm font-medium text-gray-900'>
                    Add Note
                  </label>
                  <Textarea
                    placeholder='Add a note to this investigation...'
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    rows={3}
                  />
                  <Button size='sm' className='ml-auto'>
                    <Send className='h-4 w-4 mr-2' />
                    Post Note
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='evidence' className='space-y-4'>
            <div className='space-y-2'>
              <div className='border border-gray-200 rounded-md p-3 flex items-center justify-between hover:bg-gray-50'>
                <div className='text-sm'>
                  <p className='font-medium text-gray-900'>Bid Documents.pdf</p>
                  <p className='text-gray-600'>
                    2.5 MB • PDF • Uploaded 2 days ago
                  </p>
                </div>
                <Button variant='ghost' size='sm'>
                  Download
                </Button>
              </div>
              <div className='border border-gray-200 rounded-md p-3 flex items-center justify-between hover:bg-gray-50'>
                <div className='text-sm'>
                  <p className='font-medium text-gray-900'>
                    Procurement Records.xlsx
                  </p>
                  <p className='text-gray-600'>
                    1.8 MB • Excel • Uploaded 1 day ago
                  </p>
                </div>
                <Button variant='ghost' size='sm'>
                  Download
                </Button>
              </div>
              <div className='border border-gray-200 rounded-md p-3 flex items-center justify-between hover:bg-gray-50'>
                <div className='text-sm'>
                  <p className='font-medium text-gray-900'>
                    Analysis Report.pdf
                  </p>
                  <p className='text-gray-600'>
                    3.2 MB • PDF • Uploaded 2 hours ago
                  </p>
                </div>
                <Button variant='ghost' size='sm'>
                  Download
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
