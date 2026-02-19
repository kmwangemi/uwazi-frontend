'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { capitalizeFirstLetter } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const userName =
    `${capitalizeFirstLetter(user?.first_name ?? '')} ${capitalizeFirstLetter(user?.last_name ?? '')}`.trim() ||
    'Unknown User';

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Settings</h1>
        <p className='mt-1 text-gray-600'>
          Manage your account and preferences
        </p>
      </div>
      <div className='grid gap-8 max-w-4xl'>
        {/* Account Information */}
        <Card className='p-6'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>
            Account Information
          </h2>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Name
              </label>
              <p className='mt-1 text-gray-900'>{userName}</p>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Email
              </label>
              <p className='mt-1 text-gray-900'>{user?.email}</p>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Role
              </label>
              <p className='mt-1 text-gray-900'>
                {capitalizeFirstLetter(user?.role ?? '')}
              </p>
            </div>
          </div>
        </Card>
        {/* Preferences */}
        <Card className='p-6'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>
            Preferences
          </h2>
          <p className='text-sm text-gray-600 mb-4'>Coming soon</p>
        </Card>
        {/* Security */}
        <Card className='p-6'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>Security</h2>
          <Button variant='outline'>Change Password</Button>
        </Card>
      </div>
    </div>
  );
}
