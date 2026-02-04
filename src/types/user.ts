export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  organization: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  last_login: string | null;
}

export type UserRole =
  | 'ADMIN'
  | 'INVESTIGATOR'
  | 'AUDITOR'
  | 'ANALYST'
  | 'VIEWER';

export interface AuthToken {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}
