import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string(),
    role: z.enum(['viewer', 'investigator', 'admin']),
    organization: z.string().optional(),
  })
  .refine(data => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
