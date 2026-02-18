export interface Investigation {
  id: number
  tender_id: number
  case_number: string
  investigator_id: number
  investigator_name: string
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  status: InvestigationStatus
  opened_date: string
  target_date: string | null
  closed_date: string | null
  findings: string | null
  estimated_loss: number
  evidence_count: number
  outcome: InvestigationOutcome | null
}

export type InvestigationStatus = 
  | 'OPEN' 
  | 'IN_PROGRESS' 
  | 'PENDING_REVIEW' 
  | 'CLOSED'

export type InvestigationOutcome = 
  | 'CONFIRMED_FRAUD' 
  | 'NO_FRAUD' 
  | 'INCONCLUSIVE' 
  | 'REFERRED'
