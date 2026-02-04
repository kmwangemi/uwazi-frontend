// Kenya Counties
export const KENYA_COUNTIES = [
  'Nairobi',
  'Mombasa',
  'Kisumu',
  'Nakuru',
  'Uasin Gishu',
  'Kiambu',
  'Muranga',
  'Nyeri',
  'Kirinyaga',
  'Embu',
  'Tharaka-Nithi',
  'Machakos',
  'Makueni',
  'Kajiado',
  'Taita-Taveta',
  'Lamu',
  'Kilifi',
  'Kwale',
  'West Pokot',
  'Samburu',
  'Trans Nzoia',
  'Elgeyo-Marakwet',
  'Nandi',
  'Baringo',
  'Laikipia',
  'Isiolo',
  'Meru',
  'Tana River',
  'Wajir',
  'Mandera',
  'Marsabit',
  'Turkana',
  'Garissa',
  'Bomet',
  'Kericho',
  'Kisii',
  'Nyamira',
  'Narok',
  'Homa Bay',
  'Migori',
  'Siaya',
  'Busia',
  'Vihiga',
  'Bungoma',
];

// Tender Categories
export const TENDER_CATEGORIES = [
  'Goods',
  'Services',
  'Works',
  'Consulting Services',
  'Non-Consulting Services',
];

// Flag Severity Colors
export const SEVERITY_COLORS = {
  CRITICAL: '#dc2626',
  HIGH: '#f97316',
  MEDIUM: '#eab308',
  LOW: '#22c55e',
} as const;

// Risk Score Ranges
export const RISK_SCORE_RANGES = {
  CRITICAL: { min: 80, max: 100, label: 'Critical' },
  HIGH: { min: 60, max: 79, label: 'High' },
  MEDIUM: { min: 40, max: 59, label: 'Medium' },
  LOW: { min: 0, max: 39, label: 'Low' },
} as const;

// Investigation Statuses
export const INVESTIGATION_STATUSES = [
  'OPEN',
  'IN_PROGRESS',
  'PENDING_REVIEW',
  'CLOSED',
] as const;

// Investigation Outcomes
export const INVESTIGATION_OUTCOMES = [
  'CONFIRMED_FRAUD',
  'NO_FRAUD',
  'INCONCLUSIVE',
  'REFERRED',
] as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'Administrator',
  INVESTIGATOR: 'Investigator',
  AUDITOR: 'Auditor',
  ANALYST: 'Data Analyst',
  VIEWER: 'Viewer',
} as const;

// API Endpoints
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    LOGOUT: '/logout',
    REFRESH: '/refresh',
  },
  TENDERS: {
    LIST: '/tenders',
    DETAIL: (id: number) => `/tenders/${id}`,
    CREATE: '/tenders',
    UPDATE: (id: number) => `/tenders/${id}`,
    UPLOAD: '/tenders/upload',
  },
  SUPPLIERS: {
    LIST: '/suppliers',
    DETAIL: (id: number) => `/suppliers/${id}`,
    VERIFY: (id: number) => `/suppliers/${id}/verify`,
  },
  ENTITIES: {
    LIST: '/entities',
    DETAIL: (id: number) => `/entities/${id}`,
  },
  INVESTIGATIONS: {
    LIST: '/investigations',
    DETAIL: (id: number) => `/investigations/${id}`,
    CREATE: '/investigations',
    UPDATE: (id: number) => `/investigations/${id}`,
  },
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    TRENDS: '/analytics/trends',
    SAVINGS: '/analytics/savings',
  },
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_TIME: 'MMM dd, yyyy hh:mm aa',
  INPUT: 'yyyy-MM-dd',
} as const;
