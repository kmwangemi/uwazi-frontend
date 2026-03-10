'use client';

import { PasswordInput } from '@/components/password-input';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, UserPlus, X } from 'lucide-react';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Role {
  id: string;
  name: string;
  display_name: string | null;
  description: string | null;
  is_system_role: boolean;
}

interface RegisterUserPayload {
  email: string;
  full_name: string;
  phone: string;
  password: string;
  role_ids: string[];
  is_superuser: boolean;
}

interface RegisterFormValues extends RegisterUserPayload {
  confirm_password: string;
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

function useRoles() {
  return useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await apiClient.get('/roles');
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

function useRegisterUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: RegisterUserPayload) => {
      const res = await apiClient.post('/users', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const { toast } = useToast();
  const { data: roles = [], isLoading: rolesLoading } = useRoles();
  const registerUser = useRegisterUser();

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      email: '',
      full_name: '',
      phone: '',
      password: '',
      confirm_password: '',
      role_ids: [],
      is_superuser: false,
    },
  });

  const selectedRoleIds = watch('role_ids');
  const newPassword = watch('password');

  const toggleRole = (roleId: string) => {
    const current = selectedRoleIds ?? [];
    const updated = current.includes(roleId)
      ? current.filter(id => id !== roleId)
      : [...current, roleId];
    setValue('role_ids', updated, { shouldValidate: true });
  };

  const onSubmit = async (values: RegisterFormValues) => {
    const { confirm_password, ...rest } = values;
    try {
      await registerUser.mutateAsync(rest);
      reset();
      toast({
        title: 'User registered',
        description: `${values.full_name} has been added successfully.`,
      });
    } catch (err: any) {
      const detail = err?.response?.data?.detail ?? 'Failed to register user.';
      toast({ title: 'Error', description: detail, variant: 'destructive' });
    }
  };

  return (
    <Card className='p-8'>
      {/* Header */}
      <h2 className='text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2'>
        <UserPlus className='h-5 w-5' />
        Register New Supplier
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {/* API-level error banner */}
        {registerUser.isError && (
          <div className='p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3'>
            <AlertCircle className='h-5 w-5 text-red-600 shrink-0 mt-0.5' />
            <p className='text-sm font-medium text-red-900'>
              {(registerUser.error as any)?.response?.data?.detail ??
                'Failed to register user.'}
            </p>
          </div>
        )}
        {/* Full Name + Email */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <Label className='block text-sm font-medium text-gray-700 mb-1'>
              Full Name <span className='text-red-500'>*</span>
            </Label>
            <Input
              {...register('full_name', {
                required: 'Full name is required',
                minLength: { value: 2, message: 'Minimum 2 characters' },
              })}
              placeholder='Kelvin Mwas'
              disabled={registerUser.isPending}
            />
            {errors.full_name && (
              <p className='text-xs text-red-500 mt-1'>
                {errors.full_name.message}
              </p>
            )}
          </div>
          <div>
            <Label className='block text-sm font-medium text-gray-700 mb-1'>
              Email Address <span className='text-red-500'>*</span>
            </Label>
            <Input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
                },
              })}
              type='email'
              placeholder='user@procmon.go.ke'
              disabled={registerUser.isPending}
            />
            {errors.email && (
              <p className='text-xs text-red-500 mt-1'>
                {errors.email.message}
              </p>
            )}
          </div>
        </div>
        {/* Phone */}
        <div>
          <Label className='block text-sm font-medium text-gray-700 mb-1'>
            Phone Number
          </Label>
          <Input
            {...register('phone')}
            type='tel'
            placeholder='+254 712 345 678'
            disabled={registerUser.isPending}
          />
        </div>
        {/* Password + Confirm */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <Label className='block text-sm font-medium text-gray-700 mb-1'>
              Password <span className='text-red-500'>*</span>
            </Label>
            <PasswordInput
              placeholder='••••••••'
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' },
              })}
              disabled={registerUser.isPending}
              className='border-gray-300'
            />
            {errors.password && (
              <p className='text-xs text-red-500 mt-1'>
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <Label className='block text-sm font-medium text-gray-700 mb-1'>
              Confirm Password <span className='text-red-500'>*</span>
            </Label>
            <PasswordInput
              placeholder='••••••••'
              {...register('confirm_password', {
                required: 'Please confirm the password',
                validate: val =>
                  val === newPassword || 'Passwords do not match',
              })}
              disabled={registerUser.isPending}
              className='border-gray-300'
            />
            {errors.confirm_password && (
              <p className='text-xs text-red-500 mt-1'>
                {errors.confirm_password.message}
              </p>
            )}
          </div>
        </div>
        {/* Roles — toggleable badge pills */}
        <div>
          <Label className='block text-sm font-medium text-gray-700 mb-2'>
            Roles <span className='text-red-500'>*</span>
          </Label>
          {rolesLoading ? (
            <div className='flex gap-2 flex-wrap'>
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className='h-9 w-32 bg-gray-100 rounded-full animate-pulse'
                />
              ))}
            </div>
          ) : roles.length === 0 ? (
            <p className='text-sm text-gray-500'>
              No roles available. Create roles first.
            </p>
          ) : (
            <Controller
              name='role_ids'
              control={control}
              rules={{
                validate: v => v.length > 0 || 'Select at least one role',
              }}
              render={() => (
                <div className='flex flex-wrap gap-2'>
                  {roles.map(role => {
                    const selected = selectedRoleIds.includes(role.id);
                    return (
                      <button
                        key={role.id}
                        type='button'
                        onClick={() => toggleRole(role.id)}
                        title={role.description ?? role.name}
                        disabled={registerUser.isPending}
                        className={`
                          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm
                          font-medium border transition-all duration-150 select-none
                          disabled:opacity-50 disabled:cursor-not-allowed
                          ${
                            selected
                              ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                              : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600'
                          }
                        `}
                      >
                        {selected && <X className='h-3 w-3' />}
                        {role.display_name ?? role.name}
                      </button>
                    );
                  })}
                </div>
              )}
            />
          )}
          {selectedRoleIds.length > 0 && (
            <p className='text-xs text-gray-500 mt-2'>
              {selectedRoleIds.length} role
              {selectedRoleIds.length > 1 ? 's' : ''} selected
            </p>
          )}
          {errors.role_ids && (
            <p className='text-xs text-red-500 mt-1'>
              {errors.role_ids.message as string}
            </p>
          )}
        </div>
        {/* Actions */}
        <div className='pt-2'>
          <Button
            type='submit'
            className='bg-blue-600 hover:bg-blue-700 w-full'
            disabled={registerUser.isPending}
            size='lg'
          >
            {registerUser.isPending ? (
              <LoadingSpinner size='sm' text='' />
            ) : (
              'Register Supplier'
            )}
          </Button>
        </div>
      </form>
      {/* Footer link */}
      <div className='mt-6 border-t border-gray-200 pt-6 text-center'>
        <p className='text-sm text-gray-600'>
          Already have an account?{' '}
          <Link
            href='/login'
            className='text-primary font-medium hover:underline'
          >
            Sign in
          </Link>
        </p>
      </div>
    </Card>
  );
}
