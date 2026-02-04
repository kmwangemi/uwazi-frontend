import type React from 'react';
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800'>
      <div className='w-full max-w-md'>{children}</div>
    </div>
  );
}
