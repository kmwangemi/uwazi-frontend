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
import { KENYA_COUNTIES, PROCUREMENT_CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, FileText, Upload, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// ─── Constants (move to /lib/constants.ts) ────────────────────────────────────

const PROCUREMENT_METHODS = [
  'Open National Tender (ONT)',
  'Open International Tender (OIT)',
  'Restricted Tender',
  'Direct Procurement',
  'Request for Quotation (RFQ)',
  'Framework Agreement',
  'Low Value Procurement',
];

const TENDER_SECURITY_FORMS = [
  'Bank Guarantee',
  'Insurance Bond',
  'Tender-Securing Declaration (TSD)',
  'Cash Deposit',
  'Not Applicable',
];

const SOURCE_OF_FUNDS = [
  'Government of Kenya (GoK) Budget',
  'County Own Source Revenue',
  'World Bank Funded',
  'African Development Bank (AfDB)',
  'USAID / Donor Funded',
  'Other Development Partner',
];

const ENTITY_TYPES = [
  'Ministry / State Department',
  'State Corporation / Parastatal',
  'County Government',
  'Semi-Autonomous Government Agency (SAGA)',
  'Public University / Institution',
  'Constitutional Commission',
  'Other Public Entity',
];

const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
const ACCEPTED_FILE_EXTENSIONS = '.pdf,.doc,.docx,.xls,.xlsx';
const MAX_FILE_SIZE_MB = 10;
const MAX_FILES = 5;

const FILE_LABELS = [
  'Tender Notice / Advertisement',
  'Bills of Quantities / Schedule of Rates',
  'Technical Specifications',
  'Draft Contract Agreement',
  'Other Supporting Document',
];

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const tenderSchema = z
  .object({
    entityName: z.string().min(2, 'Entity name is required'),
    entityType: z.string().min(1, 'Entity type is required'),
    title: z.string().min(5, 'Title must be at least 5 characters'),
    tender_number: z
      .string()
      .min(3, 'Reference number is required')
      .regex(/^[A-Z0-9\/\-\.]+$/i, 'Use format: ENTITY/TYPE/000/YYYY-YY'),
    category: z.string().min(1, 'Category is required'),
    description: z.string().optional(),
    procurementMethod: z.string().min(1, 'Procurement method is required'),
    sourceOfFunds: z.string().min(1, 'Source of funds is required'),
    amount: z
      .string()
      .min(1, 'Budget amount is required')
      .refine(
        v => !isNaN(parseFloat(v)) && parseFloat(v) > 0,
        'Enter a valid amount',
      ),
    county: z.string().min(1, 'County is required'),
    deadline: z.string().min(1, 'Submission deadline is required'),
    openingDate: z.string().min(1, 'Opening date is required'),
    tenderSecurityForm: z.string().optional(),
    tenderSecurityAmount: z.string().optional(),
    contactEmail: z
      .string()
      .email('Enter a valid email')
      .optional()
      .or(z.literal('')),
    declarationAccepted: z.literal(true, {
      errorMap: () => ({
        message: 'You must accept the compliance declaration',
      }),
    }),
  })
  .refine(
    data => {
      if (!data.deadline || !data.openingDate) return true;
      return new Date(data.openingDate) > new Date(data.deadline);
    },
    {
      message: 'Opening date must be after the submission deadline',
      path: ['openingDate'],
    },
  );

type TenderFormValues = z.infer<typeof tenderSchema>;

// ─── Attachment types ─────────────────────────────────────────────────────────

interface AttachedFile {
  id: string;
  file: File;
  label: string;
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className='flex items-center gap-1 text-xs text-destructive mt-1'>
      <AlertCircle className='h-3 w-3 shrink-0' />
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
          errors.push(`"${file.name}" — exceeds ${MAX_FILE_SIZE_MB}MB limit`);
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
      {/* Drop zone */}
      <label
        htmlFor='file-upload'
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
            PDF, Word, Excel · max {MAX_FILE_SIZE_MB}MB each · up to {MAX_FILES}{' '}
            files
          </p>
        </div>
        <input
          id='file-upload'
          type='file'
          multiple
          accept={ACCEPTED_FILE_EXTENSIONS}
          className='sr-only'
          onChange={e => {
            addFiles(e.target.files);
            // reset input so the same file can be re-added after removal
            e.target.value = '';
          }}
          disabled={files.length >= MAX_FILES}
        />
      </label>

      {/* Attached files list */}
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

interface NewTenderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (
    tender: TenderFormValues & { attachments: AttachedFile[] },
  ) => void;
}

export function NewTenderDialog({
  open,
  onOpenChange,
  onSubmit,
}: NewTenderDialogProps) {
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TenderFormValues>({
    resolver: zodResolver(tenderSchema),
    defaultValues: {
      entityName: '',
      entityType: '',
      title: '',
      tender_number: '',
      category: '',
      description: '',
      procurementMethod: '',
      sourceOfFunds: '',
      amount: '',
      county: '',
      deadline: '',
      openingDate: '',
      tenderSecurityForm: '',
      tenderSecurityAmount: '',
      contactEmail: '',
      declarationAccepted: undefined,
    },
  });

  const onValidSubmit = async (data: TenderFormValues) => {
    try {
      onSubmit?.({ ...data, attachments });
      toast.success('Tender created successfully');
      reset();
      setAttachments([]);
      onOpenChange(false);
    } catch {
      toast.error('Failed to create tender');
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
          <DialogTitle>Create New Tender</DialogTitle>
          <DialogDescription>
            Add a new procurement tender. Fields marked{' '}
            <span className='font-medium text-foreground'>*</span> are required
            under the PPRA Act 2015.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onValidSubmit)}
          className='space-y-6'
          noValidate
        >
          {/* ── Basic Information ─────────────────────────────────────────── */}
          <div className='space-y-4'>
            <SectionHeading>Basic Information</SectionHeading>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='entityName'>Entity Name *</Label>
                <Input
                  id='entityName'
                  placeholder='e.g. Kenya Medical Supplies Authority'
                  {...register('entityName')}
                  className={cn(
                    errors.entityName &&
                      'border-destructive focus-visible:ring-destructive',
                  )}
                />
                <FieldError message={errors.entityName?.message} />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='entityType'>Entity Type *</Label>
                <Controller
                  name='entityType'
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id='entityType'
                        className={cn(
                          errors.entityType && 'border-destructive',
                        )}
                      >
                        <SelectValue placeholder='Select type' />
                      </SelectTrigger>
                      <SelectContent>
                        {ENTITY_TYPES.map(t => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.entityType?.message} />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='title'>Tender Title *</Label>
              <Input
                id='title'
                placeholder='e.g. Supply and Delivery of Medical Equipment'
                {...register('title')}
                className={cn(
                  errors.title &&
                    'border-destructive focus-visible:ring-destructive',
                )}
              />
              <FieldError message={errors.title?.message} />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='tender_number'>Reference Number *</Label>
                <Input
                  id='tender_number'
                  placeholder='e.g. MOH/OT/001/2025-26'
                  {...register('tender_number')}
                  className={cn(
                    errors.tender_number &&
                      'border-destructive focus-visible:ring-destructive',
                  )}
                />
                <FieldError message={errors.tender_number?.message} />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='category'>Category *</Label>
                <Controller
                  name='category'
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id='category'
                        className={cn(errors.category && 'border-destructive')}
                      >
                        <SelectValue placeholder='Select category' />
                      </SelectTrigger>
                      <SelectContent>
                        {PROCUREMENT_CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.category?.message} />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='description'>Description / Scope of Works</Label>
              <textarea
                id='description'
                placeholder='Describe the goods, works or services required, including quantities and specifications'
                rows={3}
                {...register('description')}
                className='w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none'
              />
            </div>
          </div>
          {/* ── Procurement Details ───────────────────────────────────────── */}
          <div className='space-y-4'>
            <SectionHeading>Procurement Details</SectionHeading>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='procurementMethod'>Procurement Method *</Label>
                <Controller
                  name='procurementMethod'
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id='procurementMethod'
                        className={cn(
                          errors.procurementMethod && 'border-destructive',
                        )}
                      >
                        <SelectValue placeholder='Select method' />
                      </SelectTrigger>
                      <SelectContent>
                        {PROCUREMENT_METHODS.map(m => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.procurementMethod?.message} />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='sourceOfFunds'>Source of Funds *</Label>
                <Controller
                  name='sourceOfFunds'
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id='sourceOfFunds'
                        className={cn(
                          errors.sourceOfFunds && 'border-destructive',
                        )}
                      >
                        <SelectValue placeholder='Select source' />
                      </SelectTrigger>
                      <SelectContent>
                        {SOURCE_OF_FUNDS.map(s => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.sourceOfFunds?.message} />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='amount'>Budget Amount (KSh) *</Label>
                <Input
                  id='amount'
                  type='number'
                  placeholder='0.00'
                  {...register('amount')}
                  className={cn(
                    errors.amount &&
                      'border-destructive focus-visible:ring-destructive',
                  )}
                />
                <FieldError message={errors.amount?.message} />
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
            </div>
          </div>
          {/* ── Timeline ──────────────────────────────────────────────────── */}
          <div className='space-y-4'>
            <SectionHeading>Timeline</SectionHeading>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='deadline'>Submission Deadline *</Label>
                <Input
                  id='deadline'
                  type='date'
                  {...register('deadline')}
                  className={cn(
                    errors.deadline &&
                      'border-destructive focus-visible:ring-destructive',
                  )}
                />
                <FieldError message={errors.deadline?.message} />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='openingDate'>
                  Opening Date *{' '}
                  <span className='text-xs text-muted-foreground font-normal'>
                    (after deadline)
                  </span>
                </Label>
                <Input
                  id='openingDate'
                  type='date'
                  {...register('openingDate')}
                  className={cn(
                    errors.openingDate &&
                      'border-destructive focus-visible:ring-destructive',
                  )}
                />
                <FieldError message={errors.openingDate?.message} />
              </div>
            </div>
          </div>
          {/* ── Tender Security ───────────────────────────────────────────── */}
          <div className='space-y-4'>
            <SectionHeading>Tender Security</SectionHeading>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='tenderSecurityForm'>Security Form</Label>
                <Controller
                  name='tenderSecurityForm'
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id='tenderSecurityForm'>
                        <SelectValue placeholder='Select type' />
                      </SelectTrigger>
                      <SelectContent>
                        {TENDER_SECURITY_FORMS.map(s => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='tenderSecurityAmount'>
                  Security Amount (KSh){' '}
                  <span className='text-xs text-muted-foreground font-normal'>
                    (1–3% of budget)
                  </span>
                </Label>
                <Input
                  id='tenderSecurityAmount'
                  type='number'
                  placeholder='0.00'
                  {...register('tenderSecurityAmount')}
                />
              </div>
            </div>
          </div>
          {/* ── Attachments ───────────────────────────────────────────────── */}
          <div className='space-y-4'>
            <SectionHeading>Attachments</SectionHeading>
            <FileAttachmentSection
              files={attachments}
              onChange={setAttachments}
            />
          </div>
          {/* ── Contact ───────────────────────────────────────────────────── */}
          <div className='space-y-4'>
            <SectionHeading>Contact</SectionHeading>
            <div className='space-y-2'>
              <Label htmlFor='contactEmail'>SCM Officer Email</Label>
              <Input
                id='contactEmail'
                type='email'
                placeholder='procurement@entity.go.ke'
                {...register('contactEmail')}
                className={cn(
                  errors.contactEmail &&
                    'border-destructive focus-visible:ring-destructive',
                )}
              />
              <FieldError message={errors.contactEmail?.message} />
            </div>
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
                className='mt-0.5 h-4 w-4 rounded border-input accent-primary shrink-0'
              />
              <span className='text-sm text-muted-foreground leading-relaxed'>
                I confirm this tender complies with the{' '}
                <span className='font-medium text-foreground'>
                  Public Procurement and Asset Disposal Act, 2015
                </span>
                . All information is accurate, no corrupt practices have been
                engaged in, and this notice will be published on the{' '}
                <span className='font-medium text-foreground'>
                  PPRA tenders.go.ke portal
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
              {isSubmitting ? 'Creating...' : 'Create Tender'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
