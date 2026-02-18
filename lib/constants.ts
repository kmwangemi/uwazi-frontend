export const KENYA_COUNTIES = [
  'Baringo',
  'Bomet',
  'Bungoma',
  'Busia',
  'Elgeyo-Marakwet',
  'Embu',
  'Garissa',
  'Homa Bay',
  'Isiolo',
  'Kajiado',
  'Kakamega',
  'Kericho',
  'Kiambu',
  'Kilifi',
  'Kirinyaga',
  'Kisii',
  'Kisumu',
  'Kitui',
  'Kwale',
  'Laikipia',
  'Lamu',
  'Machakos',
  'Makueni',
  'Mandera',
  'Marsabit',
  'Meru',
  'Migori',
  'Mombasa',
  "Murang'a",
  'Nairobi',
  'Nakuru',
  'Nandi',
  'Narok',
  'Nyamira',
  'Nyandarua',
  'Nyeri',
  'Samburu',
  'Siaya',
  'Taita-Taveta',
  'Tana River',
  'Tharaka-Nithi',
  'Trans Nzoia',
  'Turkana',
  'Uasin Gishu',
  'Vihiga',
  'Wajir',
  'West Pokot',
];

export const PROCUREMENT_CATEGORIES = [
  'Construction & Infrastructure',
  'Medical Equipment & Supplies',
  'Office Equipment & Furniture',
  'Consultancy Services',
  'ICT & Technology',
  'Transport & Vehicles',
  'Security Services',
  'Stationery & Printing',
  'Legal Services',
  'Catering Services',
  'Maintenance & Repairs',
  'Other',
];

export const ENTITY_TYPES = [
  'Ministry',
  'County Government',
  'State Corporation',
  'Parastatal',
  'Constitutional Commission',
  'Other',
];

export const TENDER_STATUS = {
  PUBLISHED: 'PUBLISHED',
  AWARDED: 'AWARDED',
  CANCELLED: 'CANCELLED',
  FLAGGED: 'FLAGGED',
  UNDER_INVESTIGATION: 'UNDER_INVESTIGATION',
  COMPLETED: 'COMPLETED',
};

export const INVESTIGATION_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  PENDING_REVIEW: 'PENDING_REVIEW',
  CLOSED: 'CLOSED',
};

export const PRIORITY_LEVELS = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
};

export const RISK_LEVELS = {
  CRITICAL: { min: 76, max: 100, label: 'Critical', color: 'danger' },
  HIGH: { min: 51, max: 75, label: 'High', color: 'warning' },
  MEDIUM: { min: 26, max: 50, label: 'Medium', color: 'yellow' },
  LOW: { min: 0, max: 25, label: 'Low', color: 'success' },
};

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
export const DEFAULT_PAGE_SIZE = 25;

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
