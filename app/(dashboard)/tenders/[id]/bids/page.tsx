'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import { Eye, FileText, CheckCircle, XCircle, AlertCircle, Download, TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'
import { toast } from 'sonner'

// Mock bid data
const mockBids = [
  {
    id: '1',
    supplierId: 'SUP001',
    supplierName: 'BuildTech Solutions',
    biddingPrice: 45000000,
    deliveryTimeline: 120,
    status: 'Submitted',
    submittedDate: '2024-01-10T10:30:00',
    documentCount: 8,
    technicalScore: 85,
    financialScore: 72,
    complianceScore: 90,
    performanceScore: 88,
    totalScore: 83.75,
    recommendation: 'Approve',
  },
  {
    id: '2',
    supplierId: 'SUP002',
    supplierName: 'Quality Construction Ltd',
    biddingPrice: 52000000,
    deliveryTimeline: 105,
    status: 'Submitted',
    submittedDate: '2024-01-10T11:15:00',
    documentCount: 9,
    technicalScore: 78,
    financialScore: 65,
    complianceScore: 88,
    performanceScore: 92,
    totalScore: 80.75,
    recommendation: 'Conditional',
  },
  {
    id: '3',
    supplierId: 'SUP003',
    supplierName: 'Premier Infrastructure',
    biddingPrice: 48500000,
    deliveryTimeline: 130,
    status: 'Under Evaluation',
    submittedDate: '2024-01-09T14:45:00',
    documentCount: 7,
    technicalScore: 92,
    financialScore: 88,
    complianceScore: 95,
    performanceScore: 85,
    totalScore: 90,
    recommendation: 'Approve',
  },
  {
    id: '4',
    supplierId: 'SUP004',
    supplierName: 'Standard Services Co',
    biddingPrice: 55000000,
    deliveryTimeline: 140,
    status: 'Submitted',
    submittedDate: '2024-01-11T09:20:00',
    documentCount: 6,
    technicalScore: 62,
    financialScore: 58,
    complianceScore: 72,
    performanceScore: 70,
    totalScore: 65.5,
    recommendation: 'Reject',
  },
]

export default function BidsPage() {
  const params = useParams()
  const router = useRouter()
  const [sortBy, setSortBy] = useState('score')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBids = useMemo(() => {
    let result = [...mockBids]

    if (searchQuery) {
      result = result.filter((b) =>
        b.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filterStatus !== 'all') {
      result = result.filter((b) => b.status === filterStatus)
    }

    if (sortBy === 'score') {
      result = result.sort((a, b) => b.totalScore - a.totalScore)
    } else if (sortBy === 'price') {
      result = result.sort((a, b) => a.biddingPrice - b.biddingPrice)
    } else if (sortBy === 'date') {
      result = result.sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
    }

    return result
  }, [sortBy, filterStatus, searchQuery])

  const scoreData = filteredBids.map((bid) => ({
    name: bid.supplierName.split(' ')[0],
    Technical: bid.technicalScore,
    Financial: bid.financialScore,
    Compliance: bid.complianceScore,
    Performance: bid.performanceScore,
  }))

  const getRankColor = (index: number) => {
    if (index === 0) return 'bg-yellow-50 border-yellow-200'
    if (index === 1) return 'bg-gray-50 border-gray-200'
    if (index === 2) return 'bg-orange-50 border-orange-200'
    return ''
  }

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation === 'Approve') return 'bg-green-100 text-green-800'
    if (recommendation === 'Reject') return 'bg-red-100 text-red-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bid Evaluation</h1>
        <p className="text-gray-600 mt-1">Tender ID: {params.id}</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="comparison">Price Comparison</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <p className="text-sm text-gray-600 mb-1">Total Bids Received</p>
              <p className="text-2xl font-bold">{mockBids.length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600 mb-1">Average Score</p>
              <p className="text-2xl font-bold">{(mockBids.reduce((sum, b) => sum + b.totalScore, 0) / mockBids.length).toFixed(1)}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600 mb-1">Lowest Bid</p>
              <p className="text-2xl font-bold">{formatCurrency(Math.min(...mockBids.map((b) => b.biddingPrice)))}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600 mb-1">Highest Bid</p>
              <p className="text-2xl font-bold">{formatCurrency(Math.max(...mockBids.map((b) => b.biddingPrice)))}</p>
            </Card>
          </div>

          {/* Scoring Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Bid Scores by Criteria</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="Technical" fill="#3b82f6" />
                <Bar dataKey="Financial" fill="#10b981" />
                <Bar dataKey="Compliance" fill="#f59e0b" />
                <Bar dataKey="Performance" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          {/* Price Range Analysis */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Price Analysis</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={filteredBids.map((b, i) => ({
                name: b.supplierName.split(' ')[0],
                price: b.biddingPrice / 1000000,
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Amount (Millions KSh)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `KSh ${value.toFixed(1)}M`} />
                <Line type="monotone" dataKey="price" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {/* Search and Filter */}
          <Card className="p-4 space-y-4">
            <div className="flex gap-4 flex-wrap items-center">
              <div className="flex-1 min-w-72 relative">
                <Input
                  placeholder="Search supplier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Under Evaluation">Evaluating</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Highest Score</SelectItem>
                  <SelectItem value="price">Lowest Price</SelectItem>
                  <SelectItem value="date">Recently Submitted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Bid Cards Ranked */}
          <div className="space-y-3">
            {filteredBids.map((bid, index) => (
              <Card key={bid.id} className={`p-5 border-2 transition-all ${getRankColor(index)}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {index < 3 && (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
                          {index + 1}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">{bid.supplierName}</h3>
                        <p className="text-sm text-gray-600">{bid.supplierId}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getRecommendationColor(bid.recommendation)}>
                      {bid.recommendation}
                    </Badge>
                    <Badge variant="outline">{bid.status}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <p className="text-xs text-gray-600">Bid Amount</p>
                    <p className="font-semibold">{formatCurrency(bid.biddingPrice)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Delivery (days)</p>
                    <p className="font-semibold">{bid.deliveryTimeline}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Documents</p>
                    <p className="font-semibold">{bid.documentCount}/10</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Total Score</p>
                    <p className="font-semibold text-lg text-blue-600">{bid.totalScore}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Submitted</p>
                    <p className="text-sm">{new Date(bid.submittedDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="bg-white rounded p-2">
                    <p className="text-xs text-gray-600">Technical</p>
                    <p className="font-bold text-blue-600">{bid.technicalScore}</p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <p className="text-xs text-gray-600">Financial</p>
                    <p className="font-bold text-green-600">{bid.financialScore}</p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <p className="text-xs text-gray-600">Compliance</p>
                    <p className="font-bold text-yellow-600">{bid.complianceScore}</p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <p className="text-xs text-gray-600">Performance</p>
                    <p className="font-bold text-purple-600">{bid.performanceScore}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/tenders/${params.id}/bids/${bid.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.success('Downloading bid documents')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Documents
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
