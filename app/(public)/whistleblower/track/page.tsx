'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { mockPublicReports } from '@/lib/mockData'
import { Search, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react'

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState('')
  const [foundReport, setFoundReport] = useState<typeof mockPublicReports[0] | null>(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const report = mockPublicReports.find((r) => r.trackingId === trackingId.toUpperCase())
    setFoundReport(report || null)
    setSearched(true)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Under Review': 'bg-blue-100 text-blue-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Converted to Investigation': 'bg-purple-100 text-purple-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      'Critical': 'bg-red-100 text-red-800',
      'High': 'bg-orange-100 text-orange-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-green-100 text-green-800',
    }
    return colors[severity] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    if (status === 'Approved') return <CheckCircle className="h-6 w-6 text-green-600" />
    if (status === 'Rejected') return <XCircle className="h-6 w-6 text-red-600" />
    if (status === 'Converted to Investigation') return <CheckCircle className="h-6 w-6 text-purple-600" />
    if (status === 'Under Review') return <Clock className="h-6 w-6 text-blue-600" />
    if (status === 'Pending') return <AlertCircle className="h-6 w-6 text-yellow-600" />
    return null
  }

  const getProgressSteps = (status: string) => {
    const steps = [
      { name: 'Submitted', completed: true },
      { name: 'Under Review', completed: ['Under Review', 'Approved', 'Rejected', 'Converted to Investigation'].includes(status) },
      { name: 'Decision', completed: ['Approved', 'Rejected', 'Converted to Investigation'].includes(status) },
    ]
    return steps
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Track Your Report</h1>
          <p className="mt-2 text-gray-600">
            Enter your tracking ID to check the status of your submitted report
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tracking ID
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="TRACK-XXXXXXXXXXXX"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="lg">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              <p className="mt-2 text-xs text-gray-600">
                You received this ID when you submitted your report
              </p>
            </div>
          </form>

          {searched && !foundReport && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-red-900 font-semibold">Report Not Found</p>
              <p className="text-sm text-red-800 mt-1">
                No report found with the tracking ID "{trackingId}". Please check that you've entered the correct ID.
              </p>
            </div>
          )}

          {foundReport && (
            <div className="mt-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{foundReport.status}</p>
                </div>
                <div className="text-right">
                  {getStatusIcon(foundReport.status)}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Progress</h3>
                <div className="space-y-3">
                  {getProgressSteps(foundReport.status).map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                          step.completed
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}
                      >
                        {step.completed ? '✓' : index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{step.name}</p>
                        {step.completed && (
                          <p className="text-xs text-green-600">Completed</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {foundReport.status === 'Pending' && (
                <Card className="border-yellow-200 bg-yellow-50 p-4">
                  <p className="text-yellow-900 font-semibold">Under Initial Review</p>
                  <p className="text-sm text-yellow-800 mt-1">
                    Your report is queued for review. Our team typically processes reports within 2-3 business days.
                  </p>
                </Card>
              )}

              {foundReport.status === 'Under Review' && (
                <Card className="border-blue-200 bg-blue-50 p-4">
                  <p className="text-blue-900 font-semibold">Active Investigation</p>
                  <p className="text-sm text-blue-800 mt-1">
                    Our investigation team is currently reviewing your report in detail. You will be notified once a decision is made.
                  </p>
                </Card>
              )}

              {foundReport.status === 'Approved' && (
                <Card className="border-green-200 bg-green-50 p-4">
                  <p className="text-green-900 font-semibold">Approved</p>
                  <p className="text-sm text-green-800 mt-1">
                    Your report has been approved and will be converted into a formal investigation case.
                  </p>
                </Card>
              )}

              {foundReport.status === 'Rejected' && (
                <Card className="border-red-200 bg-red-50 p-4">
                  <p className="text-red-900 font-semibold">Rejected</p>
                  {foundReport.rejectionReason && (
                    <p className="text-sm text-red-800 mt-1">
                      Reason: {foundReport.rejectionReason}
                    </p>
                  )}
                </Card>
              )}

              {foundReport.status === 'Converted to Investigation' && (
                <Card className="border-purple-200 bg-purple-50 p-4">
                  <p className="text-purple-900 font-semibold">Case Created</p>
                  <p className="text-sm text-purple-800 mt-1">
                    Your report has been converted to investigation case #{foundReport.createdInvestigationId}. The investigation team will keep you updated on progress.
                  </p>
                </Card>
              )}

              <div className="border-t border-gray-200 pt-6 space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Report Type</p>
                  <p className="text-sm text-gray-600 mt-1">{foundReport.reportType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Severity</p>
                  <Badge className={getSeverityColor(foundReport.severity)}>{foundReport.severity}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Submitted Date</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(foundReport.submittedDate).toLocaleDateString('en-KE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                {foundReport.reviewedDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last Updated</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(foundReport.reviewedDate).toLocaleDateString('en-KE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}
                {foundReport.county && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">County</p>
                    <p className="text-sm text-gray-600 mt-1">{foundReport.county}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>

        <Card className="mt-8 p-8 bg-blue-50 border-blue-200">
          <h2 className="font-semibold text-blue-900 mb-4">Need Help?</h2>
          <p className="text-sm text-blue-800 mb-4">
            If you have questions about your report or need to submit additional information, please contact us securely.
          </p>
          <Button variant="outline" className="text-blue-600 border-blue-600">
            Contact Support
          </Button>
        </Card>
      </div>
    </div>
  )
}
