'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RiskScoreMeter } from '@/components/shared/RiskScoreMeter'
import { Pagination } from '@/components/shared/Pagination'
import { NewTenderDialog } from '@/components/dialogs/NewTenderDialog'
import { mockTenders } from '@/lib/mockData'
import { Badge } from '@/components/ui/badge'
import { Plus, Download, Eye, Search } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { exportToCSV } from '@/lib/exportUtils'
import { toast } from 'sonner'

const ITEMS_PER_PAGE = 10

export default function TendersPage() {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [riskFilter, setRiskFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE)
  const [newTenderDialogOpen, setNewTenderDialogOpen] = useState(false)

  const filteredTenders = useMemo(() => {
    let result = [...mockTenders]

    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter)
    }

    if (riskFilter !== 'all') {
      if (riskFilter === 'high') result = result.filter((t) => t.corruptionRisk >= 70)
      if (riskFilter === 'medium') result = result.filter((t) => t.corruptionRisk >= 40 && t.corruptionRisk < 70)
      if (riskFilter === 'low') result = result.filter((t) => t.corruptionRisk < 40)
    }

    if (searchQuery) {
      result = result.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.procuringEntity.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return result
  }, [statusFilter, riskFilter, searchQuery])

  const totalPages = Math.ceil(filteredTenders.length / itemsPerPage)
  const paginatedTenders = filteredTenders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Open: 'bg-green-100 text-green-800',
      Closed: 'bg-gray-100 text-gray-800',
      Awarded: 'bg-blue-100 text-blue-800',
      'Under Review': 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleExport = () => {
    const dataToExport = filteredTenders.map((t) => ({
      Reference: t.referenceNumber,
      Title: t.title,
      Amount: formatCurrency(t.budgetedAmount),
      Status: t.status,
      'Risk Score': t.corruptionRisk,
      Deadline: formatDate(new Date(t.deadline)),
      Entity: t.procuringEntity,
      County: t.county,
    }))
    exportToCSV(dataToExport, `tenders_${new Date().toISOString().split('T')[0]}`)
    toast.success('Tenders exported successfully')
  }

  const handleNewTender = (tenderData: any) => {
    toast.success('Tender will be created soon')
    setNewTenderDialogOpen(false)
  }

  

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenders</h1>
          <p className="text-gray-600">Manage and monitor all procurement tenders</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={() => setNewTenderDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Tender
          </Button>
        </div>
      </div>

      <NewTenderDialog 
        open={newTenderDialogOpen} 
        onOpenChange={setNewTenderDialogOpen}
        onSubmit={handleNewTender}
      />

      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-6">
        <div className="flex gap-4 flex-wrap items-center">
          <div className="flex-1 min-w-72 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by reference, title, or entity..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={(value) => {
            setStatusFilter(value)
            setCurrentPage(1)
          }}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
              <SelectItem value="Awarded">Awarded</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
            </SelectContent>
          </Select>

          <Select value={riskFilter} onValueChange={(value) => {
            setRiskFilter(value)
            setCurrentPage(1)
          }}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk Levels</SelectItem>
              <SelectItem value="low">Low Risk (0-39)</SelectItem>
              <SelectItem value="medium">Medium Risk (40-69)</SelectItem>
              <SelectItem value="high">High Risk (70+)</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-auto text-sm text-gray-600">
            {filteredTenders.length} tender{filteredTenders.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Reference</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Title</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Risk</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Deadline</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTenders.map((tender) => (
                <tr key={tender.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">{tender.referenceNumber}</td>
                  <td className="py-3 px-4 text-gray-700 max-w-xs truncate">{tender.title}</td>
                  <td className="py-3 px-4 text-gray-900 font-medium">{formatCurrency(tender.budgetedAmount)}</td>
                  <td className="py-3 px-4">
                    <Badge className={getStatusColor(tender.status)}>{tender.status}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <RiskScoreMeter score={tender.corruptionRisk} />
                  </td>
                  <td className="py-3 px-4 text-gray-600">{formatDate(new Date(tender.deadline))}</td>
                  <td className="py-3 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/tenders/${tender.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </div>
  )
}
