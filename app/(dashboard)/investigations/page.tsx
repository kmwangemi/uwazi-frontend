'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RiskBadge } from '@/components/RiskBadge'
import { FileText, MessageSquare, Download } from 'lucide-react'

const sampleInvestigations = [
  {
    id: '1',
    tender_ref: 'KCAC/2026/001',
    title: 'Supply and delivery of office equipment',
    risk_level: 'critical',
    status: 'active',
    opened: '2026-03-01',
    investigator: 'John Doe',
    findings: 'Suspicious bid patterns detected. Supplier linked to 5 other shell companies.',
  },
  {
    id: '2',
    tender_ref: 'KCAC/2026/002',
    title: 'Construction of rural health facilities',
    risk_level: 'high',
    status: 'active',
    opened: '2026-02-15',
    investigator: 'Jane Smith',
    findings: 'Price deviation of 40% above benchmark. Specification manipulation indicators.',
  },
]

const sampleWhistleblowerReports = [
  {
    id: '1',
    date: '2026-03-12',
    allegation: 'Ghost supplier',
    credibility: 87,
    urgency: 'high',
    summary: 'Supplier appears to be shell company with no actual operations',
    reviewed: true,
  },
  {
    id: '2',
    date: '2026-03-10',
    allegation: 'Bid rigging',
    credibility: 72,
    urgency: 'medium',
    summary: 'Multiple bids show identical pricing patterns',
    reviewed: true,
  },
]

export default function InvestigationsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Investigations</h1>
        <p className="text-[#94a3b8]">Manage and track active corruption investigations</p>
      </div>

      <Tabs defaultValue="investigations" className="w-full">
        <TabsList className="bg-[#121418] border-b border-[#1f2937] w-full justify-start">
          <TabsTrigger value="investigations">Active Investigations</TabsTrigger>
          <TabsTrigger value="whistleblower">Whistleblower Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="investigations" className="space-y-4">
          {/* Search */}
          <Input
            type="text"
            placeholder="Search investigations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#121418] border-[#1f2937]"
          />

          {/* Investigations List */}
          <div className="space-y-4">
            {sampleInvestigations.map((inv) => (
              <Card key={inv.id} className="bg-[#121418] border-[#1f2937] p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{inv.title}</h3>
                    <p className="text-sm text-[#94a3b8] mt-1">{inv.tender_ref}</p>
                  </div>
                  <RiskBadge level={inv.risk_level as any} showScore={false} />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y border-[#1f2937]">
                  <div>
                    <p className="text-xs text-[#94a3b8]">Status</p>
                    <p className="text-white font-semibold uppercase">{inv.status}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#94a3b8]">Opened</p>
                    <p className="text-white">{inv.opened}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#94a3b8]">Investigator</p>
                    <p className="text-white">{inv.investigator}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-[#94a3b8] mb-2">Key Findings</p>
                  <p className="text-white text-sm">{inv.findings}</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-[#1f2937]">
                    <FileText className="w-4 h-4 mr-2" />
                    Package
                  </Button>
                  <Button variant="outline" size="sm" className="border-[#1f2937]">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="whistleblower" className="space-y-4">
          {/* Search */}
          <Input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#121418] border-[#1f2937]"
          />

          {/* Reports List */}
          <div className="space-y-4">
            {sampleWhistleblowerReports.map((report) => (
              <Card key={report.id} className="bg-[#121418] border-[#1f2937] p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm text-[#94a3b8]">{report.date}</p>
                    <h3 className="text-lg font-semibold text-white mt-1">{report.allegation}</h3>
                  </div>
                  <div className="flex gap-2">
                    <RiskBadge
                      level={report.urgency as any}
                      showScore={false}
                      size="sm"
                    />
                  </div>
                </div>

                <p className="text-white mb-3">{report.summary}</p>

                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-[#94a3b8]">Credibility Score</p>
                      <p className="text-lg font-mono font-bold text-[#00ff88]">{report.credibility}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#94a3b8]">Status</p>
                      <p className={`font-semibold ${report.reviewed ? 'text-[#00ff88]' : 'text-[#f59e0b]'}`}>
                        {report.reviewed ? 'Reviewed' : 'Pending'}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-[#1f2937]">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
