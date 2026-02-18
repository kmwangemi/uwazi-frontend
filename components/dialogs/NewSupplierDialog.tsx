'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { KENYA_COUNTIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, FileText, Upload, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// ─── Constants (move to /lib/constants.ts) ────────────────────────────────────

const BUSINESS_TYPES = [
  'Sole Proprietorship',
  'Private Limited Company (Ltd)',
  'Public Limited Company (PLC)',
  'Partnership',
  'Limited Liability Partnership (LLP)',
  'NGO / Non-Profit',
  'Co-operative Society',
  'State Corporation',
];

const SUPPLIER_CATEGORIES = [
  'Supply of Goods – General',
  'Supply of Goods – ICT & Electronics',
  'Supply of Goods – Medical & Pharmaceuticals',
  'Supply of Goods – Stationery & Office Supplies',
  'Supply of Goods – Furniture & Fittings',
  'Works – Civil & Construction (NCA)',
  'Works – Electrical & Mechanical',
  'Works – Repairs & Maintenance',
  'Non-Consultancy Services – Cleaning & Facilities',
  'Non-Consultancy Services – Security',
  'Non-Consultancy Services – Catering',
  'Non-Consultancy Services – Transport & Logistics',
  'Non-Consultancy Services – Printing & Publishing',
  'Consultancy Services – Legal',
  'Consultancy Services – ICT & Systems',
  'Consultancy Services – Financial & Audit',
  'Consultancy Services – Engineering',
  'Consultancy Services – Human Resource',
  'Air Ticketing & Travel Services',
  'Insurance Services',
  'Other',
];

const AGPO_GROUPS = [
  'Not Applicable',
  'Youth Enterprise (Under 35)',
  'Women Enterprise',
  'Persons with Disability (PwD)',
];

// File upload config
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
];
const ACCEPTED_FILE_EXTENSIONS = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png';
const MAX_FILE_SIZE_MB = 10;
const MAX_FILES = 8;

const FILE_LABELS = [
  'Certificate of Incorporation / Business Registration',
  'Valid Tax Compliance Certificate (KRA)',
  'CR12 / CR13 – Directorship Details',
  'Valid Trade License / Business Permit',
  'AGPO Certificate (if applicable)',
  'NCA Certificate (if applicable)',
  'Audited Financial Statements',
  'Other Supporting Document',
];

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const supplierSchema = z.object({
  // Identity
  name: z.string().min(2, 'Company name is required'),
  businessType: z.string().min(1, 'Business type is required'),
  registrationNumber: z
    .string()
    .min(3, 'Registration number is required')
    .regex(/^[A-Z0-9\/\-]+$/i, 'e.g. PVT0123456 or CPR/2024/123456'),
  taxNumber: z
    .string()
    .regex(/^[A-Z][0-9]{9}[A-Z]$/i, 'KRA PIN format: A000000000A')
    .or(z.literal('')),
  yearRegistered: z
    .string()
    .regex(/^\d{4}$/, 'Enter a 4-digit year')
    .refine(
      y => +y >= 1900 && +y <= new Date().getFullYear(),
      'Enter a valid year',
    ),

  // Classification
  category: z.string().min(1, 'At least one supply category is required'),
  agpoGroup: z.string().min(1, 'Select an AGPO status'),
  agpoCertNumber: z.string().optional(),

  // Contact
  email: z.string().email('Enter a valid email').or(z.literal('')),
  phone: z
    .string()
    .regex(/^(\+254|0)[0-9]{9}$/, 'Format: +2547XXXXXXXX or 07XXXXXXXX')
    .or(z.literal('')),
  county: z.string().min(1, 'County is required'),
  physicalAddress: z.string().optional(),
  postalAddress: z.string().optional(),

  // Authorised representative
  contactPersonName: z.string().min(2, 'Contact person name is required'),
  contactPersonTitle: z.string().optional(),

  // Compliance declaration
  declarationAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the compliance declaration' }),
  }),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface AttachedFile {
  id: string;
  file: File;
  label: string;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className='flex items-center gap-1 text-xs text-destructive mt-1'>
      <AlertCircle className='h-3 w-3 flex-shrink-0' />
      {message}
    </p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2'>
      {children}
    </h3>
  );
}

// ─── File Attachment Section ──────────────────────────────────────────────────

