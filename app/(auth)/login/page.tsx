'use client';

import { LoginForm } from '@/components/forms/LoginForm';
import { Card } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className='min-h-screen bg-[#0a0c0f] flex items-center justify-center p-4'>
      {/* Grid background texture */}
      <div
        className='absolute inset-0 opacity-5'
        style={{
          backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(0, 255, 136, .05) 25%, rgba(0, 255, 136, .05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 136, .05) 75%, rgba(0, 255, 136, .05) 76%, transparent 77%, transparent),
                            linear-gradient(90deg, transparent 24%, rgba(0, 255, 136, .05) 25%, rgba(0, 255, 136, .05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 136, .05) 75%, rgba(0, 255, 136, .05) 76%, transparent 77%, transparent)`,
          backgroundSize: '50px 50px',
        }}
      />
      <Card className='w-full max-w-md relative z-10 border-[#1f2937] bg-[#121418]'>
        <div className='p-8'>
          {/* Header */}
          <div className='mb-8'>
            <div className='text-[#00ff88] text-sm font-mono mb-2 tracking-wider'>
              KCAC
            </div>
            <h1 className='text-2xl font-bold text-white font-plex-sans'>
              Procurement Intelligence
            </h1>
            <p className='text-[#94a3b8] text-sm mt-2'>
              Kenya Anti-Corruption Monitoring System
            </p>
          </div>
          {/* Form Component */}
          <LoginForm />
          {/* Demo info */}
          <div className='mt-6 p-4 bg-[#1a1d23] border border-[#1f2937] rounded text-xs text-[#94a3b8] space-y-1 font-mono'>
            <p className='text-[#00ff88]'>Demo Credentials:</p>
            <p>demo@procmon.go.ke / Admin@123!</p>
            {/* <p>investigator@example.com / password</p>
            <p>viewer@example.com / password</p> */}
          </div>
        </div>
      </Card>
    </div>
  );
}
