'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLogout } from '@/lib/queries/useAuthQueries';
import { useMyProfile, useMyStats } from '@/lib/queries/useUserQueries';
import { capitalizeFirstLetter, formatDate } from '@/lib/utils';
import {
  Briefcase,
  Calendar,
  Clock,
  Edit,
  LogOut,
  Mail,
  Phone,
  Shield,
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const { data: profile, isLoading: isLoadingProfile } = useMyProfile();
  const { data: stats, isLoading: isLoadingStats } = useMyStats();

  const fullName = profile?.fullName ?? '';
  const nameParts = fullName.trim().split(' ');
  const firstName = nameParts[0] ?? '';
  const lastName = nameParts.slice(1).join(' ') ?? '';

  const primaryRole =
    profile?.roles?.[0]?.displayName ?? profile?.roles?.[0]?.name ?? '';

  const statTiles = [
    {
      label: 'Cases Investigated',
      value: isLoadingStats
        ? '—'
        : (stats?.casesInvestigated ?? 0).toLocaleString(),
    },
    {
      label: 'Alerts Reviewed',
      value: isLoadingStats
        ? '—'
        : (stats?.alertsReviewed ?? 0).toLocaleString(),
    },
    {
      label: 'Fraud Cases Confirmed',
      value: isLoadingStats
        ? '—'
        : (stats?.fraudCasesConfirmed ?? 0).toLocaleString(),
    },
    {
      label: 'Total Fraud Amount Recovered',
      value: isLoadingStats ? '—' : (stats?.totalFraudAmountDisplay ?? 'KES 0'),
    },
  ];

  return (
    <div className='max-w-4xl space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-white mb-2'>Profile</h1>
        <p className='text-[#94a3b8]'>Manage your account and view activity</p>
      </div>

      {/* Profile Header Card */}
      <Card className='bg-[#121418] border-[#1f2937] p-8'>
        <div className='flex items-start justify-between'>
          <div className='flex items-center gap-6'>
            {/* Avatar */}
            <div className='h-20 w-20 rounded-full bg-[#1a1d23] border-2 border-[#00ff88]/30 flex items-center justify-center text-[#00ff88] text-2xl font-bold shadow-lg'>
              {fullName
                ? fullName
                    .trim()
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)
                : '??'}
            </div>
            <div>
              {isLoadingProfile ? (
                <div className='h-8 w-48 bg-[#1a1d23] animate-pulse rounded mb-2' />
              ) : (
                <h2 className='text-3xl font-bold text-white'>
                  {capitalizeFirstLetter(firstName)}{' '}
                  {capitalizeFirstLetter(lastName)}
                </h2>
              )}
              <p className='text-[#94a3b8] mt-1'>
                {capitalizeFirstLetter(primaryRole)}
              </p>
              <div className='flex items-center gap-2 mt-2'>
                <Badge className='bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 hover:bg-[#00ff88]/10'>
                  {profile?.isActive ? 'Active' : 'Inactive'}
                </Badge>
                {profile?.isSuperuser && (
                  <Badge className='bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30 hover:bg-[#f59e0b]/10'>
                    Superuser
                  </Badge>
                )}
                {profile?.mustChangePassword && (
                  <Badge className='bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 hover:bg-[#ef4444]/10'>
                    Password Change Required
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className='flex gap-2'>
            <Link href='/settings'>
              <Button
                variant='outline'
                className='border-[#1f2937] text-[#94a3b8] bg-transparent hover:bg-[#1a1d23] hover:text-white'
              >
                <Edit className='h-4 w-4 mr-2' />
                Edit Profile
              </Button>
            </Link>
            <Button
              onClick={() => logout()}
              disabled={isLoggingOut}
              className='bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 hover:bg-[#ef4444]/20'
            >
              <LogOut className='h-4 w-4 mr-2' />
              {isLoggingOut ? 'Signing out...' : 'Logout'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card className='bg-[#121418] border-[#1f2937] p-6'>
        <h2 className='text-lg font-semibold text-white mb-6'>
          Contact Information
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {[
            {
              icon: <Mail className='h-5 w-5 text-[#00ff88]' />,
              label: 'Email',
              value: profile?.email ?? '—',
              iconBg: 'bg-[#00ff88]/10',
              hasValue: !!profile?.email,
            },
            {
              icon: <Phone className='h-5 w-5 text-[#3b82f6]' />,
              label: 'Phone',
              value: profile?.phone ?? 'Not Provided',
              iconBg: 'bg-[#3b82f6]/10',
              hasValue: !!profile?.phone,
            },
            {
              icon: <Briefcase className='h-5 w-5 text-[#f59e0b]' />,
              label: 'Department',
              value: profile?.department ?? 'Not Provided',
              iconBg: 'bg-[#f59e0b]/10',
              hasValue: !!profile?.department,
            },
            {
              icon: <Shield className='h-5 w-5 text-[#a78bfa]' />,
              label: 'Role',
              value: capitalizeFirstLetter(primaryRole) || '—',
              iconBg: 'bg-[#a78bfa]/10',
              hasValue: !!primaryRole,
            },
          ].map(item => (
            <div key={item.label} className='flex items-center gap-4'>
              <div
                className={`h-10 w-10 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0`}
              >
                {item.icon}
              </div>
              <div>
                <p className='text-sm text-[#64748b]'>{item.label}</p>
                <p
                  className={`font-medium ${item.hasValue ? 'text-white' : 'text-[#64748b] italic'}`}
                >
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Account Activity */}
      <Card className='bg-[#121418] border-[#1f2937] p-6'>
        <h2 className='text-lg font-semibold text-white mb-6'>
          Account Activity
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex items-center gap-4 p-4 bg-[#1a1d23] rounded-lg border border-[#1f2937]'>
            <Calendar className='h-5 w-5 text-[#94a3b8] shrink-0' />
            <div>
              <p className='text-sm text-[#64748b]'>Member Since</p>
              <p className='font-medium text-white'>
                {profile?.createdAt
                  ? formatDate(profile.createdAt)
                  : isLoadingProfile
                    ? '—'
                    : 'Not available'}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-4 p-4 bg-[#1a1d23] rounded-lg border border-[#1f2937]'>
            <Clock className='h-5 w-5 text-[#94a3b8] shrink-0' />
            <div>
              <p className='text-sm text-[#64748b]'>Last Login</p>
              <p className='font-medium text-white'>
                {profile?.lastLoginAt
                  ? formatDate(profile.lastLoginAt)
                  : isLoadingProfile
                    ? '—'
                    : 'Not Available'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Performance Statistics */}
      <Card className='bg-[#121418] border-[#1f2937] p-6'>
        <h2 className='text-lg font-semibold text-white mb-6'>
          Performance Statistics
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {statTiles.map((stat, i) => {
            const accents = ['#00ff88', '#3b82f6', '#f59e0b', '#a78bfa'];
            const accent = accents[i % accents.length];
            return (
              <div
                key={stat.label}
                className='bg-[#1a1d23] p-4 rounded-lg border border-[#1f2937]'
              >
                <p className='text-sm text-[#64748b] mb-2'>{stat.label}</p>
                <p
                  className={`text-2xl font-bold font-mono ${
                    isLoadingStats
                      ? 'text-[#1f2937] animate-pulse'
                      : 'text-white'
                  }`}
                  style={!isLoadingStats ? { color: accent } : undefined}
                >
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Roles & Permissions */}
      {(profile?.roles?.length ?? 0) > 0 && (
        <Card className='bg-[#121418] border-[#1f2937] p-6'>
          <h2 className='text-lg font-semibold text-white mb-4'>
            Roles &amp; Permissions
          </h2>
          <div className='space-y-3'>
            {profile!.roles.map(role => (
              <div
                key={role.id}
                className='flex items-start justify-between p-3 bg-[#1a1d23] rounded-lg border border-[#1f2937]'
              >
                <div>
                  <p className='font-medium text-white'>
                    {role.displayName ?? role.name}
                  </p>
                  {role.description && (
                    <p className='text-sm text-[#64748b] mt-0.5'>
                      {role.description}
                    </p>
                  )}
                </div>
                <div className='flex flex-wrap gap-1 max-w-xs'>
                  {role.permissions.slice(0, 4).map(p => (
                    <Badge
                      key={p.id}
                      className='bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20 text-xs hover:bg-[#00ff88]/10'
                    >
                      {p.name}
                    </Badge>
                  ))}
                  {role.permissions.length > 4 && (
                    <Badge className='bg-[#1f2937] text-[#94a3b8] text-xs hover:bg-[#1f2937]'>
                      +{role.permissions.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Security */}
      <Card className='bg-[#121418] border-[#ef4444]/20 p-6'>
        <h2 className='text-lg font-semibold text-white mb-4'>
          Security &amp; Logout
        </h2>
        <p className='text-[#94a3b8] mb-4'>
          Click the logout button to securely end your session and return to the
          login page.
        </p>
        <Button
          onClick={() => logout()}
          disabled={isLoggingOut}
          className='bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 hover:bg-[#ef4444]/20'
        >
          <LogOut className='h-4 w-4 mr-2' />
          {isLoggingOut ? 'Signing out...' : 'Logout from All Devices'}
        </Button>
      </Card>
    </div>
  );
}
