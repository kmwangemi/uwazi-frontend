'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  AlertCircle,
  CheckCircle,
  FileText,
  Download,
  Clock,
  DollarSign,
  Users,
  Award,
  Flag,
  BarChart3,
} from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'
import { toast } from 'sonner'

export default function BidDetailPage() {
  const [technicalScore, setTechnicalScore] = useState(85)
  const [financialScore, setFinancialScore] = useState(72)
  const [complianceScore, setComplianceScore] = useState(90)
  const [performanceScore, setPerformanceScore] = useState(88)
  const [evaluationNotes, setEvaluationNotes] = useState('')
  const [approvalDecision, setApprovalDecision] = useState('pending')
  const [rejectionReason, setRejectionReason] = useState('')
  const [conditions, setConditions] = useState('')

  const totalScore = (technicalScore + financialScore + complianceScore + performanceScore) / 4

  const handleSubmitEvaluation = () => {
    toast.success('Evaluation submitted for approval')
  }

  const handleApprove = () => {
    toast.success('Bid approved successfully')
  }

  const handleReject = () => {
    toast.error('Bid rejected')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bid Evaluation</h1>
          <p className="text-gray-600 mt-1">BuildTech Solutions - Tender TND/2024/001</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800">Under Evaluation</Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="evaluation">Evaluation Scores</TabsTrigger>
          <TabsTrigger value="recommendation">Recommendation</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Supplier Info */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Supplier Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Company Name</p>
                  <p className="font-semibold">BuildTech Solutions</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Registration Number</p>
                  <p className="font-semibold">CPR/2019/45821</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">County</p>
                  <p className="font-semibold">Nairobi</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact Person</p>
                  <p className="font-semibold">James Kipchoge</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-blue-600">james@buildtech.ke</p>
                </div>
              </div>
            </Card>

            {/* Bid Details */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Bid Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Bidding Price</p>
                    <p className="font-semibold">{formatCurrency(45000000)}</p>
                  </div>
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Delivery Timeline</p>
                    <p className="font-semibold">120 days</p>
                  </div>
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Payment Terms</p>
                    <p className="font-semibold">30/30/40 (Milestone Based)</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Submitted Date</p>
                    <p className="font-semibold">Jan 10, 2024 10:30 AM</p>
                  </div>
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </Card>
          </div>

          {/* Red Flags */}
          <Card className="p-6 border-red-200 bg-red-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-900 mb-2">Automated Compliance Checks</h4>
                <ul className="space-y-1 text-sm text-red-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Tax compliance certificate verified
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Company registration valid
                  </li>
                  <li className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-yellow-600" />
                    Price 8% below budget (review justification)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    No conflicts of interest detected
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Submitted Documents</h3>
            <div className="space-y-2">
              {[
                { name: 'Company Registration', verified: true },
                { name: 'Tax Compliance Certificate', verified: true },
                { name: 'Financial Statements (2021-2023)', verified: true },
                { name: 'Bank References', verified: false },
                { name: 'Technical Specifications', verified: true },
                { name: 'Project Experience Certificates', verified: true },
                { name: 'Insurance Policy', verified: true },
                { name: 'Health & Safety Plan', verified: false },
              ].map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-600">Uploaded Jan 10, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={doc.verified ? 'default' : 'outline'}>
                      {doc.verified ? 'Verified' : 'Pending'}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Evaluation Scores Tab */}
        <TabsContent value="evaluation" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-6">Evaluation Scoring</h3>
            
            <div className="space-y-6">
              {/* Technical Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Technical Capability
                  </label>
                  <span className="text-2xl font-bold text-blue-600">{technicalScore}/100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={technicalScore}
                  onChange={(e) => setTechnicalScore(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Evaluate: experience, qualifications, equipment, past projects
                </p>
              </div>

              {/* Financial Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Financial Capability
                  </label>
                  <span className="text-2xl font-bold text-green-600">{financialScore}/100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={financialScore}
                  onChange={(e) => setFinancialScore(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Evaluate: turnover, cash flow, bank references, ability to fund
                </p>
              </div>

              {/* Compliance Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Compliance & Documentation
                  </label>
                  <span className="text-2xl font-bold text-yellow-600">{complianceScore}/100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={complianceScore}
                  onChange={(e) => setComplianceScore(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Evaluate: required documents, certifications, compliance with requirements
                </p>
              </div>

              {/* Performance Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Past Performance
                  </label>
                  <span className="text-2xl font-bold text-purple-600">{performanceScore}/100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={performanceScore}
                  onChange={(e) => setPerformanceScore(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Evaluate: on-time delivery, quality, customer satisfaction, disputes
                </p>
              </div>

              {/* Overall Score */}
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">Overall Score</span>
                  </div>
                  <span className="text-3xl font-bold text-blue-600">{totalScore.toFixed(2)}/100</span>
                </div>
              </Card>
            </div>

            {/* Evaluation Notes */}
            <div className="mt-6">
              <label className="font-semibold block mb-2">Evaluator Notes</label>
              <Textarea
                placeholder="Add detailed evaluation comments..."
                value={evaluationNotes}
                onChange={(e) => setEvaluationNotes(e.target.value)}
                rows={4}
              />
            </div>

            <Button className="mt-4" onClick={handleSubmitEvaluation}>
              Submit Evaluation Scores
            </Button>
          </Card>
        </TabsContent>

        {/* Recommendation Tab */}
        <TabsContent value="recommendation" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Approval Decision</h3>
            
            <div className="space-y-4">
              <div>
                <label className="font-semibold block mb-2">Decision</label>
                <Select value={approvalDecision} onValueChange={setApprovalDecision}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="approve">Approve</SelectItem>
                    <SelectItem value="conditional">Conditional Approval</SelectItem>
                    <SelectItem value="reject">Reject</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {approvalDecision === 'conditional' && (
                <div>
                  <label className="font-semibold block mb-2">Conditions</label>
                  <Textarea
                    placeholder="List conditions that must be met for approval..."
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              {approvalDecision === 'reject' && (
                <div>
                  <label className="font-semibold block mb-2">Rejection Reasons</label>
                  <Textarea
                    placeholder="Explain why this bid is being rejected..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                {approvalDecision === 'approve' && (
                  <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Bid
                  </Button>
                )}
                {approvalDecision === 'reject' && (
                  <Button onClick={handleReject} variant="destructive">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Reject Bid
                  </Button>
                )}
                {approvalDecision === 'conditional' && (
                  <Button onClick={handleApprove} className="bg-yellow-600 hover:bg-yellow-700">
                    <Award className="h-4 w-4 mr-2" />
                    Approve Conditionally
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Audit Trail Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Activity Log</h3>
            <div className="space-y-2">
              {[
                { action: 'Bid Submitted', actor: 'BuildTech Solutions', time: 'Jan 10, 2024 10:30 AM', icon: FileText },
                { action: 'Under Evaluation', actor: 'John Omondi (Evaluator)', time: 'Jan 10, 2024 11:15 AM', icon: Clock },
                { action: 'Documents Verified', actor: 'System Auto-Check', time: 'Jan 10, 2024 11:20 AM', icon: CheckCircle },
              ].map((log, idx) => (
                <div key={idx} className="flex gap-3 pb-3 border-b border-gray-200 last:border-b-0">
                  <div className="mt-1">
                    {<log.icon className="h-5 w-5 text-gray-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{log.action}</p>
                    <p className="text-sm text-gray-600">{log.actor}</p>
                  </div>
                  <p className="text-xs text-gray-500 whitespace-nowrap">{log.time}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
