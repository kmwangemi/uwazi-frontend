'use client';

import { Pagination } from '@/components/shared/Pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEntities } from '@/hooks/queries/useEntities';
import { exportToCSV } from '@/lib/exportUtils';
import { formatCurrency } from '@/lib/formatters';
import { Download, Eye, Loader2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 10;

const ENTITY_TYPES = ['MINISTRY', 'COUNTY', 'PARASTATAL', 'OTHER'];

export default function EntitiesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [countyFilter, setCountyFilter] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  const { data, isLoading, isError } = useEntities({
    search: search || undefined,
    county: countyFilter || undefined,
    entity_type: entityTypeFilter || undefined,
    page: currentPage,
    limit: itemsPerPage,
  });

  const entities = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.ceil(total / itemsPerPage);

  const handleExport = () => {
    const dataToExport = entities.map(e => ({
      'Entity Name': e.name,
      'Entity Code': e.entity_code,
      'Entity Type': e.entity_type,
      County: e.county ?? '—',
      'Total Tenders': e.total_tenders,
      'Total Expenditure': formatCurrency(e.total_expenditure),
      'Flagged Tenders': e.flagged_tenders,
      'Avg Corruption Score': e.average_corruption_score.toFixed(2),
    }));
    exportToCSV(
      dataToExport,
      `entities_${new Date().toISOString().split('T')[0]}`,
    );
    toast.success('Entities exported successfully');
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            Procuring Entities
          </h1>
          <p className='text-gray-600'>
            Analyze government entities and their procurement patterns
          </p>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={handleExport}
          disabled={isLoading}
        >
          <Download className='h-4 w-4 mr-2' />
          Export
        </Button>
      </div>
      <div className='bg-white rounded-lg border border-gray-200 p-4 space-y-6'>
        <div className='flex gap-4 flex-wrap items-center'>
          <div className='flex-1 min-w-72 relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
            <Input
              placeholder='Search entities...'
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className='pl-10'
            />
          </div>
          <Select
            value={entityTypeFilter || 'all'}
            onValueChange={value => {
              setEntityTypeFilter(value === 'all' ? '' : value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className='w-44'>
              <SelectValue placeholder='Entity type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Types</SelectItem>
              {ENTITY_TYPES.map(type => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={countyFilter || 'all'}
            onValueChange={value => {
              setCountyFilter(value === 'all' ? '' : value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className='w-40'>
              <SelectValue placeholder='Filter by county' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Counties</SelectItem>
              {/* Populate from entities in view */}
              {[...new Set(entities.map(e => e.county).filter(Boolean))]
                .sort()
                .map(county => (
                  <SelectItem key={county!} value={county!}>
                    {county}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <div className='ml-auto text-sm text-gray-600'>
            {total} entit{total !== 1 ? 'ies' : 'y'}
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-gray-200'>
                <th className='text-left py-3 px-4 font-semibold text-gray-900'>
                  Entity Name
                </th>
                <th className='text-left py-3 px-4 font-semibold text-gray-900'>
                  Type
                </th>
                <th className='text-left py-3 px-4 font-semibold text-gray-900'>
                  County
                </th>
                <th className='text-left py-3 px-4 font-semibold text-gray-900'>
                  Tenders
                </th>
                <th className='text-left py-3 px-4 font-semibold text-gray-900'>
                  Total Spent
                </th>
                <th className='text-left py-3 px-4 font-semibold text-gray-900'>
                  Flagged
                </th>
                <th className='text-left py-3 px-4 font-semibold text-gray-900'>
                  Avg Risk
                </th>
                <th className='text-left py-3 px-4 font-semibold text-gray-900'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className='py-12 text-center text-gray-500'>
                    <Loader2 className='h-6 w-6 animate-spin mx-auto mb-2' />
                    Loading entities...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={8} className='py-12 text-center text-red-500'>
                    Failed to load entities. Please try again.
                  </td>
                </tr>
              ) : entities.length === 0 ? (
                <tr>
                  <td colSpan={8} className='py-12 text-center text-gray-500'>
                    No entities found.
                  </td>
                </tr>
              ) : (
                entities.map(entity => (
                  <tr
                    key={entity.id}
                    className='border-b border-gray-100 hover:bg-gray-50'
                  >
                    <td className='py-3 px-4 text-gray-900 font-medium'>
                      {entity.name}
                    </td>
                    <td className='py-3 px-4'>
                      <Badge variant='outline'>{entity.entity_type}</Badge>
                    </td>
                    <td className='py-3 px-4 text-gray-700'>
                      {entity.county ?? '—'}
                    </td>
                    <td className='py-3 px-4 text-gray-700'>
                      {entity.total_tenders}
                    </td>
                    <td className='py-3 px-4 text-gray-900 font-medium'>
                      {formatCurrency(entity.total_expenditure)}
                    </td>
                    <td className='py-3 px-4'>
                      {entity.flagged_tenders > 0 ? (
                        <Badge className='bg-red-100 text-red-800'>
                          {entity.flagged_tenders}
                        </Badge>
                      ) : (
                        <span className='text-gray-400'>0</span>
                      )}
                    </td>
                    <td className='py-3 px-4'>
                      <Badge
                        className={
                          entity.average_corruption_score >= 70
                            ? 'bg-red-100 text-red-800'
                            : entity.average_corruption_score >= 40
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }
                      >
                        {entity.average_corruption_score.toFixed(0)}
                      </Badge>
                    </td>
                    <td className='py-3 px-4'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => router.push(`/entities/${entity.id}`)}
                      >
                        <Eye className='h-4 w-4' />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
