export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ApiError {
  detail: string;
  status_code?: number;
}

export type UserRole = 'admin' | 'investigator' | 'auditor' | 'analyst';
