// types/bid.ts
export type BidStatus = 'submitted' | 'under_review' | 'accepted' | 'rejected';

export interface BidDocument {
  url: string;
  public_id: string;
  file_name: string;
  file_type?: string;
  size?: number;
}

export interface Bid {
  id: string;
  bid_reference: string;
  tender_id: string;
  supplier_id: string;
  submitted_by: string;
  // Financial
  quote_price: number;
  delivery_timeline: number;
  payment_terms: string;
  warranty?: string;
  // Proposal
  technical_proposal?: string;
  risk_mitigation?: string;
  quality_approach?: string;
  // Documents
  technical_documents?: BidDocument[];
  financial_documents?: BidDocument[];
  compliance_documents?: BidDocument[];
  // Status
  status: BidStatus;
  terms_accepted: boolean;
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface BidCreatePayload {
  quotePrice: string;
  deliveryTimeline: string;
  paymentTerms: string;
  warranty?: string;
  technicalProposal?: string;
  riskMitigation?: string;
  qualityApproach?: string;
  technicalDocuments?: File[];
  financialDocuments?: File[];
  complianceDocuments?: File[];
  termsAccepted: boolean;
}

export interface BidStatusUpdate {
  status: BidStatus;
  reason?: string;
}
