export interface Tender {
  id: number
  tender_number: string
  title: string
  description: string
  amount: number
  procuring_entity: string
  county: string
  category: string
  submission_deadline: string | null
  award_date: string | null
  awarded_supplier_id: number | null
  awarded_supplier_name?: string
  status: TenderStatus
  risk_score: number
  is_flagged: boolean
  corruption_flags: CorruptionFlag[]
  created_at: string
  updated_at: string
}

export type TenderStatus = 
  | 'PUBLISHED' 
  | 'AWARDED' 
  | 'CANCELLED' 
  | 'FLAGGED' 
  | 'UNDER_INVESTIGATION'
  | 'COMPLETED'

export interface CorruptionFlag {
  type: FlagType
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  description: string
  score: number
  evidence: Record<string, any>
}

export type FlagType = 
  | 'PRICE_INFLATION'
  | 'GHOST_SUPPLIER'
  | 'SPECIFICATION_RESTRICTIVE'
  | 'NETWORK_CONFLICT'
  | 'SHORT_TIMELINE'
  | 'TENDER_SPLITTING'
  | 'CONTRACT_VARIATION'

export interface PriceAnalysis {
  item_name: string
  tender_price: number
  market_price: number
  deviation_percentage: number
  excess_amount: number
  market_source: string
}
