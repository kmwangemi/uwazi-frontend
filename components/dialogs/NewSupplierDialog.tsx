'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { KENYA_COUNTIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Upload, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// ─── Constants ────────────────────────────────────────────────────────────────

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
  category: z.string().min(1, 'At least one supply category is required'),
  agpoGroup: z.string().min(1, 'Select an AGPO status'),
  agpoCertNumber: z.string().optional(),
  email: z.string().email('Enter a valid email').or(z.literal('')),
  phone: z
    .string()
    .regex(/^(\+254|0)[0-9]{9}$/, 'Format: +2547XXXXXXXX or 07XXXXXXXX')
    .or(z.literal('')),
  county: z.string().min(1, 'County is required'),
  physicalAddress: z.string().optional(),
  postalAddress: z.string().optional(),
  contactPersonName: z.string().min(2, 'Contact person name is required'),
  contactPersonTitle: z.string().optional(),
  declarationAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the compliance declaration' }),
  }),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

// ─── Attachment types ─────────────────────────────────────────────────────────

interface AttachedFile {
  id: string;
  file: File;
  label: string;
}

// ─── Small helpers ────────────────────────────────────────────────────────────

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
              <FileText className='h-4 w-4 text-muted-foreground mt-0.5 shrink-0' />
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
                className='text-muted-foreground hover:text-destructive transition-colors shrink-0 mt-0.5'
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

  const form = useForm<SupplierFormValues>({
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

  const agpoGroup = form.watch('agpoGroup');
  const isAgpo = agpoGroup && agpoGroup !== 'Not Applicable';

  const onValidSubmit = async (data: SupplierFormValues) => {
    try {
      onSubmit?.({ ...data, attachments });
      toast.success('Supplier added successfully');
      form.reset();
      setAttachments([]);
      onOpenChange(false);
    } catch {
      toast.error('Failed to add supplier');
    }
  };

  const handleClose = () => {
    form.reset();
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onValidSubmit)}
            className='space-y-6'
            noValidate
          >
            {/* ── Company Identity ────────────────────────────────────────── */}
            <div className='space-y-4'>
              <SectionHeading>Company Identity</SectionHeading>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g. Acme Supplies Ltd'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='businessType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Type *</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select type' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BUSINESS_TYPES.map(t => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='registrationNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Number *</FormLabel>
                      <FormControl>
                        <Input placeholder='e.g. PVT0123456' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='taxNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        KRA PIN *{' '}
                        <span className='text-xs text-muted-foreground font-normal'>
                          (A000000000A)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='e.g. A000123456A' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='w-1/2 pr-2'>
                <FormField
                  control={form.control}
                  name='yearRegistered'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year Registered *</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder={new Date().getFullYear().toString()}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* ── Supply Classification ──────────────────────────────────── */}
            <div className='space-y-4'>
              <SectionHeading>Supply Classification</SectionHeading>
              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supply Category *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select primary category' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='max-h-64'>
                        {SUPPLIER_CATEGORIES.map(c => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='agpoGroup'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>AGPO Status *</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select AGPO status' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {AGPO_GROUPS.map(g => (
                            <SelectItem key={g} value={g}>
                              {g}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isAgpo && (
                  <FormField
                    control={form.control}
                    name='agpoCertNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          AGPO Certificate No.{' '}
                          <span className='text-xs text-muted-foreground font-normal'>
                            (required for AGPO)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='e.g. AGPO/2024/00123'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
            {/* ── Contact Details ────────────────────────────────────────── */}
            <div className='space-y-4'>
              <SectionHeading>Contact Details</SectionHeading>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder='supplier@example.com'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder='+254 7XX XXX XXX' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='county'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>County *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select county' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='max-h-64'>
                        {KENYA_COUNTIES.map(county => (
                          <SelectItem key={county} value={county}>
                            {county}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='physicalAddress'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Physical Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g. 2nd Floor, ABC House, Kimathi St'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='postalAddress'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g. P.O. Box 12345-00100, Nairobi'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* ── Authorised Representative ──────────────────────────────── */}
            <div className='space-y-4'>
              <SectionHeading>Authorised Representative</SectionHeading>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='contactPersonName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Name of authorised signatory'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='contactPersonTitle'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title / Designation</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g. Managing Director, CEO'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* ── Document Attachments ───────────────────────────────────── */}
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
            {/* ── Compliance Declaration ─────────────────────────────────── */}
            <FormField
              control={form.control}
              name='declarationAccepted'
              render={({ field }) => (
                <FormItem
                  className={cn(
                    'rounded-md border p-4',
                    form.formState.errors.declarationAccepted
                      ? 'border-destructive bg-destructive/5'
                      : 'bg-muted/50',
                  )}
                >
                  <div className='flex items-start gap-3'>
                    <FormControl>
                      <input
                        type='checkbox'
                        checked={field.value === true}
                        onChange={e =>
                          field.onChange(e.target.checked ? true : undefined)
                        }
                        className='mt-0.5 h-4 w-4 rounded border-input accent-primary shrink-0'
                      />
                    </FormControl>
                    <FormLabel className='text-sm text-muted-foreground leading-relaxed font-normal cursor-pointer'>
                      I confirm the information provided is true and accurate.
                      This firm is not debarred by the{' '}
                      <span className='font-medium text-foreground'>
                        Public Procurement Regulatory Authority (PPRA)
                      </span>
                      , is tax-compliant with{' '}
                      <span className='font-medium text-foreground'>
                        Kenya Revenue Authority (KRA)
                      </span>
                      , and has not engaged in corrupt or collusive practices
                      per the{' '}
                      <span className='font-medium text-foreground'>
                        Anti-Corruption &amp; Economic Crimes Act, 2003
                      </span>
                      . *
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* ── Actions ───────────────────────────────────────────────── */}
            <div className='flex gap-3 justify-end pt-4 border-t'>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Adding...' : 'Add Supplier'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
