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
import { KENYA_COUNTIES, PROCUREMENT_CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { TenderCreatePayload } from '@/types/tender';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Upload, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// ─── Constants ────────────────────────────────────────────────────────────────

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

interface NewTenderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (payload: TenderCreatePayload) => void; // ✅ matches service type
  isSubmitting?: boolean; // ✅ controlled by parent
}

export function NewTenderDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: NewTenderDialogProps) {
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);

  const form = useForm<TenderFormValues>({
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

  const onValidSubmit = (data: TenderFormValues) => {
    // Build TenderCreatePayload — shape matches backend TenderCreate schema
    const payload: TenderCreatePayload = {
      tender_number: data.tender_number,
      title: data.title,
      description: data.description,
      entityName: data.entityName,
      entityType: data.entityType,
      category: data.category,
      procurementMethod: data.procurementMethod,
      sourceOfFunds: data.sourceOfFunds,
      amount: parseFloat(data.amount), // ✅ convert string → number
      county: data.county,
      deadline: data.deadline,
      openingDate: data.openingDate,
      tenderSecurityForm: data.tenderSecurityForm || undefined,
      tenderSecurityAmount: data.tenderSecurityAmount
        ? parseFloat(data.tenderSecurityAmount)
        : undefined,
      contactEmail: data.contactEmail || undefined,
      attachments: attachments.map(a => a.file), // ✅ extract File[] for FormData
    };
    onSubmit?.(payload);
    // ✅ Don't toast here — parent (TendersPage) handles success/error toasts
  };

  const handleClose = () => {
    if (isSubmitting) return; // ✅ prevent close while uploading
    form.reset();
    setAttachments([]);
    onOpenChange(false);
  };

  // Reset form when dialog closes after successful submit
  const handleOpenChange = (open: boolean) => {
    if (!open) handleClose();
    else onOpenChange(true);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Create New Tender</DialogTitle>
          <DialogDescription>
            Add a new procurement tender. Fields marked{' '}
            <span className='font-medium text-foreground'>*</span> are required
            under the PPRA Act 2015.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onValidSubmit)}
            className='space-y-6'
            noValidate
          >
            {/* ── Basic Information ──────────────────────────────────────── */}
            <div className='space-y-4'>
              <SectionHeading>Basic Information</SectionHeading>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='entityName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entity Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g. Kenya Medical Supplies Authority'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='entityType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entity Type *</FormLabel>
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
                          {ENTITY_TYPES.map(t => (
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
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tender Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='e.g. Supply and Delivery of Medical Equipment'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='tender_number'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference Number *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g. MOH/OT/001/2025-26'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='category'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select category' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PROCUREMENT_CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description / Scope of Works</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder='Describe the goods, works or services required'
                        rows={3}
                        {...field}
                        className='w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* ── Procurement Details ────────────────────────────────────── */}
            <div className='space-y-4'>
              <SectionHeading>Procurement Details</SectionHeading>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='procurementMethod'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Procurement Method *</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select method' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PROCUREMENT_METHODS.map(m => (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='sourceOfFunds'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source of Funds *</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select source' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SOURCE_OF_FUNDS.map(s => (
                            <SelectItem key={s} value={s}>
                              {s}
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
                  name='amount'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Amount (KSh) *</FormLabel>
                      <FormControl>
                        <Input type='number' placeholder='0.00' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='county'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>County *</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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
              </div>
            </div>
            {/* ── Timeline ──────────────────────────────────────────────── */}
            <div className='space-y-4'>
              <SectionHeading>Timeline</SectionHeading>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='deadline'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Submission Deadline *</FormLabel>
                      <FormControl>
                        <Input type='date' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='openingDate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Opening Date *{' '}
                        <span className='text-xs text-muted-foreground font-normal'>
                          (after deadline)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input type='date' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* ── Tender Security ────────────────────────────────────────── */}
            <div className='space-y-4'>
              <SectionHeading>Tender Security</SectionHeading>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='tenderSecurityForm'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security Form</FormLabel>
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
                          {TENDER_SECURITY_FORMS.map(s => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='tenderSecurityAmount'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Security Amount (KSh){' '}
                        <span className='text-xs text-muted-foreground font-normal'>
                          (1–3% of budget)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input type='number' placeholder='0.00' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* ── Attachments ───────────────────────────────────────────── */}
            <div className='space-y-4'>
              <SectionHeading>Attachments</SectionHeading>
              <FileAttachmentSection
                files={attachments}
                onChange={setAttachments}
              />
            </div>
            {/* ── Contact ───────────────────────────────────────────────── */}
            <div className='space-y-4'>
              <SectionHeading>Contact</SectionHeading>
              <FormField
                control={form.control}
                name='contactEmail'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SCM Officer Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='procurement@entity.go.ke'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
                    <label className='text-sm text-muted-foreground leading-relaxed cursor-pointer'>
                      I confirm this tender complies with the{' '}
                      <span className='font-medium text-foreground'>
                        Public Procurement and Asset Disposal Act, 2015
                      </span>
                      {'. '}All information is accurate, no corrupt practices
                      have been engaged in, and this notice will be published on
                      the{' '}
                      <span className='font-medium text-foreground'>
                        PPRA tenders.go.ke portal
                      </span>
                      {'. *'}
                    </label>
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
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Tender'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
