'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useAssignRoles,
  useCreateUser,
  useDeactivateUser,
  useReactivateUser,
  useRoles,
  useUpdateUser,
  useUsers,
} from '@/lib/queries/useUserQueries';
import { Role, UserListItem } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Edit2,
  KeyRound,
  Loader2,
  Plus,
  Search,
  Shield,
  ShieldOff,
  UserCheck,
  UserMinus,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

// ── Helpers ───────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function avatarColor(id: string) {
  const colors = [
    'bg-[#00ff88]/20 text-[#00ff88]',
    'bg-[#3b82f6]/20 text-[#3b82f6]',
    'bg-[#f59e0b]/20 text-[#f59e0b]',
    'bg-[#ef4444]/20 text-[#ef4444]',
    'bg-[#a78bfa]/20 text-[#a78bfa]',
    'bg-[#06b6d4]/20 text-[#06b6d4]',
    'bg-[#ec4899]/20 text-[#ec4899]',
  ];
  const idx = id.charCodeAt(0) % colors.length;
  return colors[idx];
}

const DEPARTMENTS = [
  'Fraud Investigation',
  'Data Science',
  'Compliance',
  'Provider Relations',
  'Finance',
  'IT',
  'Management',
];

// ── Sub-components ────────────────────────────────────────────────────────────

function RoleBadge({ name }: { name: string }) {
  const lower = name.toLowerCase();
  const cls =
    lower.includes('admin') || lower.includes('super')
      ? 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20'
      : lower.includes('analyst') || lower.includes('investigat')
        ? 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20'
        : lower.includes('viewer') || lower.includes('read')
          ? 'bg-[#1a1d23] text-[#64748b] border-[#1f2937]'
          : 'bg-[#a78bfa]/10 text-[#a78bfa] border-[#a78bfa]/20';
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}
    >
      {name}
    </span>
  );
}

