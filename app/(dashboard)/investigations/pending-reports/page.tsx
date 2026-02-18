'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockPublicReports } from '@/lib/mockData'
import { CheckCircle, XCircle, FileText, AlertTriangle, Search } from 'lucide-react'
import { toast } from 'sonner'

export default function PendingReportsPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedReport, setSelectedReport] = useState<string | null>(null)

  const filteredReports = mockPublicReports.filter((report) => {
    let matches = true
    if (statusFilter !== 'all') matches = matches && report.status === statusFilter
    if (severityFilter !== 'all') matches = matches && report.severity === severityFilter
    if (searchQuery) matches = matches && (
      report.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.trackingId.toLowerCase().includes(searchQuery.toLowerCase())
    )
    return matches
  })

  const pendingReports = filteredReports.filter((r) => r.status === 'Pending')
  const underReviewReports = filteredReports.filter((r) => r.status === 'Under Review')
  const approvedReports = filteredReports.filter((r) => r.status === 'Approved')
  const rejectedReports = filteredReports.filter((r) => r.status === 'Rejected')
  const convertedReports = filteredReports.filter((r) => r.status === 'Converted to Investigation')

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      'Critical': 'bg-red-100 text-red-800',
      'High': 'bg-orange-100 text-orange-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-green-100 text-green-800',
    }
    return colors[severity] || 'bg-gray-100 text-gray-800'
  }

  const handleApprove = (reportId: string) => {
    toast.success('Report approved and will be converted to investigation')
  }

  const handleReject = (reportId: string, reason: string) => {
    toast.success('Report rejected')
  }

  const handleConvertToInvestigation = (reportId: string) => {
    toast.success('Report converted to investigation case')
  }

  const reportStats = {
    total: mockPublicReports.length,
    pending: pendingReports.length,
    underReview: underReviewReports.length,
    approved: approvedReports.length,
    rejected: rejectedReports.length,
    converted: convertedReports.length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Public Report Intake</h1>
        <p className="text-gray-600">Review and process reports submitted by the public</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Reports</p>
          <p className="text-2xl font-bold mt-2 text-gray-900">{reportStats.total}</p>
        </Card>
        <Card className="p-4 border-yellow-200 bg-yellow-50">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold mt-2 text-yellow-700">{reportStats.pending}</p>
        </Card>
        <Card className="p-4 border-blue-200 bg-blue-50">
          <p className="text-sm text-gray-600">Under Review</p>
          <p className="text-2xl font-bold mt-2 text-blue-700">{reportStats.underReview}</p>
        </Card>
        <Card className="p-4 border-green-200 bg-green-50">
          <p className="text-sm text-gray-600">Approved</p>
          <p className="text-2xl font-bold mt-2 text-green-700">{reportStats.approved}</p>
        </Card>
        <Card className="p-4 border-red-200 bg-red-50">
          <p className="text-sm text-gray-600">Rejected</p>
          <p className="text-2xl font-bold mt-2 text-red-700">{reportStats.rejected}</p>
        </Card>
        <Card className="p-4 border-purple-200 bg-purple-50">
          <p className="text-sm text-gray-600">Converted</p>
          <p className="text-2xl font-bold mt-2 text-purple-700">{reportStats.converted}</p>
        </Card>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <div className="flex gap-4 flex-wrap items-center">
          <div className="flex-1 min-w-72 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by title, tracking ID, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Converted to Investigation">Converted</SelectItem>
            </SelectContent>
          </Select>

          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pendingReports.length})</TabsTrigger>
            <TabsTrigger value="review">Under Review ({underReviewReports.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedReports.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedReports.length})</TabsTrigger>
            <TabsTrigger value="converted">Converted ({convertedReports.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <div className="space-y-3">
              {pendingReports.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No pending reports</p>
              ) : (
                pendingReports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    getSeverityColor={getSeverityColor}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="review" className="space-y-4">
            <div className="space-y-3">
              {underReviewReports.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No reports under review</p>
              ) : (
                underReviewReports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    getSeverityColor={getSeverityColor}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            <div className="space-y-3">
              {approvedReports.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No approved reports</p>
              ) : (
                approvedReports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    getSeverityColor={getSeverityColor}
                    readonly
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            <div className="space-y-3">
              {rejectedReports.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No rejected reports</p>
              ) : (
                rejectedReports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    getSeverityColor={getSeverityColor}
                    readonly
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="converted" className="space-y-4">
            <div className="space-y-3">
              {convertedReports.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No converted reports</p>
              ) : (
                convertedReports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    getSeverityColor={getSeverityColor}
                    readonly
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface ReportCardProps {
  report: typeof mockPublicReports[0]
  onApprove: (id: string) => void
  onReject: (id: string, reason: string) => void
  getSeverityColor: (severity: string) => string
  readonly?: boolean
}

function ReportCard({
  report,
  onApprove,
  onReject,
  getSeverityColor,
  readonly = false,
}: ReportCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const getStatusIcon = (status: string) => {
    if (status === 'Approved') return <CheckCircle className="h-5 w-5 text-green-600" />
    if (status === 'Rejected') return <XCircle className="h-5 w-5 text-red-600" />
    if (status === 'Converted to Investigation') return <FileText className="h-5 w-5 text-blue-600" />
    if (status === 'Pending') return <AlertTriangle className="h-5 w-5 text-yellow-600" />
    return null
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            {getStatusIcon(report.status)}
            <h4 className="font-semibold text-gray-900">{report.title || report.description.substring(0, 50)}</h4>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Badge className={getSeverityColor(report.severity)}>{report.severity}</Badge>
            <span className="text-xs text-gray-500">ID: {report.trackingId}</span>
            <span className="text-xs text-gray-500">{report.county}</span>
            <span className="text-xs text-gray-500">{report.reportType}</span>
            {report.anonymous && <Badge variant="outline">Anonymous</Badge>}
          </div>

          {expanded && (
            <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Description:</p>
                <p className="text-sm text-gray-700 mt-1">{report.description}</p>
              </div>

              {report.entity && (
                <div>
                  <p className="text-sm font-medium text-gray-900">Entity: {report.entity}</p>
                </div>
              )}

              {report.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-900">Notes: {report.notes}</p>
                </div>
              )}

              {report.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="text-sm font-medium text-red-900">Rejection Reason:</p>
                  <p className="text-sm text-red-800">{report.rejectionReason}</p>
                </div>
              )}

              {report.createdInvestigationId && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-sm font-medium text-blue-900">Investigation Case #{report.createdInvestigationId}</p>
                </div>
              )}

              {!readonly && report.status === 'Pending' && (
                <div className="flex gap-2 pt-3">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => onApprove(report.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onReject(report.id, rejectReason)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>
    </div>
  )
}
