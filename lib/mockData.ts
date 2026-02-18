import { DashboardStats } from '@/types/common';
import type { procuring_entity } from '@/types/entity';
import type { Investigation } from '@/types/investigation';
import type { PublicReport } from '@/types/report';
import type { Supplier } from '@/types/supplier';
import type { Tender } from '@/types/tender';
import { KENYA_COUNTIES } from './constants';

export const mockTenders: Tender[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  tender_number: `TND/2024/${String(i + 1).padStart(3, '0')}`,
  title: [
    'Supply and Delivery of Office Furniture',
    'Medical Equipment and Supplies',
    'Road Construction and Maintenance',
    'ICT Infrastructure Setup',
    'Consultancy Services',
    'Security Services Contract',
    'Stationery and Printing Services',
    'Vehicle Supply and Maintenance',
  ][i % 8],
  description: 'Procurement of goods and services for county operations',
  amount: Math.floor(Math.random() * 1000000000) + 100000,
  tender_type: ['Open', 'Restricted', 'Direct'][i % 3] as any,
  procuring_entity: [
    'Nairobi County',
    'Ministry of Health',
    'Ministry of Roads',
    'Ministry of ICT',
  ][i % 4],
  county: KENYA_COUNTIES[i % KENYA_COUNTIES.length],
  category: [
    'Construction & Infrastructure',
    'Medical Equipment & Supplies',
    'Office Equipment & Furniture',
    'Consultancy Services',
  ][i % 4],
  submission_deadline: new Date(
    Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000,
  )
    .toISOString()
    .split('T')[0],
  award_date:
    i % 2 === 0
      ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0]
      : null,
  awarded_supplier_id: i % 2 === 0 ? Math.floor(Math.random() * 20) + 1 : null,
  awarded_supplier_name:
    i % 2 === 0 ? `Supplier ${Math.floor(Math.random() * 20) + 1}` : undefined,
  status: [
    'PUBLISHED',
    'AWARDED',
    'FLAGGED',
    'UNDER_INVESTIGATION',
    'COMPLETED',
  ][Math.floor(Math.random() * 5)] as any,
  risk_score: Math.floor(Math.random() * 100),
  is_flagged: Math.random() > 0.7,
  corruption_flags:
    Math.random() > 0.6
      ? [
          {
            type: 'PRICE_INFLATION',
            severity: Math.random() > 0.5 ? 'HIGH' : 'MEDIUM',
            description: 'Price significantly above market rate',
            score: Math.floor(Math.random() * 50),
            evidence: { source: 'market analysis' },
          },
        ]
      : [],
  created_at: new Date(
    Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000,
  ).toISOString(),
  updated_at: new Date().toISOString(),
}));

export const mockSuppliers: Supplier[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  registration_number: `BN/2024/${String(i + 1).padStart(5, '0')}`,
  name: `Supplier Company ${i + 1}`,
  business_address: `P.O. Box ${1000 + i}, Nairobi`,
  physical_address: Math.random() > 0.5 ? `Physical Address ${i + 1}` : null,
  tax_pin: `A${String(i + 1).padStart(8, '0')}X`,
  county: KENYA_COUNTIES[i % KENYA_COUNTIES.length],
  registration_date: new Date(
    Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
  )
    .toISOString()
    .split('T')[0],
  directors: [
    {
      name: `Director ${i * 2 + 1}`,
      id_number: `${12345600 + i}`,
      shares: 60,
      is_government_employee: Math.random() > 0.7,
    },
    {
      name: `Director ${i * 2 + 2}`,
      id_number: `${87654300 + i}`,
      shares: 40,
      is_government_employee: false,
    },
  ],
  contact_email: `contact${i}@supplier.com`,
  completed_tenders: Math.floor(Math.random() * 20) + 1,
  contact_phone: `+254712345${String(i).padStart(3, '0')}`,
  is_verified: Math.random() > 0.4,
  verification_status: Math.random() > 0.7 ? 'Flagged' : 'Verified',
  risk_score: Math.floor(Math.random() * 100),
  total_contracts: Math.floor(Math.random() * 20) + 1,
  total_contract_value: Math.floor(Math.random() * 500000000) + 10000000,
  flagged_contracts: Math.floor(Math.random() * 5),
  registered_year: new Date(
    Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
  ).getFullYear(),
  created_at: new Date(
    Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
  ).toISOString(),
}));

export const mockEntities: procuring_entity[] = Array.from(
  { length: 20 },
  (_, i) => ({
    id: i + 1,
    entity_code: `ENT${String(i + 1).padStart(3, '0')}`,
    name: [
      'Ministry of Roads',
      'Ministry of Health',
      'Ministry of Education',
      'Nairobi County',
      'Kiambu County',
    ][i % 5],
    entity_type: ['MINISTRY', 'COUNTY', 'PARASTATAL', 'OTHER'][i % 4] as any,
    county: KENYA_COUNTIES[i % KENYA_COUNTIES.length] || null,
    total_tenders: Math.floor(Math.random() * 500) + 50,
    total_expenditure: Math.floor(Math.random() * 10000000000) + 1000000000,
    flagged_tenders: Math.floor(Math.random() * 100),
    average_corruption_score: Math.floor(Math.random() * 100),
    created_at: new Date().toISOString(),
  }),
);

