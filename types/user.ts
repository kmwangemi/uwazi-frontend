export interface User {
  id: number
  email: string
  name: string
  role: UserRole
  created_at: string
  updated_at: string
}

export type UserRole = 'INVESTIGATOR' | 'AUDITOR' | 'ADMIN' | 'CITIZEN'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}
