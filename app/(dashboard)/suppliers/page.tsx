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
import { Pagination } from '@/components/shared/Pagination'
import { NewSupplierDialog } from '@/components/dialogs/NewSupplierDialog'
import { mockSuppliers } from '@/lib/mockData'
import { Badge } from '@/components/ui/badge'
import { Plus, Download, Eye, CheckCircle, AlertCircle, Search } from 'lucide-react'
import { exportToCSV } from '@/lib/exportUtils'
import { toast } from 'sonner'

const ITEMS_PER_PAGE = 9

export default function SuppliersPage() {
  const router = useRouter()
  const [verificationFilter, setVerificationFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE)
  const [newSupplierDialogOpen, setNewSupplierDialogOpen] = useState(false)

  const filteredSuppliers = useMemo(() => {
    let result = [...mockSuppliers]

    if (verificationFilter !== 'all') {
      result = result.filter((s) => s.verificationStatus === verificationFilter)
    }

    if (searchQuery) {
      result = result.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.county.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return result
  }, [verificationFilter, searchQuery])

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage)
  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getVerificationColor = (status: string) => {
    const colors: Record<string, string> = {
      'Verified': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Flagged': 'bg-orange-100 text-orange-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getVerificationIcon = (status: string) => {
    if (status === 'Verified') return <CheckCircle className="h-4 w-4 text-green-600" />
    if (status === 'Flagged') return <AlertCircle className="h-4 w-4 text-orange-600" />
    return null
  }

  const handleExport = () => {
    const dataToExport = filteredSuppliers.map((s) => ({
      Name: s.name,
      'Registration Number': s.registrationNumber,
      'Tax Number': s.taxNumber || 'N/A',
      County: s.county,
      'Year Registered': s.yearRegistered,
      'Verification Status': s.verificationStatus,
      'Tenders Completed': s.completedTenders,
    }))
    exportToCSV(dataToExport, `suppliers_${new Date().toISOString().split('T')[0]}`)
    toast.success('Suppliers exported successfully')
  }

  const handleNewSupplier = (supplierData: any) => {
    toast.success('Supplier will be added soon')
    setNewSupplierDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-gray-600">Verify and monitor supplier information</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={() => setNewSupplierDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>
      </div>

      <NewSupplierDialog 
        open={newSupplierDialogOpen} 
        onOpenChange={setNewSupplierDialogOpen}
        onSubmit={handleNewSupplier}
      />

      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-6">
        <div className="flex gap-4 flex-wrap items-center">
          <div className="flex-1 min-w-72 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, registration number, or county..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10"
            />
          </div>

          <Select value={verificationFilter} onValueChange={(value) => {
            setVerificationFilter(value)
            setCurrentPage(1)
          }}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Verified">Verified</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Flagged">Flagged</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-auto text-sm text-gray-600">
            {filteredSuppliers.length} supplier{filteredSuppliers.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/suppliers/${supplier.id}`)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                    <p className="text-sm text-gray-600">{supplier.registrationNumber}</p>
                  </div>
                  <Badge className={getVerificationColor(supplier.verificationStatus)}>
                    {supplier.verificationStatus}
                  </Badge>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium text-gray-900">{supplier.county}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Year Registered:</span>
                    <span className="font-medium text-gray-900">{supplier.yearRegistered}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {getVerificationIcon(supplier.verificationStatus)}
                      <span className="text-xs text-gray-600">
                        {supplier.completedTenders} tenders completed
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/suppliers/${supplier.id}`)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
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
    </div>
  )
}
