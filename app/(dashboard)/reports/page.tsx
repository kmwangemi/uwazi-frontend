'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/shared/Pagination'
import {
  Download,
  Plus,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Share2,
  Search,
  Edit,
} from 'lucide-react'
import { toast } from 'sonner'

const ITEMS_PER_PAGE = 5

export default function ReportsPage() {
  const [reportType, setReportType] = useState('all')
  const [reportStatus, setReportStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE)
  const [editingReportId, setEditingReportId] = useState<string | null>(null)

  const reports = [
    {
      id: '1',
      name: 'Monthly Procurement Report',
      type: 'Monthly',
      status: 'Ready',
      date: '2024-01-15',
      size: '2.4 MB',
      format: 'PDF',
      generated: true,
    },
    {
      id: '2',
      name: 'High-Risk Tenders Analysis',
      type: 'Analysis',
      status: 'Ready',
      date: '2024-01-14',
      size: '1.8 MB',
      format: 'PDF',
      generated: true,
    },
    {
      id: '3',
      name: 'Quarterly Compliance Report',
      type: 'Quarterly',
      status: 'Generating',
      date: '2024-01-13',
      size: 'N/A',
      format: 'PDF',
      generated: false,
    },
    {
      id: '4',
      name: 'Fraud Investigation Summary',
      type: 'Investigation',
      status: 'Ready',
      date: '2024-01-12',
      size: '3.2 MB',
      format: 'PDF',
      generated: true,
    },
    {
      id: '5',
      name: 'Supplier Verification Report',
      type: 'Supplier',
      status: 'Ready',
      date: '2024-01-11',
      size: '1.5 MB',
      format: 'Excel',
      generated: true,
    },
    {
      id: '6',
      name: 'County Budget Analysis',
      type: 'Analysis',
      status: 'Scheduled',
      date: '2024-01-16',
      size: 'N/A',
      format: 'PDF',
      generated: false,
    },
  ]

  const filteredReports = useMemo(() => {
    let result = reports.filter((report) => {
      let matches = true
      if (reportType !== 'all') matches = matches && report.type === reportType
      if (reportStatus !== 'all') matches = matches && report.status === reportStatus
      if (searchQuery) matches = matches && report.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matches
    })
    return result
  }, [reportType, reportStatus, searchQuery])

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage)
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleGenerateReport = () => {
    toast.success('Report generation started')
  }

  const handleDownloadReport = (reportName: string) => {
    toast.success(`Downloading ${reportName}`)
  }

  const handleShareReport = (reportName: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Procurement Report',
        text: `Check out this report: ${reportName}`,
      }).catch(() => {})
    } else {
      toast.success('Report link copied to clipboard')
    }
  }

  const handleEditReport = (reportId: string) => {
    setEditingReportId(editingReportId === reportId ? null : reportId)
    if (editingReportId !== reportId) {
      toast.success('Editing report schedule')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Ready': 'bg-green-100 text-green-800',
      'Generating': 'bg-yellow-100 text-yellow-800',
      'Scheduled': 'bg-blue-100 text-blue-800',
      'Failed': 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    if (status === 'Ready') return <CheckCircle className="h-4 w-4 text-green-600" />
    if (status === 'Generating') return <Clock className="h-4 w-4 text-yellow-600" />
    if (status === 'Scheduled') return <Clock className="h-4 w-4 text-blue-600" />
    if (status === 'Failed') return <AlertCircle className="h-4 w-4 text-red-600" />
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-gray-600">Generate and manage procurement reports</p>
        </div>
        <Button size="sm" onClick={handleGenerateReport}>
          <Plus className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <Tabs defaultValue="available" className="space-y-4">
        <TabsList>
          <TabsTrigger value="available">Available Reports</TabsTrigger>
          <TabsTrigger value="generate">Generate New</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-6">
            <div className="flex gap-4 flex-wrap items-center">
              <div className="flex-1 min-w-72 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10"
                />
              </div>

              <Select value={reportType} onValueChange={(value) => {
                setReportType(value)
                setCurrentPage(1)
              }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Analysis">Analysis</SelectItem>
                  <SelectItem value="Investigation">Investigation</SelectItem>
                  <SelectItem value="Supplier">Supplier</SelectItem>
                </SelectContent>
              </Select>

              <Select value={reportStatus} onValueChange={(value) => {
                setReportStatus(value)
                setCurrentPage(1)
              }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Ready">Ready</SelectItem>
                  <SelectItem value="Generating">Generating</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>

              <div className="ml-auto text-sm text-gray-600">
                {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="space-y-3">
              {paginatedReports.map((report) => (
                <div
                  key={report.id}
                  className="border border-gray-200 rounded-lg p-4 flex items-start justify-between hover:bg-gray-50"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{report.name}</h4>
                        {getStatusIcon(report.status)}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>Type: {report.type}</span>
                        <span>Format: {report.format}</span>
                        {report.size !== 'N/A' && <span>Size: {report.size}</span>}
                        <span>Generated: {report.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                    {report.generated && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadReport(report.name)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShareReport(report.name)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        </TabsContent>

        <TabsContent value="generate" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Generate New Report</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Report Type
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly Summary</SelectItem>
                    <SelectItem value="quarterly">Quarterly Review</SelectItem>
                    <SelectItem value="analysis">Risk Analysis</SelectItem>
                    <SelectItem value="compliance">Compliance Report</SelectItem>
                    <SelectItem value="investigation">Investigation Report</SelectItem>
                    <SelectItem value="supplier">Supplier Verification</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Report Period
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <Input type="date" placeholder="Start Date" />
                  <Input type="date" placeholder="End Date" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Include Sections
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="summary"
                      defaultChecked
                      className="rounded"
                    />
                    <label htmlFor="summary" className="text-sm text-gray-700">
                      Executive Summary
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="analysis"
                      defaultChecked
                      className="rounded"
                    />
                    <label htmlFor="analysis" className="text-sm text-gray-700">
                      Risk Analysis
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="recommendations"
                      defaultChecked
                      className="rounded"
                    />
                    <label htmlFor="recommendations" className="text-sm text-gray-700">
                      Recommendations
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="data" className="rounded" />
                    <label htmlFor="data" className="text-sm text-gray-700">
                      Detailed Data Tables
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Output Format
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <Button variant="outline">Cancel</Button>
                <Button>Generate Report</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Reports</h3>
            <div className="space-y-3">
              {[
                { name: 'Weekly Fraud Summary', day: 'Every Monday at 8:00 AM', next: '2024-01-22' },
                { name: 'Monthly Performance Report', day: 'First day of month at 9:00 AM', next: '2024-02-01' },
                { name: 'Quarterly Compliance Review', day: 'Every 3 months', next: '2024-04-01' },
              ].map((schedule, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{schedule.name}</p>
                      <p className="text-sm text-gray-600">Scheduled: {schedule.day}</p>
                      <p className="text-sm text-gray-600">Next run: {schedule.next}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditReport(schedule.name)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
