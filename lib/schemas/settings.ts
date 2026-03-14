import { z } from 'zod'

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  organization: z.string().optional(),
})

export type ProfileInput = z.infer<typeof profileSchema>

export const passwordSchema = z.object({
  current_password: z.string().min(6, 'Password required'),
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
}).refine((data) => data.current_password !== data.new_password, {
  message: "New password must be different from current password",
  path: ["new_password"],
})

export type PasswordInput = z.infer<typeof passwordSchema>

export const notificationsSchema = z.object({
  notify_risk_alerts: z.boolean(),
  notify_weekly_digest: z.boolean(),
  notify_monthly_report: z.boolean(),
})

export type NotificationsInput = z.infer<typeof notificationsSchema>
