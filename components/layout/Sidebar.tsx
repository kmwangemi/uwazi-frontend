'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { UserRole } from '@/types/user';
import {
  BarChart3,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  FileBarChart,
  FileText,
  Globe,
  LayoutDashboard,
  Search,
  Settings,
  TrendingUp,
  User,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: [
      'admin',
      'investigator',
      'supplier',
      'procurement_officer',
    ] as UserRole[],
  },
  {
    label: 'Tenders',
    href: '/tenders',
    icon: FileText,
    roles: [
      'admin',
      'investigator',
      'supplier',
      'procurement_officer',
    ] as UserRole[],
  },
  {
    label: 'Suppliers',
    href: '/suppliers',
    icon: Users,
    roles: [
      'admin',
      'investigator',
      'supplier',
      'procurement_officer',
    ] as UserRole[],
  },
  {
    label: 'Entities',
    href: '/entities',
    icon: Building2,
    roles: [
      'admin',
      'investigator',
      'supplier',
      'procurement_officer',
    ] as UserRole[],
  },
  {
    label: 'Investigations',
    href: '/investigations',
    icon: Briefcase,
    roles: [
      'admin',
      'investigator',
      'supplier',
      'procurement_officer',
    ] as UserRole[],
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    roles: [
      'admin',
      'investigator',
      'supplier',
      'procurement_officer',
    ] as UserRole[],
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: FileBarChart,
    roles: [
      'admin',
      'investigator',
      'supplier',
      'procurement_officer',
    ] as UserRole[],
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: User,
    roles: [
      'admin',
      'investigator',
      'supplier',
      'procurement_officer',
    ] as UserRole[],
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['admin'] as UserRole[],
  },
  {
    label: 'Public Portal',
    href: '/transparency',
    icon: Globe,
    roles: [
      'admin',
      'investigator',
      'supplier',
      'procurement_officer',
    ] as UserRole[],
  },
  // supplier menus
  {
    label: 'Dashboard',
    href: '/supplier/dashboard',
    icon: LayoutDashboard,
    roles: ['supplier'] as UserRole[],
  },
  {
    label: 'Browse Tenders',
    href: '/supplier/tenders/available',
    icon: Search,
    roles: ['supplier'] as UserRole[],
  },
  {
    label: 'My Bids',
    href: '/supplier/my-bids',
    icon: FileText,
    roles: ['supplier'] as UserRole[],
  },
  {
    label: 'Active Bids',
    href: '/supplier/my-bids?tab=active',
    icon: TrendingUp,
    roles: ['supplier'] as UserRole[],
  },
  {
    label: 'Pending Evaluation',
    href: '/supplier/my-bids?tab=pending',
    icon: Clock,
    roles: ['supplier'] as UserRole[],
  },
  {
    label: 'Won Tenders',
    href: '/supplier/my-bids?tab=won',
    icon: CheckCircle2,
    roles: ['supplier'] as UserRole[],
  },
  {
    label: 'Settings',
    href: '/supplier/settings',
    icon: Settings,
    roles: ['supplier'] as UserRole[],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { user } = useAuthStore();
  const visibleItems = navItems.filter(
    item => user && user.roles.some(r => item.roles.includes(r as UserRole)),
  );
  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-30 bg-black/50 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full z-40 flex flex-col border-r border-gray-200 bg-white transition-all duration-300 lg:relative lg:z-auto lg:translate-x-0 lg:w-64',
          sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full w-64',
        )}
      >
        <div className='flex items-center justify-between gap-2 border-b border-gray-200 px-6 py-4'>
          <h2 className='text-sm font-bold text-primary'>PROCMON</h2>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setSidebarOpen(false)}
            className='lg:hidden'
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
        <nav className='flex-1 space-y-1 overflow-y-auto px-3 py-4'>
          {visibleItems.map(item => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-50',
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className='h-5 w-5' />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className='border-t border-gray-200 px-3 py-4'>
          <p className='text-xs text-gray-600'>
            Fighting corruption to protect Kenya's future
          </p>
        </div>
      </aside>
    </>
  );
}
