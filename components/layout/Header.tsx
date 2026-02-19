'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { capitalizeFirstLetter, firstLetter } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { LogOut, Menu, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  const initials = `${firstLetter(user?.first_name ?? '')}${firstLetter(user?.last_name ?? '')}`;
  const userName =
    `${capitalizeFirstLetter(user?.first_name ?? '')} ${capitalizeFirstLetter(user?.last_name ?? '')}`.trim() ||
    'Unknown User';
  return (
    <header className='flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-4'>
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={toggleSidebar}
          className='lg:hidden'
        >
          <Menu className='h-5 w-5' />
        </Button>
        <h1 className='text-xl font-bold text-gray-900'>Procurement Monitor</h1>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-10 gap-2 px-2'>
            <Avatar className='h-8 w-8'>
              <AvatarFallback className='bg-primary text-white text-sm font-semibold'>
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className='hidden sm:inline text-sm text-gray-700'>
              {user?.email}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-56'>
          <div className='px-2 py-1.5'>
            <p className='text-sm font-medium text-gray-900'>{userName}</p>
            <p className='text-xs text-gray-600'>
              {capitalizeFirstLetter(user?.role ?? '')}
            </p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/settings')}>
            <Settings className='mr-2 h-4 w-4' />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className='text-red-600'>
            <LogOut className='mr-2 h-4 w-4' />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
