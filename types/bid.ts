export interface Bid {
  id: string
  tenderId: number
  supplierId: string
  supplierName: string
  biddingPrice: number
  variant?: string
  deliveryTimeline: number
  paymentTerms: string
  submittedDate: string
  status: BidStatus
  documents: BidDocument[]
  financialCapability: FinancialCapability
  technicalCapability: TechnicalCapability
  complianceChecklist: ComplianceItem[]
  evaluationScore?: number
  evaluationNotes?: string
  approvalDecision?: ApprovalDecision
  performanceHistory?: PerformanceHistory
}

export type BidStatus = 
  | 'Draft'
  | 'Submitted'
  | 'Under Evaluation'
  | 'Under Review'
  | 'Approved'
  | 'Rejected'
  | 'Awarded'
  | 'Contracted'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled'

export interface BidDocument {
  id: string
  documentType: DocumentType
  fileName: string
  uploadDate: string
  fileSize: number
  isVerified: boolean
  verificationDate?: string
  verificationNotes?: string
}

export type DocumentType =
  | 'Company Registration'
  | 'Tax Compliance Certificate'
  | 'Financial Statements'
  | 'Bank Reference'
  | 'Insurance Certificate'
  | 'Technical Specifications'
  | 'Experience Certificate'
  | 'Quality Assurance Plan'
  | 'Project Timeline'
  | 'Insurance Documents'
  | 'Health & Safety Plan'
  | 'Environmental Compliance'
  | 'Other'

export interface FinancialCapability {
  turnoverLastThreeYears: number
  currentCashFlow: number
  creditRating: string
  bankReferences: BankReference[]
  debtToEquityRatio: number
  isCapableOfPayment: boolean
}

export interface BankReference {
  bankName: string
  accountNumber: string
  accountType: string
  verificationStatus: 'Pending' | 'Verified' | 'Failed'
}

export interface TechnicalCapability {
  relevantExperience: number
  pastProjects: PastProject[]
  keyPersonnel: KeyPerson[]
  equipment: Equipment[]
  qualifications: string[]
  certifications: Certification[]
  isTechnicallyQualified: boolean
}

export interface PastProject {
  projectName: string
  clientName: string
  completionDate: string
  projectValue: number
  description: string
}

export interface KeyPerson {
  name: string
  position: string
  qualification: string
  yearsOfExperience: number
}

export interface Equipment {
  equipmentName: string
  quantity: number
  condition: 'New' | 'Good' | 'Fair'
}

export interface Certification {
  name: string
  issuer: string
  issueDate: string
  expiryDate?: string
  isValid: boolean
}

export interface ComplianceItem {
  requirement: string
  isCompliant: boolean
  evidence: string
  notes?: string
}

export interface ApprovalDecision {
  decision: 'Approved' | 'Rejected' | 'Conditional'
  decidedBy: string
  decidedDate: string
  reasons: string[]
  conditions?: string[]
  reviewedNotes: string
}

export interface PerformanceHistory {
  completedProjects: number
  onTimeDeliveryRate: number
  qualityRating: number
  customerSatisfaction: number
  disputes: DisputeRecord[]
  complaintsCount: number
}

export interface DisputeRecord {
  description: string
  resolution: string
  resolvedDate: string
}

export interface BidEvaluation {
  bidId: string
  technicalScore: number
  financialScore: number
  complianceScore: number
  performanceScore: number
  totalScore: number
  recommendation: 'Approve' | 'Reject' | 'Review Further'
  evaluatorName: string
  evaluationDate: string
  comments: string
}

export interface AwardDecision {
  tenderId: number
  awardedBidId: string
  awardedSupplierId: string
  awardAmount: number
  awardedDate: string
  approvedBy: string
  contractStartDate: string
  contractEndDate: string
  deliveryLocation: string
  inspectionRequirements: string
  paymentSchedule: PaymentSchedule[]
}

export interface PaymentSchedule {
  phase: number
  description: string
  percentageOfContract: number
  dueDate: string
  amount: number
  milestone: string
}

export interface DeliveryTracking {
  awardDecisionId: string
  deliveryStartDate: string
  expectedCompletionDate: string
  actualCompletionDate?: string
  deliveryStatus: DeliveryStatus
  quantityDelivered: number
  quantityExpected: number
  qualityInspectionNotes: string
  isAccepted: boolean
  acceptanceDate?: string
  nonConformancesRaised: NonConformance[]
}

export type DeliveryStatus = 
  | 'Scheduled'
  | 'In Transit'
  | 'Delivered'
  | 'Under Inspection'
  | 'Accepted'
  | 'Rejected'
  | 'Delayed'

export interface NonConformance {
  description: string
  severity: 'Critical' | 'Major' | 'Minor'
  raisedDate: string
  correctionDeadline: string
  correctionStatus: 'Open' | 'Corrected' | 'Accepted'
  correctionDate?: string
}

export interface TenderCompletion {
  tenderId: number
  closureDate: string
  closedBy: string
  finalAmount: number
  completionStatus: CompletionStatus
  lessonsLearned: string
  recommendedImprovements: string[]
  auditTrail: AuditTrailEntry[]
}

export type CompletionStatus = 
  | 'Successfully Completed'
  | 'Completed with Variations'
  | 'Terminated Early'
  | 'Cancelled'

export interface AuditTrailEntry {
  action: string
  performedBy: string
  timestamp: string
  details: Record<string, any>
  changesMade: string
}
