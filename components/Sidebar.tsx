'use client';

import { Button } from '@/components/ui/button';
import { useLogout } from '@/lib/queries/useAuthQueries';
import { useAuthStore, useUIStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  BarChart3,
  Cpu,
  Eye,
  FileText,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  MessageSquare,
  Settings,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore(state => state.user);
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  // ✅ roles is now an array
  const roles = user?.roles ?? [];
  const isAdmin = roles.includes('admin');
  const isInvestigator = roles.includes('investigator');
  const navItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Tenders', href: '/tenders', icon: FileText },
    { label: 'Suppliers', href: '/suppliers', icon: Users },
    { label: 'Risk Analysis', href: '/risk', icon: AlertTriangle },
    { label: 'County Risk', href: '/county-risk', icon: Map },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    ...(isInvestigator || isAdmin
      ? [{ label: 'Investigations', href: '/investigations', icon: Eye }]
      : []),
    {
      label: 'Whistleblower',
      href: '/public/whistleblower',
      icon: MessageSquare,
    },
    ...(isAdmin ? [{ label: 'ML Models', href: '/ml-status', icon: Cpu }] : []),
    { label: 'Settings', href: '/settings', icon: Settings },
  ];
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href) ?? false;
  };
  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      useUIStore.setState({ sidebarOpen: false });
    }
  };
  return (
    <>
      {/* Mobile Menu Button */}
      <div className='fixed top-4 left-4 z-40 lg:hidden'>
        <Button
          size='icon'
          variant='ghost'
          onClick={toggleSidebar}
          className='border border-[#1f2937]'
        >
          {sidebarOpen ? (
            <X className='w-5 h-5' />
          ) : (
            <Menu className='w-5 h-5' />
          )}
        </Button>
      </div>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-30 lg:hidden'
          onClick={toggleSidebar}
        />
      )}
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-60 bg-[#0f1117] border-r border-[#1f2937] z-40 flex flex-col transition-transform lg:sticky lg:top-0 lg:translate-x-0 pt-16 lg:pt-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className='hidden lg:block p-6 border-b border-[#1f2937]'>
          <div className='text-[#00ff88] text-xs font-mono tracking-wider mb-2'>
            KCAC
          </div>
          <h1 className='text-lg font-bold text-white'>Procurement</h1>
          <p className='text-xs text-[#94a3b8]'>Anti-Corruption Monitor</p>
        </div>
        {/* Navigation */}
        <nav className='flex-1 p-4 overflow-y-auto'>
          <div className='space-y-1'>
            {navItems.map(item => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebarOnMobile}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded text-sm transition-colors',
                    active
                      ? 'bg-[#00ff88]/10 text-[#00ff88]'
                      : 'text-[#94a3b8] hover:text-[#e0e0e0] hover:bg-[#1a1d23]',
                  )}
                >
                  <Icon className='w-5 h-5' />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
        {/* User Section */}
        <div className='p-4 border-t border-[#1f2937]'>
          {user && (
            <div className='mb-4 p-3 bg-[#1a1d23] rounded border border-[#1f2937]'>
              <p className='text-xs text-[#94a3b8] truncate'>{user.email}</p>
              <p className='text-xs font-mono text-[#00ff88] mt-1 uppercase tracking-wider'>
                {roles.join(', ')} {/* ✅ show all roles */}
              </p>
            </div>
          )}
          <Button
            onClick={() => logout()}
            disabled={isLoggingOut}
            variant='outline'
            size='sm'
            className='w-full border-[#1f2937] text-[#ef4444] hover:bg-[#ef4444]/10'
          >
            <LogOut className='w-4 h-4 mr-2' />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </aside>
    </>
  );
}
