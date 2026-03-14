'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRegister } from '@/lib/queries/useAuthQueries';
import { registerSchema, type RegisterFormValues } from '@/lib/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface RegisterFormProps {
  onSuccess?: (email: string) => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { mutate: register, isPending, isError, isSuccess } = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      full_name: '',
      password: '',
      confirm_password: '',
      role: 'viewer',
      organization: '',
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    register(data, {
      onSuccess: () => {
        onSuccess?.(data.email);
        form.reset();
      },
    });
  };

  // ── Success ───────────────────────────────────────────────────────────────

  if (isSuccess) {
    return (
      <div className='text-center space-y-4'>
        <CheckCircle2 className='w-16 h-16 text-[#00ff88] mx-auto' />
        <h3 className='text-xl font-semibold text-white'>Account Created</h3>
        <p className='text-[#94a3b8]'>
          User has been successfully registered. They will receive a welcome
          email with login instructions.
        </p>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        {/* API Error */}
        {isError && (
          <div className='p-3 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded flex gap-2'>
            <AlertCircle className='w-5 h-5 text-[#ef4444] shrink-0 mt-0.5' />
            <p className='text-sm text-[#ef4444]'>
              Registration failed. Please try again.
            </p>
          </div>
        )}
        <FormField
          control={form.control}
          name='full_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white'>Full Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder='John Doe'
                  className='bg-[#1a1d23] border-[#1f2937] text-white placeholder-[#64748b]'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white'>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type='email'
                  placeholder='john@example.com'
                  className='bg-[#1a1d23] border-[#1f2937] text-white placeholder-[#64748b]'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='organization'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white'>
                Organization (Optional)
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder='Ministry of Health'
                  className='bg-[#1a1d23] border-[#1f2937] text-white placeholder-[#64748b]'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white'>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className='bg-[#1a1d23] border-[#1f2937]'>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className='bg-[#121418] border-[#1f2937]'>
                  <SelectItem value='viewer'>
                    Viewer (Read-only access)
                  </SelectItem>
                  <SelectItem value='investigator'>
                    Investigator (Full access)
                  </SelectItem>
                  <SelectItem value='admin'>
                    Admin (Full system access)
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white'>Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type='password'
                  placeholder='••••••••'
                  className='bg-[#1a1d23] border-[#1f2937] text-white placeholder-[#64748b]'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirm_password'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white'>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type='password'
                  placeholder='••••••••'
                  className='bg-[#1a1d23] border-[#1f2937] text-white placeholder-[#64748b]'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          disabled={isPending}
          className='w-full bg-[#00ff88] text-black hover:bg-[#00ff88]/90 font-semibold'
        >
          {isPending ? (
            <>
              <Loader className='w-4 h-4 mr-2 animate-spin' />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>
    </Form>
  );
}
