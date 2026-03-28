'use client';

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClass = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }[size];

  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }[size];

  return (
    <div className='flex flex-col items-center justify-center gap-2'>
      <Loader2 className={`${sizeClass} animate-spin text-[#00ff88]`} />
      {text && <p className={`${textSize} text-[#94a3b8]`}>{text}</p>}
    </div>
  );
}
