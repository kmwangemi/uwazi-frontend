'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import {
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  Briefcase,
  BarChart3,
  FileBarChart,
  Globe,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Tenders', href: '/tenders', icon: FileText },
  { label: 'Suppliers', href: '/suppliers', icon: Users },
  { label: 'Entities', href: '/entities', icon: Building2 },
  { label: 'Investigations', href: '/investigations', icon: Briefcase },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Reports', href: '/reports', icon: FileBarChart },
  { label: 'Public Portal', href: '/transparency', icon: Globe },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useUIStore()

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full z-40 flex flex-col border-r border-gray-200 bg-white transition-all duration-300 lg:relative lg:z-auto',
          sidebarOpen ? 'w-64' : '-translate-x-full lg:w-64'
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-gray-200 px-6 py-4">
          <h2 className="text-sm font-bold text-primary">PROCMON</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-gray-200 px-3 py-4">
          <p className="text-xs text-gray-600">
            Fighting corruption to protect Kenya's future
          </p>
        </div>
      </aside>
    </>
  )
}