function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  danger,
  onConfirm,
  onCancel,
  loading,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  if (!open) return null;
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
      <div className='bg-[#121418] border border-[#1f2937] rounded-xl shadow-xl p-6 w-full max-w-sm mx-4'>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${danger ? 'bg-[#ef4444]/10' : 'bg-[#f59e0b]/10'}`}
        >
          <AlertTriangle
            className={`h-5 w-5 ${danger ? 'text-[#ef4444]' : 'text-[#f59e0b]'}`}
          />
        </div>
        <h3 className='text-base font-semibold text-white mb-1'>{title}</h3>
        <p className='text-sm text-[#94a3b8] mb-5'>{body}</p>
        <div className='flex gap-3 justify-end'>
          <Button
            variant='outline'
            size='sm'
            onClick={onCancel}
            disabled={loading}
            className='border-[#1f2937] text-[#94a3b8] bg-transparent hover:bg-[#1a1d23] hover:text-white'
          >
            Cancel
          </Button>
          <Button
            size='sm'
            className={
              danger
                ? 'bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 hover:bg-[#ef4444]/20'
                : 'bg-[#00ff88] text-black hover:bg-[#00ff88]/90'
            }
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <Loader2 className='h-3.5 w-3.5 mr-1.5 animate-spin' />}
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Edit / Create drawer ──────────────────────────────────────────────────────

interface DrawerProps {
  mode: 'create' | 'edit';
  user?: UserListItem | null;
  roles: Role[];
  onClose: () => void;
}

type CreateFormValues = {
  email: string;
  fullName: string;
  phone: string;
  password: string;
  department: string;
  isSuperuser: boolean;
  roleIds: string[];
};

type EditFormValues = {
  fullName: string;
  phone: string;
  department: string;
  roleIds: string[];
};

function UserDrawer({ mode, user, roles, onClose }: DrawerProps) {
  const createMut = useCreateUser();
  const updateMut = useUpdateUser(user?.id ?? '');
  const rolesMut = useAssignRoles(user?.id ?? '');
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateFormValues & EditFormValues>({
    defaultValues: {
      email: '',
      fullName: user?.fullName ?? '',
      phone: '',
      password: '',
      department: user?.department ?? '',
      isSuperuser: user?.isSuperuser ?? false,
      roleIds: user?.roles
        ? roles.filter(r => user.roles.includes(r.name)).map(r => r.id)
        : [],
    },
  });
  const selectedRoleIds: string[] = watch('roleIds') ?? [];
  function toggleRole(id: string) {
    const current = selectedRoleIds;
    setValue(
      'roleIds',
      current.includes(id) ? current.filter(x => x !== id) : [...current, id],
    );
  }
  const isLoading =
    createMut.isPending || updateMut.isPending || rolesMut.isPending;

  async function onSubmit(values: CreateFormValues & EditFormValues) {
    try {
      if (mode === 'create') {
        await createMut.mutateAsync({
          email: values.email,
          fullName: values.fullName,
          phone: values.phone || undefined,
          password: values.password,
          roleIds: values.roleIds,
          isSuperuser: values.isSuperuser,
          department: values.department || undefined,
        });
        toast.success('User created successfully.');
      } else {
        await updateMut.mutateAsync({
          fullName: values.fullName,
          phone: values.phone || undefined,
          department: values.department || undefined,
        });
        await rolesMut.mutateAsync({ roleIds: values.roleIds });
        toast.success('Profile updated successfully.');
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(msg);
    }
  }

  return (
    <div className='fixed inset-0 z-40 flex justify-end'>
      <div className='absolute inset-0 bg-black/60' onClick={onClose} />
      <div className='relative bg-[#0d0f12] w-full max-w-md h-full flex flex-col shadow-2xl overflow-hidden border-l border-[#1f2937]'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-[#1f2937]'>
          <div className='flex items-center gap-2'>
            {mode === 'create' ? (
              <Plus className='h-4 w-4 text-[#00ff88]' />
            ) : (
              <Edit2 className='h-4 w-4 text-[#00ff88]' />
            )}
            <h2 className='font-semibold text-white'>
              {mode === 'create' ? 'Add New User' : `Edit — ${user?.fullName}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className='text-[#64748b] hover:text-white transition-colors'
          >
            <X className='h-5 w-5' />
          </button>
        </div>
        {/* Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex-1 overflow-y-auto px-6 py-5 space-y-5'
        >
          {/* Full name */}
          <div>
            <Label
              htmlFor='fullName'
              className='text-sm font-medium text-[#94a3b8]'
            >
              Full Name *
            </Label>
            <Input
              id='fullName'
              className='mt-1 bg-[#1a1d23] border-[#1f2937] text-white placeholder-[#64748b] focus:border-[#00ff88]/50'
              placeholder='e.g. Amina Odhiambo'
              {...register('fullName', {
                required: 'Full name is required',
                minLength: { value: 2, message: 'Min 2 characters' },
              })}
            />
            {errors.fullName && (
              <p className='text-xs text-[#ef4444] mt-1'>
                {errors.fullName.message}
              </p>
            )}
          </div>
          {/* Email — create only */}
          {mode === 'create' && (
            <div>
              <Label
                htmlFor='email'
                className='text-sm font-medium text-[#94a3b8]'
              >
                Email Address *
              </Label>
              <Input
                id='email'
                type='email'
                className='mt-1 bg-[#1a1d23] border-[#1f2937] text-white placeholder-[#64748b] focus:border-[#00ff88]/50'
                placeholder='amina@sha.go.ke'
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email',
                  },
                })}
              />
              {errors.email && (
                <p className='text-xs text-[#ef4444] mt-1'>
                  {errors.email.message}
                </p>
              )}
            </div>
          )}
          {/* Password — create only */}
          {mode === 'create' && (
            <div>
              <Label
                htmlFor='password'
                className='text-sm font-medium text-[#94a3b8]'
              >
                Temporary Password *
              </Label>
              <Input
                id='password'
                type='password'
                className='mt-1 bg-[#1a1d23] border-[#1f2937] text-white placeholder-[#64748b] focus:border-[#00ff88]/50'
                placeholder='Minimum 8 characters'
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Minimum 8 characters' },
                })}
              />
              {errors.password && (
                <p className='text-xs text-[#ef4444] mt-1'>
                  {errors.password.message}
                </p>
              )}
              <p className='text-xs text-[#64748b] mt-1'>
                User will be prompted to change this on first login.
              </p>
            </div>
          )}
          {/* Phone */}
          <div>
            <Label
              htmlFor='phone'
              className='text-sm font-medium text-[#94a3b8]'
            >
              Phone
            </Label>
            <Input
              id='phone'
              className='mt-1 bg-[#1a1d23] border-[#1f2937] text-white placeholder-[#64748b]'
              placeholder='+254 7XX XXX XXX'
              {...register('phone')}
            />
          </div>
          {/* Department */}
          <div>
            <Label
              htmlFor='department'
              className='text-sm font-medium text-[#94a3b8]'
            >
              Department
            </Label>
            <select
              id='department'
              className='mt-1 w-full rounded-md border border-[#1f2937] bg-[#1a1d23] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#00ff88]/30'
              {...register('department')}
            >
              <option value=''>— Select department —</option>
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          {/* Superuser toggle — create only */}
          {mode === 'create' && (
            <div className='flex items-center gap-3 p-3 bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-lg'>
              <input
                id='isSuperuser'
                type='checkbox'
                className='h-4 w-4 rounded border-[#1f2937] text-[#ef4444] focus:ring-[#ef4444]/30 bg-[#1a1d23]'
                {...register('isSuperuser')}
              />
              <div>
                <Label
                  htmlFor='isSuperuser'
                  className='text-sm font-medium text-[#ef4444] cursor-pointer'
                >
                  Grant Superuser Access
                </Label>
                <p className='text-xs text-[#ef4444]/70'>
                  Superusers bypass all permission checks. Use sparingly.
                </p>
              </div>
            </div>
          )}
          {/* Roles */}
          <div>
            <Label className='text-sm font-medium text-[#94a3b8] mb-2 block'>
              Roles
            </Label>
            {roles.length === 0 ? (
              <p className='text-xs text-[#64748b]'>No roles available</p>
            ) : (
              <div className='space-y-2'>
                {roles.map(role => {
                  const checked = selectedRoleIds.includes(role.id);
                  return (
                    <label
                      key={role.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        checked
                          ? 'bg-[#00ff88]/5 border-[#00ff88]/30'
                          : 'bg-[#1a1d23] border-[#1f2937] hover:border-[#2d3748]'
                      }`}
                    >
                      <input
                        type='checkbox'
                        checked={checked}
                        onChange={() => toggleRole(role.id)}
                        className='mt-0.5 h-4 w-4 rounded border-[#1f2937] text-[#00ff88] focus:ring-[#00ff88]/30 bg-[#0d0f12]'
                      />
                      <div className='flex-1 min-w-0'>
                        <p
                          className={`text-sm font-medium ${checked ? 'text-[#00ff88]' : 'text-white'}`}
                        >
                          {role.displayName ?? role.name}
                        </p>
                        {role.description && (
                          <p className='text-xs text-[#64748b] mt-0.5 truncate'>
                            {role.description}
                          </p>
                        )}
                        <p className='text-xs text-[#64748b] mt-0.5'>
                          {role.permissions.length} permission
                          {role.permissions.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </form>
        {/* Footer */}
        <div className='px-6 py-4 border-t border-[#1f2937] flex justify-end gap-3 bg-[#0d0f12]'>
          <Button
            variant='outline'
            onClick={onClose}
            disabled={isLoading}
            className='border-[#1f2937] text-[#94a3b8] bg-transparent hover:bg-[#1a1d23] hover:text-white'
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className='min-w-25 bg-[#00ff88] text-black hover:bg-[#00ff88]/90'
          >
            {isLoading && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
            {mode === 'create' ? 'Create User' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [page, setPage] = useState(1);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | null>(null);
  const [editTarget, setEditTarget] = useState<UserListItem | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'deactivate' | 'reactivate';
    user: UserListItem;
  } | null>(null);

  const PAGE_SIZE = 15;

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);
  const { data, isLoading, isFetching } = useUsers({
    page,
    pageSize: PAGE_SIZE,
    isActive: filterActive,
    search: debouncedSearch || undefined,
  });
  const { data: roles = [] } = useRoles();
  const deactivateMut = useDeactivateUser();
  const reactivateMut = useReactivateUser();
  async function handleConfirm() {
    if (!confirmAction) return;
    try {
      if (confirmAction.type === 'deactivate') {
        await deactivateMut.mutateAsync(confirmAction.user.id);
        toast.success('User deactivated successfully.');
      } else {
        await reactivateMut.mutateAsync(confirmAction.user.id);
        toast.success('User reactivated successfully.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(msg);
    } finally {
      setConfirmAction(null);
    }
  }
  const users = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.pages ?? 1;
  const isConfirmLoading = deactivateMut.isPending || reactivateMut.isPending;
  return (
    <>
      <div className='space-y-6'>
        {/* Page header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-white'>User Management</h1>
            <p className='text-[#94a3b8] mt-1 text-sm'>
              Manage system users, roles, and access permissions
            </p>
          </div>
          <Button
            onClick={() => {
              setEditTarget(null);
              setDrawerMode('create');
            }}
            className='bg-[#00ff88] text-black hover:bg-[#00ff88]/90 flex items-center gap-2'
          >
            <Plus className='h-4 w-4' />
            Add User
          </Button>
        </div>
        {/* Summary cards */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {[
            {
              label: 'Total Users',
              value: isLoading ? '—' : total.toLocaleString(),
              icon: Users,
              accent: '#3b82f6',
            },
            {
              label: 'Active',
              value: isLoading
                ? '—'
                : (data?.items
                    .filter(u => u.isActive)
                    .length.toLocaleString() ?? '—'),
              icon: UserCheck,
              accent: '#00ff88',
            },
            {
              label: 'Inactive',
              value: isLoading
                ? '—'
                : (data?.items
                    .filter(u => !u.isActive)
                    .length.toLocaleString() ?? '—'),
              icon: UserMinus,
              accent: '#ef4444',
            },
          ].map(s => (
            <Card
              key={s.label}
              className='bg-[#121418] border-[#1f2937] p-5 flex items-center gap-4'
            >
              <div
                className='p-2.5 rounded-lg'
                style={{ backgroundColor: `${s.accent}15` }}
              >
                <s.icon className='h-5 w-5' style={{ color: s.accent }} />
              </div>
              <div>
                <p className='text-xs text-[#64748b] font-medium uppercase tracking-wide'>
                  {s.label}
                </p>
                <p className='text-2xl font-bold text-white font-mono'>
                  {s.value}
                </p>
              </div>
            </Card>
          ))}
        </div>
        {/* Filters + search */}
        <Card className='bg-[#121418] border-[#1f2937] p-4'>
          <div className='flex flex-col sm:flex-row gap-3'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b]' />
              <Input
                className='pl-9 bg-[#1a1d23] border-[#1f2937] text-white placeholder-[#64748b]'
                placeholder='Search by name or email…'
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-white'
                >
                  <X className='h-4 w-4' />
                </button>
              )}
            </div>
            <div className='flex rounded-md border border-[#1f2937] overflow-hidden shrink-0'>
              {(
                [
                  { label: 'All', value: null },
                  { label: 'Active', value: true },
                  { label: 'Inactive', value: false },
                ] as const
              ).map(opt => (
                <button
                  key={String(opt.value)}
                  onClick={() => {
                    setFilterActive(opt.value);
                    setPage(1);
                  }}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    filterActive === opt.value
                      ? 'bg-[#00ff88] text-black'
                      : 'bg-[#1a1d23] text-[#94a3b8] hover:bg-[#1f2937] hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </Card>
        {/* User table */}
        <Card className='bg-[#121418] border-[#1f2937] overflow-hidden'>
          {/* Table header */}
          <div className='grid grid-cols-[auto_1fr_1fr_1fr_auto_auto] items-center gap-x-4 px-4 py-3 border-b border-[#1f2937] bg-[#0d0f12] text-xs font-semibold text-[#64748b] uppercase tracking-wide'>
            <span className='w-9' />
            <span>User</span>
            <span>Department / Roles</span>
            <span>Last Login</span>
            <span>Status</span>
            <span className='text-right pr-1'>Actions</span>
          </div>
          {/* Loading skeleton */}
          {isLoading && (
            <div className='divide-y divide-[#1f2937]'>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className='grid grid-cols-[auto_1fr_1fr_1fr_auto_auto] items-center gap-x-4 px-4 py-3.5 animate-pulse'
                >
                  <div className='w-9 h-9 bg-[#1a1d23] rounded-full' />
                  <div className='space-y-1.5'>
                    <div className='h-3.5 bg-[#1a1d23] rounded w-32' />
                    <div className='h-3 bg-[#1f2937] rounded w-44' />
                  </div>
                  <div className='h-3 bg-[#1a1d23] rounded w-28' />
                  <div className='h-3 bg-[#1a1d23] rounded w-24' />
                  <div className='h-5 bg-[#1a1d23] rounded-full w-16' />
                  <div className='h-7 bg-[#1a1d23] rounded w-20' />
                </div>
              ))}
            </div>
          )}
          {/* Empty state */}
          {!isLoading && users.length === 0 && (
            <div className='py-16 text-center'>
              <Users className='h-12 w-12 text-[#1f2937] mx-auto mb-3' />
              <p className='text-[#64748b] text-sm'>No users found</p>
              {(search || filterActive !== null) && (
                <p className='text-[#64748b] text-xs mt-1'>
                  Try clearing your search or filter
                </p>
              )}
            </div>
          )}
          {/* Rows */}
          {!isLoading && users.length > 0 && (
            <div
              className={`divide-y divide-[#1f2937] ${isFetching ? 'opacity-60' : ''} transition-opacity`}
            >
              {users.map(user => (
                <div
                  key={user.id}
                  className='grid grid-cols-[auto_1fr_1fr_1fr_auto_auto] items-center gap-x-4 px-4 py-3.5 hover:bg-[#1a1d23] transition-colors'
                >
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor(user.id)} ${!user.isActive ? 'opacity-40' : ''}`}
                  >
                    {initials(user.fullName)}
                  </div>
                  {/* Name + email */}
                  <div className='min-w-0'>
                    <div className='flex items-center gap-1.5'>
                      <span
                        className={`text-sm font-medium truncate ${!user.isActive ? 'text-[#64748b]' : 'text-white'}`}
                      >
                        {user.fullName}
                      </span>
                      {user.isSuperuser && (
                        <Shield className='h-3.5 w-3.5 text-[#ef4444] shrink-0' />
                      )}
                    </div>
                    <p className='text-xs text-[#64748b] truncate'>
                      {user.email}
                    </p>
                  </div>
                  {/* Department + roles */}
                  <div className='min-w-0'>
                    {user.department && (
                      <p className='text-xs text-[#64748b] mb-1 truncate'>
                        {user.department}
                      </p>
                    )}
                    <div className='flex flex-wrap gap-1'>
                      {user.roles.slice(0, 2).map(r => (
                        <RoleBadge key={r} name={r} />
                      ))}
                      {user.roles.length > 2 && (
                        <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-[#1a1d23] text-[#64748b] border border-[#1f2937]'>
                          +{user.roles.length - 2}
                        </span>
                      )}
                      {user.roles.length === 0 && (
                        <span className='text-xs text-[#64748b] italic'>
                          No roles
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Last login */}
                  <div>
                    {user.lastLoginAt ? (
                      <p className='text-xs text-[#94a3b8] font-mono'>
                        {formatDateTime(new Date(user.lastLoginAt))}
                      </p>
                    ) : (
                      <p className='text-xs text-[#64748b] italic'>Never</p>
                    )}
                  </div>
                  {/* Status badge */}
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        user.isActive
                          ? 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20'
                          : 'bg-[#1a1d23] text-[#64748b] border-[#1f2937]'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.isActive ? 'bg-[#00ff88]' : 'bg-[#64748b]'}`}
                      />
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {/* Actions */}
                  <div className='flex items-center gap-1 justify-end'>
                    <button
                      onClick={() => {
                        setEditTarget(user);
                        setDrawerMode('edit');
                      }}
                      className='p-1.5 rounded-md text-[#64748b] hover:text-[#3b82f6] hover:bg-[#3b82f6]/10 transition-colors'
                      title='Edit user'
                    >
                      <Edit2 className='h-3.5 w-3.5' />
                    </button>
                    {user.isActive ? (
                      <button
                        onClick={() =>
                          setConfirmAction({ type: 'deactivate', user })
                        }
                        className='p-1.5 rounded-md text-[#64748b] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors'
                        title='Deactivate user'
                      >
                        <ShieldOff className='h-3.5 w-3.5' />
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          setConfirmAction({ type: 'reactivate', user })
                        }
                        className='p-1.5 rounded-md text-[#64748b] hover:text-[#00ff88] hover:bg-[#00ff88]/10 transition-colors'
                        title='Reactivate user'
                      >
                        <KeyRound className='h-3.5 w-3.5' />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Pagination footer */}
          {!isLoading && total > PAGE_SIZE && (
            <div className='flex items-center justify-between px-4 py-3 border-t border-[#1f2937] bg-[#0d0f12]'>
              <p className='text-xs text-[#64748b]'>
                Showing {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, total)} of{' '}
                <span className='font-medium text-[#94a3b8]'>
                  {total.toLocaleString()}
                </span>{' '}
                users
              </p>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1 || isFetching}
                  className='p-1.5 rounded-md border border-[#1f2937] text-[#94a3b8] hover:bg-[#1a1d23] disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
                >
                  <ChevronLeft className='h-4 w-4' />
                </button>
                <span className='text-xs text-[#94a3b8] font-medium px-1'>
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || isFetching}
                  className='p-1.5 rounded-md border border-[#1f2937] text-[#94a3b8] hover:bg-[#1a1d23] disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
                >
                  <ChevronRight className='h-4 w-4' />
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
      {drawerMode && (
        <UserDrawer
          mode={drawerMode}
          user={editTarget}
          roles={roles}
          onClose={() => {
            setDrawerMode(null);
            setEditTarget(null);
          }}
        />
      )}
      <ConfirmDialog
        open={!!confirmAction}
        title={
          confirmAction?.type === 'deactivate'
            ? `Deactivate ${confirmAction.user.fullName}?`
            : `Reactivate ${confirmAction?.user.fullName}?`
        }
        body={
          confirmAction?.type === 'deactivate'
            ? 'This user will no longer be able to log in. Their data is preserved and the account can be reactivated at any time.'
            : 'This user will regain access with their existing roles and permissions.'
        }
        confirmLabel={
          confirmAction?.type === 'deactivate' ? 'Deactivate' : 'Reactivate'
        }
        danger={confirmAction?.type === 'deactivate'}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
        loading={isConfirmLoading}
      />
    </>
  );
}
