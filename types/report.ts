export interface PublicReport {
  id: string
  trackingId: string
  reportType: 'Fraud' | 'Corruption' | 'Irregularity' | 'Bribery' | 'Embezzlement' | 'Conflict of Interest'
  title?: string
  description: string
  county: string
  entity?: string
  submittedDate: string
  submitterEmail?: string
  submitterPhone?: string
  attachments?: string[]
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Converted to Investigation'
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  relatedTenderId?: number
  relatedSupplierId?: number
  anonymous: boolean
  notes?: string
  createdInvestigationId?: number
  reviewedBy?: string
  reviewedDate?: string
  rejectionReason?: string
}

export interface ReportReviewAction {
  reportId: string
  action: 'approve' | 'reject' | 'convert_to_investigation'
  notes: string
  assignToInvestigator?: string
  priority?: 'High' | 'Medium' | 'Low'
  rejectionReason?: string
}
