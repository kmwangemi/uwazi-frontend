'use client';

import { NewInvestigationDialog } from '@/components/dialogs/NewInvestigationDialog';
import { Pagination } from '@/components/shared/Pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockInvestigations, mockPublicReports } from '@/lib/mockData';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Plus,
  Search,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 6;

export default function InvestigationsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  const [newInvestigationDialogOpen, setNewInvestigationDialogOpen] =
    useState(false);

  const filteredInvestigations = useMemo(() => {
    let result = [...mockInvestigations];

    if (statusFilter !== 'all') {
      result = result.filter(i => i.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      result = result.filter(i => i.priority === priorityFilter);
    }

    if (searchQuery) {
      result = result.filter(
        i =>
          i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.case_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return result.sort(
      (a, b) =>
        new Date(b.opened_date).getTime() - new Date(a.opened_date).getTime(),
    );
  }, [statusFilter, priorityFilter, searchQuery]);

  const totalPages = Math.ceil(filteredInvestigations.length / itemsPerPage);
  const paginatedInvestigations = filteredInvestigations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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
      return <AlertCircle className='h-4 w-4 text-blue-600' />;
    if (status === 'In Progress')
      return <Clock className='h-4 w-4 text-yellow-600' />;
    if (status === 'Resolved')
      return <CheckCircle className='h-4 w-4 text-green-600' />;
    return null;
  };

  const handleNewInvestigation = (investigationData: any) => {
    toast.success('Investigation case will be created soon');
    setNewInvestigationDialogOpen(false);
  };

  const pendingPublicReports = mockPublicReports.filter(
    r => r.status === 'Pending',
  );

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Investigations</h1>
          <p className='text-gray-600'>Manage fraud investigations and cases</p>
        </div>
        <div className='flex gap-3'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => router.push('/investigations/pending-reports')}
          >
            <AlertTriangle className='h-4 w-4 mr-2' />
            Pending Reports ({pendingPublicReports.length})
          </Button>
          <Button size='sm' onClick={() => setNewInvestigationDialogOpen(true)}>
            <Plus className='h-4 w-4 mr-2' />
            New Investigation
          </Button>
        </div>
      </div>

      {pendingPublicReports.length > 0 && (
        <Card className='p-4 bg-yellow-50 border-yellow-200'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <AlertTriangle className='h-5 w-5 text-yellow-600' />
              <div>
                <p className='font-semibold text-yellow-900'>
                  {pendingPublicReports.length} pending public report
                  {pendingPublicReports.length !== 1 ? 's' : ''}
                </p>
                <p className='text-sm text-yellow-800'>
                  Awaiting review and conversion to investigations
                </p>
              </div>
            </div>
            <Button
              variant='default'
              size='sm'
              onClick={() => router.push('/investigations/pending-reports')}
            >
              Review Reports
            </Button>
          </div>
        </Card>
      )}

      <NewInvestigationDialog
        open={newInvestigationDialogOpen}
        onOpenChange={setNewInvestigationDialogOpen}
        onSubmit={handleNewInvestigation}
      />

      <div className='bg-white rounded-lg border border-gray-200 p-4 space-y-6'>
        <div className='flex gap-4 flex-wrap items-center'>
          <div className='flex-1 min-w-72 relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
            <Input
              placeholder='Search by title, case number, or description...'
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className='pl-10'
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={value => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className='w-40'>
              <SelectValue placeholder='Filter by status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Statuses</SelectItem>
              <SelectItem value='Open'>Open</SelectItem>
              <SelectItem value='In Progress'>In Progress</SelectItem>
              <SelectItem value='Resolved'>Resolved</SelectItem>
              <SelectItem value='Closed'>Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={priorityFilter}
            onValueChange={value => {
              setPriorityFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className='w-40'>
              <SelectValue placeholder='Filter by priority' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Priorities</SelectItem>
              <SelectItem value='High'>High</SelectItem>
              <SelectItem value='Medium'>Medium</SelectItem>
              <SelectItem value='Low'>Low</SelectItem>
            </SelectContent>
          </Select>

          <div className='ml-auto text-sm text-gray-600'>
            {filteredInvestigations.length} case
            {filteredInvestigations.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {paginatedInvestigations.map(investigation => (
            <div
              key={investigation.id}
              className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'
            >
              <div className='space-y-3'>
                <div className='flex items-start justify-between gap-2'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      {getStatusIcon(investigation.status)}
                      <h3 className='font-semibold text-gray-900 line-clamp-2'>
                        {investigation.title}
                      </h3>
                    </div>
                    <p className='text-sm text-gray-600 mt-1'>
                      {investigation.case_number}
                    </p>
                  </div>
                  <Badge className={getPriorityColor(investigation.priority)}>
                    {investigation.priority}
                  </Badge>
                </div>

                <p className='text-sm text-gray-600 line-clamp-2'>
                  {investigation.description}
                </p>

                <div className='flex items-center justify-between pt-3 border-t border-gray-100'>
                  <div className='flex gap-2'>
                    <Badge className={getStatusColor(investigation.status)}>
                      {investigation.status}
                    </Badge>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() =>
                      router.push(`/investigations/${investigation.id}`)
                    }
                  >
                    <Eye className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </div>
  );
}
