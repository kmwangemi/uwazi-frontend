export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: UserRole;
  profile_picture_url: string | null;
  created_at: string;
  updated_at: string;
}

export type UserRole =
  | 'admin'
  | 'investigator'
  | 'supplier'
  | 'procurement_officer';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
