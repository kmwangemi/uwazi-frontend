'use client';

import { Button } from '@/components/ui/button';
import { useUIStore } from '@/lib/store';
import { Bell, Menu } from 'lucide-react';

export function Topbar() {
  const { toggleSidebar } = useUIStore();

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
      {/* Right Section */}
      <div className='flex items-center gap-4 ml-auto'>
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
