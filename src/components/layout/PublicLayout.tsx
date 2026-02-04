/** biome-ignore-all lint/a11y/useValidAnchor: ignore dead links for now */
'use client';

import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useState } from 'react';

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navLinks = [
    { href: '/transparency', label: 'Home' },
    { href: '/whistleblower', label: 'Report Issue' },
  ];

  return (
    <div className='min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900'>
      {/* Header */}
      <header className='border-b border-slate-700 bg-slate-800/50 backdrop-blur sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            {/* Logo */}
            <Link href='/transparency' className='flex items-center gap-2'>
              <div className='w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold'>
                PM
              </div>
              <span className='text-lg font-semibold text-white'>
                Procurement Monitor
              </span>
            </Link>
            {/* Desktop Navigation */}
            <nav className='hidden md:flex items-center gap-6'>
              {navLinks.map(link => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className={`transition-colors ${
                    isActive(link.href)
                      ? 'text-white font-medium border-b-2 border-blue-500 pb-1'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link href='/login'>
                <Button className='bg-blue-600 hover:bg-blue-700'>
                  Sign In
                </Button>
              </Link>
            </nav>
            {/* Mobile Menu Button */}
            <button
              type='button'
              className='md:hidden text-white p-2 hover:bg-slate-700 rounded-lg transition-colors'
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label='Toggle menu'
            >
              {isMobileMenuOpen ? (
                <X className='w-6 h-6' />
              ) : (
                <Menu className='w-6 h-6' />
              )}
            </button>
          </div>
          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className='md:hidden mt-4 pb-4 border-t border-slate-700 pt-4'>
              <div className='flex flex-col space-y-4'>
                {navLinks.map(link => (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isActive(link.href)
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href='/login'
                  onClick={() => setIsMobileMenuOpen(false)}
                  className='px-4'
                >
                  <Button className='w-full bg-blue-600 hover:bg-blue-700'>
                    Sign In
                  </Button>
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>
      {/* Main Content */}
      <main>{children}</main>
      {/* Footer */}
      <footer className='border-t border-slate-700 bg-slate-800/50 mt-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8'>
            <div>
              <h3 className='text-white font-semibold mb-4'>Platform</h3>
              <ul className='space-y-2 text-slate-400 text-sm'>
                <li>
                  <Link
                    href='/transparency'
                    className='hover:text-white transition-colors'
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href='/transparency'
                    className='hover:text-white transition-colors'
                  >
                    Transparency
                  </Link>
                </li>
                <li>
                  <Link
                    href='/whistleblower'
                    className='hover:text-white transition-colors'
                  >
                    Report Issue
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='text-white font-semibold mb-4'>About</h3>
              <ul className='space-y-2 text-slate-400 text-sm'>
                <li>
                  <a href='#' className='hover:text-white transition-colors'>
                    About EACC
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-white transition-colors'>
                    Our Mission
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-white transition-colors'>
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='text-white font-semibold mb-4'>Resources</h3>
              <ul className='space-y-2 text-slate-400 text-sm'>
                <li>
                  <a href='#' className='hover:text-white transition-colors'>
                    Documentation
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-white transition-colors'>
                    FAQs
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-white transition-colors'>
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='text-white font-semibold mb-4'>Legal</h3>
              <ul className='space-y-2 text-slate-400 text-sm'>
                <li>
                  <a href='#' className='hover:text-white transition-colors'>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-white transition-colors'>
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-white transition-colors'>
                    Accessibility
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className='border-t border-slate-700 pt-8'>
            <p className='text-slate-400 text-sm text-center'>
              © 2024 Ethics and Anti-Corruption Commission (EACC). All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
