import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long'),
});

export const registerSchema = loginSchema.extend({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  organization: z.string().min(2, 'Organization name is required'),
});

// Tender Schemas
export const tenderFilterSchema = z.object({
  county: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  min_amount: z.coerce.number().optional(),
  max_amount: z.coerce.number().optional(),
  search: z.string().optional(),
  sort_by: z.enum(['amount', 'risk_score', 'created_at']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
});

export const tenderUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      file => file.size <= 10 * 1024 * 1024,
      'File must be less than 10MB',
    )
    .refine(
      file =>
        [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ].includes(file.type),
      'File must be a PDF or Excel file',
    ),
});

// Supplier Schemas
export const supplierFilterSchema = z.object({
  search: z.string().optional(),
  risk_level: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).optional(),
  is_verified: z.enum(['true', 'false']).optional(),
  sort_by: z.enum(['risk_score', 'total_contracts', 'name']).optional(),
});

// Investigation Schemas
export const investigationFormSchema = z.object({
  tender_id: z.coerce.number().positive('Tender is required'),
  case_number: z.string().min(1, 'Case number is required'),
  priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
  target_date: z.string().optional(),
  findings: z.string().optional(),
  estimated_loss: z.coerce.number().nonnegative().optional(),
});

export const investigationUpdateSchema = investigationFormSchema.extend({
  status: z
    .enum(['OPEN', 'IN_PROGRESS', 'PENDING_REVIEW', 'CLOSED'])
    .optional(),
  outcome: z
    .enum(['CONFIRMED_FRAUD', 'NO_FRAUD', 'INCONCLUSIVE', 'REFERRED'])
    .optional(),
});

// Whistleblower Schemas
export const whistleblowerSchema = z.object({
  submission_type: z.enum([
    'TENDER_ISSUE',
    'SUPPLIER_ISSUE',
    'GENERAL_CORRUPTION',
  ]),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  location: z.string().optional(),
  evidence: z.array(z.string()).optional(),
  contact_preference: z.enum(['EMAIL', 'PHONE', 'ANONYMOUS']),
  contact_info: z.string().optional(),
});

// Report Schemas
export const reportFilterSchema = z.object({
  report_type: z
    .enum([
      'FRAUD_SUMMARY',
      'SAVINGS_ANALYSIS',
      'ENTITY_PROFILE',
      'INVESTIGATION_STATUS',
    ])
    .optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  entity_id: z.coerce.number().optional(),
  county: z.string().optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type TenderFilterSchema = z.infer<typeof tenderFilterSchema>;
export type SupplierFilterSchema = z.infer<typeof supplierFilterSchema>;
export type InvestigationFormSchema = z.infer<typeof investigationFormSchema>;
export type WhistleblowerSchema = z.infer<typeof whistleblowerSchema>;
