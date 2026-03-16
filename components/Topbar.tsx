'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUIStore } from '@/lib/store';
import { Bell, Menu, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function Topbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { toggleSidebar } = useUIStore();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tenders?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  return (
    <header className='fixed top-0 right-0 left-0 lg:left-0 h-16 bg-[#0a0c0f] border-b border-[#1f2937] z-20 flex items-center justify-between px-4 lg:px-6'>
      {/* Mobile Menu Button */}
      <div className='lg:hidden'>
        <Button
          size='icon'
          variant='ghost'
          onClick={toggleSidebar}
          className='border border-[#1f2937]'
        >
          <Menu className='w-5 h-5' />
        </Button>
      </div>
      {/* Search Bar */}
      <form onSubmit={handleSearch} className='flex-1 mx-4'>
        <div className='relative max-w-md'>
          <Input
            type='text'
            placeholder='Search tenders...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='pl-10 pr-4 bg-[#1a1d23] border-[#1f2937] text-white placeholder-[#64748b] focus:border-[#00ff88]'
          />
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]' />
        </div>
      </form>
      {/* Right Section */}
      <div className='flex items-center gap-4'>
        <Button
          size='icon'
          variant='ghost'
          className='border border-[#1f2937] text-[#94a3b8] hover:text-[#00ff88] hover:bg-[#1a1d23] relative'
        >
          <Bell className='w-5 h-5' />
          <span className='absolute top-1 right-1 w-2 h-2 bg-[#ef4444] rounded-full' />
        </Button>
      </div>
    </header>
  );
}
