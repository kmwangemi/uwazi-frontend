'use client';

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
import { useTenders } from '@/hooks/queries/useTenders';
import { KENYA_COUNTIES, PROCUREMENT_CATEGORIES } from '@/lib/constants';
import { formatCurrency } from '@/lib/formatters';
import { ArrowRight, Bookmark, FileText, MapPin, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 8;

export default function AvailableTendersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [countyFilter, setCountyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  const [bookmarkedTenders, setBookmarkedTenders] = useState<string[]>([]); // ✅ string UUIDs

  const { data: tendersData, isLoading } = useTenders({
    page: currentPage,
    limit: itemsPerPage,
    category: categoryFilter === 'all' ? undefined : categoryFilter,
    county: countyFilter === 'all' ? undefined : countyFilter,
    search: searchQuery || undefined,
  });

  const fetchedTenders = tendersData?.data || [];
  const totalPages = Math.ceil((tendersData?.meta?.total || 0) / itemsPerPage);

  // Client-side sort on top of server results
  const sortedTenders = [...fetchedTenders].sort((a, b) => {
    if (sortBy === 'deadline') {
      return (
        new Date(a.deadline || '').getTime() -
        new Date(b.deadline || '').getTime()
      );
    }
    if (sortBy === 'amount') return b.amount - a.amount;
    if (sortBy === 'recent') {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    return 0;
  });

  const toggleBookmark = (tenderId: string) => {
    // ✅ string UUID
    setBookmarkedTenders(prev =>
      prev.includes(tenderId)
        ? prev.filter(id => id !== tenderId)
        : [...prev, tenderId],
    );
  };

  const daysUntilDeadline = (deadline: string) => {
    const diff = new Date(deadline).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const getDeadlineColor = (deadline: string) => {
    const days = daysUntilDeadline(deadline);
    if (days <= 3) return 'text-red-600 bg-red-50';
    if (days <= 7) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Section */}
      <div className='bg-linear-to-r from-primary to-primary/80 text-white py-12 px-4 -mx-4 mb-8'>
        <div className='max-w-6xl mx-auto'>
          <h1 className='text-4xl font-bold tracking-tight mb-3'>
            Find Your Next Opportunity
          </h1>
          <p className='text-lg text-white/90 mb-6'>
            Browse and submit bids for government procurement tenders.
            Transparent, fair, and corruption-free.
          </p>
          <div className='relative'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
            <Input
              placeholder='Search by title, reference number, or entity...'
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className='pl-12 py-3 text-base bg-white text-gray-900 placeholder:text-gray-500'
            />
          </div>
        </div>
      </div>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {/* Left Sidebar - Filters */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg border border-gray-200 p-4 sticky top-4 space-y-6 h-fit'>
              {/* Category filter — from constants, no mock data */}
              <div>
                <h3 className='font-semibold text-gray-900 mb-3'>Category</h3>
                <div className='space-y-2 max-h-64 overflow-y-auto'>
                  {['all', ...PROCUREMENT_CATEGORIES].map(
                    (
                      cat, // ✅ constants not mockData
                    ) => (
                      <label
                        key={cat}
                        className='flex items-center gap-2 cursor-pointer'
                      >
                        <input
                          type='radio'
                          name='category'
                          value={cat}
                          checked={categoryFilter === cat}
                          onChange={e => {
                            setCategoryFilter(e.target.value);
                            setCurrentPage(1);
                          }}
                          className='w-4 h-4 rounded'
                        />
                        <span className='text-sm text-gray-700'>
                          {cat === 'all' ? 'All Categories' : cat}
                        </span>
                      </label>
                    ),
                  )}
                </div>
              </div>
              <div className='h-px bg-gray-200' />
              {/* County filter — from constants */}
              <div>
                <h3 className='font-semibold text-gray-900 mb-3'>County</h3>
                <Select
                  value={countyFilter}
                  onValueChange={value => {
                    setCountyFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select county' />
                  </SelectTrigger>
                  <SelectContent className='max-h-64'>
                    <SelectItem value='all'>All Counties</SelectItem>
                    {KENYA_COUNTIES.map(
                      (
                        county, // ✅ constants not mockData
                      ) => (
                        <SelectItem key={county} value={county}>
                          {county}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className='h-px bg-gray-200' />
              {/* Sort */}
              <div>
                <h3 className='font-semibold text-gray-900 mb-3'>Sort By</h3>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Sort tenders' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='deadline'>Deadline (Nearest)</SelectItem>
                    <SelectItem value='amount'>Amount (Highest)</SelectItem>
                    <SelectItem value='recent'>Recently Posted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          {/* Right Content - Tenders Grid */}
          <div className='lg:col-span-3'>
            <div className='mb-6 flex items-center justify-between'>
              <p className='text-sm font-medium text-gray-700'>
                <span className='text-primary font-semibold'>
                  {tendersData?.meta?.total || 0}
                </span>{' '}
                tender{tendersData?.meta?.total !== 1 ? 's' : ''} found
              </p>
            </div>
            {isLoading ? (
              <div className='text-center py-12 text-gray-500'>
                Loading available tenders...
              </div>
            ) : sortedTenders.length === 0 ? (
              <Card className='p-12 text-center bg-gray-50 border-dashed'>
                <FileText className='h-12 w-12 text-gray-300 mx-auto mb-3' />
                <p className='text-gray-700 font-medium mb-1'>
                  No tenders found
                </p>
                <p className='text-sm text-gray-600'>
                  Try adjusting your filters or search term
                </p>
              </Card>
            ) : (
              <>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {sortedTenders.map(tender => {
                    const daysLeft = tender.deadline
                      ? daysUntilDeadline(tender.deadline) // ✅ was submission_deadline
                      : null;
                    const isBookmarked = bookmarkedTenders.includes(tender.id); // ✅ string UUID

                    return (
                      <Card
                        key={tender.id}
                        className='p-4 hover:shadow-lg hover:border-primary/50 transition-all duration-200 cursor-pointer flex flex-col'
                        onClick={() => router.push(`/tenders/${tender.id}`)}
                      >
                        {/* Header */}
                        <div className='flex justify-between items-start mb-3'>
                          <div className='flex-1'>
                            <div className='flex items-center gap-2 mb-2 flex-wrap'>
                              {tender.category && (
                                <Badge variant='secondary' className='text-xs'>
                                  {tender.category}
                                </Badge>
                              )}
                              {daysLeft !== null && daysLeft <= 3 && (
                                <Badge className='bg-red-100 text-red-800 text-xs'>
                                  Urgent
                                </Badge>
                              )}
                              {daysLeft !== null &&
                                daysLeft <= 7 &&
                                daysLeft > 3 && (
                                  <Badge className='bg-yellow-100 text-yellow-800 text-xs'>
                                    Soon
                                  </Badge>
                                )}
                            </div>
                          </div>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              toggleBookmark(tender.id);
                              toast.success(
                                bookmarkedTenders.includes(tender.id)
                                  ? 'Removed from saved'
                                  : 'Saved to your list',
                              );
                            }}
                            className='text-gray-300 hover:text-primary transition-colors shrink-0'
                            aria-label={
                              isBookmarked
                                ? 'Remove bookmark'
                                : 'Bookmark tender'
                            }
                          >
                            <Bookmark
                              className={`h-5 w-5 ${isBookmarked ? 'fill-primary text-primary' : ''}`}
                            />
                          </button>
                        </div>
                        {/* Title */}
                        <h3 className='text-base font-semibold text-gray-900 mb-2 line-clamp-2 grow'>
                          {tender.title}
                        </h3>
                        {/* Entity & Location */}
                        <div className='mb-3 space-y-1'>
                          <p className='text-xs text-gray-600 font-medium'>
                            {tender.entity_name} {/* ✅ was procuring_entity */}
                          </p>
                          {tender.county && (
                            <div className='flex items-center gap-1 text-xs text-gray-600'>
                              <MapPin className='h-3 w-3' />
                              <span>{tender.county}</span>
                            </div>
                          )}
                        </div>
                        <div className='h-px bg-gray-100 my-3' />
                        {/* Amount & Deadline */}
                        <div className='grid grid-cols-2 gap-3 mb-3'>
                          <div>
                            <p className='text-xs text-gray-600 mb-1'>Budget</p>
                            <p className='text-sm font-bold text-primary'>
                              {formatCurrency(tender.amount)}
                            </p>
                          </div>
                          <div>
                            <p className='text-xs text-gray-600 mb-1'>
                              Deadline
                            </p>
                            {daysLeft !== null && tender.deadline ? (
                              <div
                                className={`text-xs font-semibold px-2 py-1 rounded-full inline-block ${getDeadlineColor(tender.deadline)}`}
                              >
                                {daysLeft > 0 ? `${daysLeft} days` : 'Expired'}
                              </div>
                            ) : (
                              <span className='text-xs text-gray-400'>N/A</span>
                            )}
                          </div>
                        </div>
                        {/* Action */}
                        <Button
                          size='sm'
                          className='w-full'
                          onClick={e => {
                            e.stopPropagation();
                            router.push(`/tenders/${tender.id}/bid/new`);
                          }}
                        >
                          <ArrowRight className='h-4 w-4 mr-2' />
                          Submit Bid
                        </Button>
                      </Card>
                    );
                  })}
                </div>
                {totalPages > 1 && (
                  <div className='mt-6'>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      itemsPerPage={itemsPerPage}
                      onItemsPerPageChange={setItemsPerPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
