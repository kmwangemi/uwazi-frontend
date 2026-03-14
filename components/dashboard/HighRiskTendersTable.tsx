'use client'

import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { formatKES, formatDate, truncate } from '@/lib/utils'
import { RiskBadge } from '@/components/RiskBadge'
import { Eye } from 'lucide-react'

interface HighRiskTendersTableProps {
  isLoading?: boolean
}

// Sample data
const sampleTenders = [
  {
    id: '1',
    title: 'Supply and delivery of office equipment',
    entity: 'Ministry of Health',
    county: 'Nairobi',
    estimated_value: 45000000,
    risk_score: 85,
    risk_level: 'critical',
    created_at: '2026-03-13T10:00:00Z',
  },
  {
    id: '2',
    title: 'Construction of rural health facilities',
    entity: 'County Government of Kisumu',
    county: 'Kisumu',
    estimated_value: 250000000,
    risk_score: 72,
    risk_level: 'high',
    created_at: '2026-03-12T09:30:00Z',
  },
  {
    id: '3',
    title: 'Fleet management and maintenance services',
    entity: 'National Transport Authority',
    county: 'Nairobi',
    estimated_value: 120000000,
    risk_score: 68,
    risk_level: 'high',
    created_at: '2026-03-11T14:20:00Z',
  },
]

export function HighRiskTendersTable({ isLoading }: HighRiskTendersTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-10" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-[#1f2937] hover:bg-transparent">
              <TableHead className="text-[#94a3b8]">Title</TableHead>
              <TableHead className="text-[#94a3b8]">Entity</TableHead>
              <TableHead className="text-[#94a3b8]">Value</TableHead>
              <TableHead className="text-[#94a3b8]">Risk</TableHead>
              <TableHead className="text-[#94a3b8]">County</TableHead>
              <TableHead className="w-10 text-[#94a3b8]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleTenders.map((tender) => (
              <TableRow key={tender.id} className="border-[#1f2937] hover:bg-[#1a1d23]">
                <TableCell className="text-white text-sm max-w-xs">
                  <span className="line-clamp-1">{truncate(tender.title, 30)}</span>
                </TableCell>
                <TableCell className="text-[#94a3b8] text-sm max-w-xs">
                  <span className="line-clamp-1">{tender.entity}</span>
                </TableCell>
                <TableCell className="text-white font-mono text-sm">
                  {formatKES(tender.estimated_value)}
                </TableCell>
                <TableCell>
                  <RiskBadge
                    level={tender.risk_level as any}
                    score={tender.risk_score}
                    size="sm"
                    showScore
                  />
                </TableCell>
                <TableCell className="text-[#94a3b8] text-sm">{tender.county}</TableCell>
                <TableCell>
                  <Link href={`/tenders/${tender.id}`}>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Link href="/tenders?risk_level=high" className="text-[#00ff88] text-sm hover:underline">
        View all high-risk tenders →
      </Link>
    </div>
  )
}