function FileAttachmentSection({
  files,
  onChange,
}: {
  files: AttachedFile[];
  onChange: (files: AttachedFile[]) => void;
}) {
  const [dragging, setDragging] = useState(false);

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      const valid: AttachedFile[] = [];
      const errors: string[] = [];

      Array.from(incoming).forEach(file => {
        if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
          errors.push(`"${file.name}" — unsupported format`);
          return;
        }
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          errors.push(`"${file.name}" — exceeds ${MAX_FILE_SIZE_MB}MB`);
          return;
        }
        if (files.length + valid.length >= MAX_FILES) {
          errors.push(`Max ${MAX_FILES} files allowed`);
          return;
        }
        valid.push({
          id: `${Date.now()}-${Math.random()}`,
          file,
          label:
            FILE_LABELS[files.length + valid.length] ??
            'Other Supporting Document',
        });
      });

      errors.forEach(e => toast.error(e));
      if (valid.length) onChange([...files, ...valid]);
    },
    [files, onChange],
  );

  const removeFile = (id: string) => onChange(files.filter(f => f.id !== id));
  const updateLabel = (id: string, label: string) =>
    onChange(files.map(f => (f.id === id ? { ...f, label } : f)));
  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(0)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <div className='space-y-3'>
      <label
        htmlFor='supplier-file-upload'
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 cursor-pointer transition-colors',
          files.length >= MAX_FILES && 'pointer-events-none opacity-50',
          dragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/40',
        )}
        onDragOver={e => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
      >
        <Upload
          className={cn(
            'h-8 w-8',
            dragging ? 'text-primary' : 'text-muted-foreground',
          )}
        />
        <div className='text-center'>
          <p className='text-sm font-medium'>
            Drop files here or{' '}
            <span className='text-primary underline underline-offset-2'>
              browse
            </span>
          </p>
          <p className='text-xs text-muted-foreground mt-0.5'>
            PDF, Word, Excel, JPG/PNG · max {MAX_FILE_SIZE_MB}MB each · up to{' '}
            {MAX_FILES} files
          </p>
        </div>
        <input
          id='supplier-file-upload'
          type='file'
          multiple
          accept={ACCEPTED_FILE_EXTENSIONS}
          className='sr-only'
          onChange={e => {
            addFiles(e.target.files);
            e.target.value = '';
          }}
          disabled={files.length >= MAX_FILES}
        />
      </label>

      {files.length > 0 && (
        <ul className='space-y-2'>
          {files.map(f => (
            <li
              key={f.id}
              className='flex items-start gap-3 rounded-md border bg-muted/30 px-3 py-2.5'
            >
              <FileText className='h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0' />
              <div className='flex-1 min-w-0 space-y-1.5'>
                <p className='text-sm font-medium truncate' title={f.file.name}>
                  {f.file.name}
                  <span className='ml-2 text-xs font-normal text-muted-foreground'>
                    {formatSize(f.file.size)}
                  </span>
                </p>
                <select
                  value={f.label}
                  onChange={e => updateLabel(f.id, e.target.value)}
                  className='w-full text-xs px-2 py-1 rounded border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring'
                >
                  {FILE_LABELS.map(l => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type='button'
                onClick={() => removeFile(f.id)}
                className='text-muted-foreground hover:text-destructive transition-colors flex-shrink-0 mt-0.5'
                aria-label={`Remove ${f.file.name}`}
              >
                <X className='h-4 w-4' />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Main Dialog ──────────────────────────────────────────────────────────────

interface NewSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (
    supplier: SupplierFormValues & { attachments: AttachedFile[] },
  ) => void;
}

export function NewSupplierDialog({
  open,
  onOpenChange,
  onSubmit,
}: NewSupplierDialogProps) {
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: '',
      businessType: '',
      registrationNumber: '',
      taxNumber: '',
      yearRegistered: new Date().getFullYear().toString(),
      category: '',
      agpoGroup: '',
      agpoCertNumber: '',
      email: '',
      phone: '',
      county: '',
      physicalAddress: '',
      postalAddress: '',
      contactPersonName: '',
      contactPersonTitle: '',
      declarationAccepted: undefined,
    },
  });

  const agpoGroup = watch('agpoGroup');
  const isAgpo = agpoGroup && agpoGroup !== 'Not Applicable';

  const onValidSubmit = async (data: SupplierFormValues) => {
    try {
      onSubmit?.({ ...data, attachments });
      toast.success('Supplier added successfully');
      reset();
      setAttachments([]);
      onOpenChange(false);
    } catch {
      toast.error('Failed to add supplier');
    }
  };

  const handleClose = () => {
    reset();
    setAttachments([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Add New Supplier</DialogTitle>
          <DialogDescription>
            Register a new supplier in compliance with the{' '}
            <span className='font-medium text-foreground'>PPRA Act 2015</span>.
            Fields marked * are required.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onValidSubmit)}
          className='space-y-6'
          noValidate
        >
          {/* ── Company Identity ──────────────────────────────────────────── */}
          <div className='space-y-4'>
            <SectionHeading>Company Identity</SectionHeading>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Company Name *</Label>
                <Input
                  id='name'
                  placeholder='e.g. Acme Supplies Ltd'
                  {...register('name')}
                  className={cn(
                    errors.name &&
                      'border-destructive focus-visible:ring-destructive',
                  )}
                />
                <FieldError message={errors.name?.message} />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='businessType'>Business Type *</Label>
                <Controller
                  name='businessType'
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id='businessType'
                        className={cn(
                          errors.businessType && 'border-destructive',
                        )}
                      >
                        <SelectValue placeholder='Select type' />
                      </SelectTrigger>
                      <SelectContent>
                        {BUSINESS_TYPES.map(t => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.businessType?.message} />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='registrationNumber'>
                  Registration Number *
                </Label>
                <Input
                  id='registrationNumber'
                  placeholder='e.g. PVT0123456'
                  {...register('registrationNumber')}
                  className={cn(
                    errors.registrationNumber &&
                      'border-destructive focus-visible:ring-destructive',
                  )}
                />
                <FieldError message={errors.registrationNumber?.message} />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='taxNumber'>
                  KRA PIN *{' '}
                  <span className='text-xs text-muted-foreground font-normal'>
                    (A000000000A)
                  </span>
                </Label>
                <Input
                  id='taxNumber'
                  placeholder='e.g. A000123456A'
                  {...register('taxNumber')}
                  className={cn(
                    errors.taxNumber &&
                      'border-destructive focus-visible:ring-destructive',
                  )}
                />
                <FieldError message={errors.taxNumber?.message} />
              </div>
            </div>

            <div className='w-1/2 pr-2'>
              <div className='space-y-2'>
                <Label htmlFor='yearRegistered'>Year Registered *</Label>
                <Input
                  id='yearRegistered'
                  type='number'
                  placeholder={new Date().getFullYear().toString()}
                  {...register('yearRegistered')}
                  className={cn(
                    errors.yearRegistered &&
                      'border-destructive focus-visible:ring-destructive',
                  )}
                />
                <FieldError message={errors.yearRegistered?.message} />
              </div>
            </div>
          </div>

          {/* ── Supply Classification ─────────────────────────────────────── */}
          <div className='space-y-4'>
            <SectionHeading>Supply Classification</SectionHeading>

            <div className='space-y-2'>
              <Label htmlFor='category'>Supply Category *</Label>
              <Controller
                name='category'
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id='category'
                      className={cn(errors.category && 'border-destructive')}
                    >
                      <SelectValue placeholder='Select primary category' />
                    </SelectTrigger>
                    <SelectContent className='max-h-64'>
                      {SUPPLIER_CATEGORIES.map(c => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError message={errors.category?.message} />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='agpoGroup'>AGPO Status *</Label>
                <Controller
                  name='agpoGroup'
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id='agpoGroup'
                        className={cn(errors.agpoGroup && 'border-destructive')}
                      >
                        <SelectValue placeholder='Select AGPO status' />
                      </SelectTrigger>
                      <SelectContent>
                        {AGPO_GROUPS.map(g => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.agpoGroup?.message} />
              </div>

              {isAgpo && (
                <div className='space-y-2'>
                  <Label htmlFor='agpoCertNumber'>
                    AGPO Certificate No.{' '}
                    <span className='text-xs text-muted-foreground font-normal'>
                      (required for AGPO)
                    </span>
                  </Label>
                  <Input
                    id='agpoCertNumber'
                    placeholder='e.g. AGPO/2024/00123'
                    {...register('agpoCertNumber')}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── Contact Details ───────────────────────────────────────────── */}
          <div className='space-y-4'>
            <SectionHeading>Contact Details</SectionHeading>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email Address *</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='supplier@example.com'
                  {...register('email')}
                  className={cn(
                    errors.email &&
                      'border-destructive focus-visible:ring-destructive',
                  )}
                />
                <FieldError message={errors.email?.message} />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='phone'>Phone Number *</Label>
                <Input
                  id='phone'
                  placeholder='+254 7XX XXX XXX'
                  {...register('phone')}
                  className={cn(
                    errors.phone &&
                      'border-destructive focus-visible:ring-destructive',
                  )}
                />
                <FieldError message={errors.phone?.message} />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='county'>County *</Label>
              <Controller
                name='county'
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id='county'
                      className={cn(errors.county && 'border-destructive')}
                    >
                      <SelectValue placeholder='Select county' />
                    </SelectTrigger>
                    <SelectContent className='max-h-64'>
                      {KENYA_COUNTIES.map(county => (
                        <SelectItem key={county} value={county}>
                          {county}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError message={errors.county?.message} />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='physicalAddress'>Physical Address</Label>
                <Input
                  id='physicalAddress'
                  placeholder='e.g. 2nd Floor, ABC House, Kimathi St'
                  {...register('physicalAddress')}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='postalAddress'>Postal Address</Label>
                <Input
                  id='postalAddress'
                  placeholder='e.g. P.O. Box 12345-00100, Nairobi'
                  {...register('postalAddress')}
                />
              </div>
            </div>
          </div>

          {/* ── Authorised Representative ─────────────────────────────────── */}
          <div className='space-y-4'>
            <SectionHeading>Authorised Representative</SectionHeading>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='contactPersonName'>Full Name *</Label>
                <Input
                  id='contactPersonName'
                  placeholder='Name of authorised signatory'
                  {...register('contactPersonName')}
                  className={cn(
                    errors.contactPersonName &&
                      'border-destructive focus-visible:ring-destructive',
                  )}
                />
                <FieldError message={errors.contactPersonName?.message} />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='contactPersonTitle'>Title / Designation</Label>
                <Input
                  id='contactPersonTitle'
                  placeholder='e.g. Managing Director, CEO'
                  {...register('contactPersonTitle')}
                />
              </div>
            </div>
          </div>

          {/* ── Document Attachments ──────────────────────────────────────── */}
          <div className='space-y-4'>
            <SectionHeading>Document Attachments</SectionHeading>
            <p className='text-xs text-muted-foreground -mt-1'>
              Upload mandatory documents per PPRA requirements: Certificate of
              Incorporation, Tax Compliance Certificate, CR12/CR13, Trade
              License, and AGPO certificate where applicable.
            </p>
            <FileAttachmentSection
              files={attachments}
              onChange={setAttachments}
            />
          </div>

          {/* ── Compliance Declaration ────────────────────────────────────── */}
          <div
            className={cn(
              'rounded-md border p-4',
              errors.declarationAccepted
                ? 'border-destructive bg-destructive/5'
                : 'bg-muted/50',
            )}
          >
            <label className='flex items-start gap-3 cursor-pointer'>
              <input
                type='checkbox'
                {...register('declarationAccepted')}
                className='mt-0.5 h-4 w-4 rounded border-input accent-primary flex-shrink-0'
              />
              <span className='text-sm text-muted-foreground leading-relaxed'>
                I confirm the information provided is true and accurate. This
                firm is not debarred by the{' '}
                <span className='font-medium text-foreground'>
                  Public Procurement Regulatory Authority (PPRA)
                </span>
                , is tax-compliant with{' '}
                <span className='font-medium text-foreground'>
                  Kenya Revenue Authority (KRA)
                </span>
                , and has not engaged in corrupt or collusive practices per the{' '}
                <span className='font-medium text-foreground'>
                  Anti-Corruption &amp; Economic Crimes Act, 2003
                </span>
                . *
              </span>
            </label>
            <FieldError message={errors.declarationAccepted?.message} />
          </div>
          {/* ── Actions ───────────────────────────────────────────────────── */}
          <div className='flex gap-3 justify-end pt-4 border-t'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Supplier'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
