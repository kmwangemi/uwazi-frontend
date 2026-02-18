import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const tenderFilterSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  county: z.string().optional(),
  category: z.string().optional(),
  entity: z.string().optional(),
  risk_level: z.string().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  min_amount: z.number().optional(),
  max_amount: z.number().optional(),
})

export const investigationFormSchema = z.object({
  tender_id: z.number().int('Select a tender'),
  investigator_id: z.number().int('Select an investigator'),
  priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
  target_date: z.string().optional(),
  notes: z.string().optional(),
})

export const whistleblowerFormSchema = z.object({
  report_type: z.enum([
    'PRICE_INFLATION',
    'GHOST_SUPPLIER',
    'CONFLICT_OF_INTEREST',
    'BRIBERY_KICKBACKS',
    'TENDER_MANIPULATION',
    'OTHER'
  ]),
  tender_number: z.string().optional(),
  procuring_entity: z.string().optional(),
  approximate_amount: z.number().optional(),
  county: z.string().optional(),
  description: z.string().min(100, 'Description must be at least 100 characters'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
})

export const reportFilterSchema = z.object({
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  county: z.string().optional(),
  entity: z.string().optional(),
  category: z.string().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type TenderFilterData = z.infer<typeof tenderFilterSchema>
export type InvestigationFormData = z.infer<typeof investigationFormSchema>
export type WhistleblowerFormData = z.infer<typeof whistleblowerFormSchema>
export type ReportFilterData = z.infer<typeof reportFilterSchema>
