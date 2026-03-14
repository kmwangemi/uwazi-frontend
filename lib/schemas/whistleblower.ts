import { ALLEGATION_TYPES } from '@/lib/constants';
import { z } from 'zod';

export const whistleblowerSchema = z
  .object({
    allegation_type: z.enum(ALLEGATION_TYPES, {
      errorMap: () => ({ message: 'Please select an allegation type' }),
    }),
    tender_reference: z.string().optional(),
    entity_name: z.string().optional(),
    description: z
      .string()
      .min(100, 'Description must be at least 100 characters'),
    evidence_description: z.string().optional(),
    contact_preference: z.enum(['none', 'email']),
    email: z.string().email().optional(),
  })
  .refine(
    data => {
      if (data.contact_preference === 'email') {
        return !!data.email;
      }
      return true;
    },
    {
      message: 'Email is required when contact preference is email',
      path: ['email'],
    },
  );

export type WhistleblowerInput = z.infer<typeof whistleblowerSchema>;