export const mockInvestigations: Investigation[] = Array.from(
  { length: 15 },
  (_, i) => ({
    id: i + 1,
    tender_id: Math.floor(Math.random() * 50) + 1,
    title: `Investigation ${i + 1} on Tender TND/2024/${String(Math.floor(Math.random() * 50) + 1).padStart(3, '0')}`,
    case_number: `CASE/2024/${String(i + 1).padStart(4, '0')}`,
    description:
      'Detailed investigation into procurement irregularities and potential fraud.',
    investigator_id: Math.floor(Math.random() * 10) + 1,
    investigator_name: `Investigator ${Math.floor(Math.random() * 10) + 1}`,
    priority: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'][i % 4] as any,
    status: ['OPEN', 'IN_PROGRESS', 'PENDING_REVIEW', 'CLOSED'][i % 4] as any,
    opened_date: new Date(
      Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000,
    )
      .toISOString()
      .split('T')[0],
    target_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    closed_date:
      i % 4 === 3
        ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0]
        : null,
    findings: i % 4 === 3 ? 'Investigation completed with findings' : null,
    estimated_loss: Math.floor(Math.random() * 100000000) + 1000000,
    evidence_count: Math.floor(Math.random() * 20),
    outcome:
      i % 4 === 3
        ? (['CONFIRMED_FRAUD', 'NO_FRAUD', 'INCONCLUSIVE'][
            Math.floor(Math.random() * 3)
          ] as any)
        : null,
  }),
);

export const mockDashboardStats: DashboardStats = {
  total_tenders: 15847,
  flagged_tenders: 2341,
  total_value: 450000000000,
  estimated_savings: 67500000000,
  active_investigations: 287,
  tenders_by_risk: {
    critical: 421,
    high: 892,
    medium: 1028,
    low: 13506,
  },
  savings_by_county: KENYA_COUNTIES.map((county, i) => ({
    county,
    total_tenders: Math.floor(Math.random() * 500) + 100,
    flagged_tenders: Math.floor(Math.random() * 100) + 10,
    total_value: Math.floor(Math.random() * 50000000000) + 5000000000,
    savings: Math.floor(Math.random() * 10000000000) + 1000000000,
    corruption_rate: Math.floor(Math.random() * 40) + 5,
  })),
  fraud_trends: Array.from({ length: 90 }, (_, i) => {
    const date = new Date(Date.now() - (90 - i) * 24 * 60 * 60 * 1000);
    return {
      date: date.toISOString().split('T')[0],
      total_tenders: Math.floor(Math.random() * 300) + 100,
      flagged_tenders: Math.floor(Math.random() * 80) + 20,
      total_value: Math.floor(Math.random() * 10000000000) + 1000000000,
      flagged_value: Math.floor(Math.random() * 2000000000) + 100000000,
    };
  }),
  top_corrupt_entities: mockEntities.slice(0, 10).map(e => ({
    entity_code: e.entity_code,
    entity_name: e.name,
    total_tenders: e.total_tenders,
    flagged_tenders: e.flagged_tenders,
    corruption_rate: (e.flagged_tenders / e.total_tenders) * 100,
    risk_score: e.average_corruption_score,
  })),
};

export const mockPublicReports: PublicReport[] = [
  {
    id: '1',
    trackingId: 'TRACK-1704067200000-ABC123',
    reportType: 'Corruption',
    title: 'Inflated contract values in road construction',
    description:
      'Observed significant price inflation in tender TND/2024/001 for road construction. The quoted amount appears 300% above market rates.',
    county: 'Nairobi',
    entity: 'Ministry of Roads',
    submittedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Pending',
    severity: 'High',
    relatedTenderId: 1,
    anonymous: true,
    notes: 'Awaiting investigator assignment',
  },
  {
    id: '2',
    trackingId: 'TRACK-1704153600000-DEF456',
    reportType: 'Bribery',
    title: 'Suspicious tender award to preferred supplier',
    description:
      'The same supplier has been awarded 15 consecutive tenders in the last 6 months despite having higher bids than competitors.',
    county: 'Kiambu',
    entity: 'Kiambu County Government',
    submittedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Under Review',
    severity: 'Critical',
    relatedSupplierId: 5,
    anonymous: true,
    reviewedBy: 'John Omondi',
    reviewedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    trackingId: 'TRACK-1704240000000-GHI789',
    reportType: 'Embezzlement',
    title: 'Missing equipment from procurement records',
    description:
      'Medical equipment valued at KES 5M was recorded as delivered but never found in the hospital inventory.',
    county: 'Mombasa',
    entity: 'Ministry of Health',
    submittedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Approved',
    severity: 'Critical',
    anonymous: false,
    submitterEmail: 'whistleblower@hospital.ke',
    createdInvestigationId: 15,
  },
  {
    id: '4',
    trackingId: 'TRACK-1704326400000-JKL012',
    reportType: 'Conflict of Interest',
    title: 'Procurement officer related to winning supplier',
    description:
      'The procurement officer managing tender evaluation is related to the director of the winning supplier company.',
    county: 'Kisumu',
    entity: 'Kisumu County Government',
    submittedDate: new Date(
      Date.now() - 10 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    status: 'Converted to Investigation',
    severity: 'High',
    anonymous: true,
    createdInvestigationId: 12,
  },
  {
    id: '5',
    trackingId: 'TRACK-1704412800000-MNO345',
    reportType: 'Irregularity',
    title: 'Incomplete documentation in tender file',
    description:
      'The tender file for consultancy services lacks supporting documentation for the evaluation criteria.',
    county: 'Nakuru',
    entity: 'Ministry of ICT',
    submittedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Pending',
    severity: 'Medium',
    anonymous: true,
    notes: 'Requires additional information from submitter',
  },
  {
    id: '6',
    trackingId: 'TRACK-1704499200000-PQR678',
    reportType: 'Fraud',
    title: 'Fake credentials presented by supplier',
    description:
      'Supplier submitted false ISO certifications and technical qualifications to win the tender.',
    county: 'Nairobi',
    entity: 'Ministry of Education',
    submittedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Rejected',
    severity: 'Medium',
    anonymous: true,
    rejectionReason:
      'Insufficient evidence provided. Submitter requested to provide supporting documents.',
  },
];
