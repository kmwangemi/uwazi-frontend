import { QueryProvider } from '@/components/QueryProvider';
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kenya Procurement Intelligence - KCAC',
  description:
    'AI-powered anti-corruption monitoring system for Kenya public sector procurement with real-time risk analysis',
  generator: 'v0.app',
  keywords: [
    'procurement',
    'anti-corruption',
    'Kenya',
    'risk analysis',
    'KCAC',
    'intelligence',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#00ff88',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='dark'>
      <body className='font-sans antialiased bg-[#0a0c0f] text-[#e0e0e0]'>
        <QueryProvider>{children}</QueryProvider>
        <Analytics />
        <Toaster
          position='bottom-right'
          toastOptions={{
            duration: 5000,
            classNames: {
              success: 'bg-green-600 text-white border-green-700',
              error: 'bg-red-600 text-white border-red-700',
              warning: 'bg-yellow-500 text-black border-yellow-600',
              info: 'bg-blue-600 text-white border-blue-700',
            },
          }}
        />
      </body>
    </html>
  );
}
