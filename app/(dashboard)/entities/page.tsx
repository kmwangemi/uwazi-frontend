'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/shared/Pagination'
import { mockTenders } from '@/lib/mockData'
import { Badge } from '@/components/ui/badge'
import { Eye, Search, Download } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'
import { exportToCSV } from '@/lib/exportUtils'
import { toast } from 'sonner'

const ITEMS_PER_PAGE = 10

export default function EntitiesPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [countyFilter, setCountyFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE)

  // Get unique entities from tenders
  const entities = useMemo(() => {
    const entityMap = new Map()
    mockTenders.forEach((tender) => {
      if (!entityMap.has(tender.procuringEntity)) {
        const entity = mockTenders.filter((t) => t.procuringEntity === tender.procuringEntity)
        entityMap.set(tender.procuringEntity, {
          id: tender.procuringEntity,
          name: tender.procuringEntity,
          county: tender.county,
          tenderCount: entity.length,
          totalSpent: entity.reduce((sum, t) => sum + t.budgetedAmount, 0),
          averageRisk:
            entity.reduce((sum, t) => sum + t.corruptionRisk, 0) / entity.length,
        })
      }
    })
    return Array.from(entityMap.values())
  }, [])

  const filteredEntities = useMemo(() => {
    let result = [...entities]

    if (search) {
      result = result.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (countyFilter !== 'all') {
      result = result.filter((e) => e.county === countyFilter)
    }

    return result.sort((a, b) => b.totalSpent - a.totalSpent)
  }, [entities, search, countyFilter])

  const counties = [...new Set(entities.map((e) => e.county))].sort()
  const totalPages = Math.ceil(filteredEntities.length / itemsPerPage)
  const paginatedEntities = filteredEntities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleExport = () => {
    const dataToExport = filteredEntities.map((e) => ({
      'Entity Name': e.name,
      County: e.county,
      'Tenders Posted': e.tenderCount,
      'Total Spent': formatCurrency(e.totalSpent),
      'Average Risk': e.averageRisk.toFixed(2),
    }))
    exportToCSV(dataToExport, `entities_${new Date().toISOString().split('T')[0]}`)
    toast.success('Entities exported successfully')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Procuring Entities</h1>
          <p className="text-gray-600">Analyze government entities and their procurement patterns</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-6">
        <div className="flex gap-4 flex-wrap items-center">
          <div className="flex-1 min-w-72 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search entities..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10"
            />
          </div>

          <Select value={countyFilter} onValueChange={(value) => {
            setCountyFilter(value)
            setCurrentPage(1)
          }}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by county" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Counties</SelectItem>
              {counties.map((county) => (
                <SelectItem key={county} value={county}>
                  {county}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="ml-auto text-sm text-gray-600">
            {filteredEntities.length} entit{filteredEntities.length !== 1 ? 'ies' : 'y'}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Entity Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">County</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Tenders Posted</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Total Spent</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Avg Risk</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEntities.map((entity) => (
                <tr key={entity.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">{entity.name}</td>
                  <td className="py-3 px-4 text-gray-700">{entity.county}</td>
                  <td className="py-3 px-4 text-gray-700">{entity.tenderCount}</td>
                  <td className="py-3 px-4 text-gray-900 font-medium">{formatCurrency(entity.totalSpent)}</td>
                  <td className="py-3 px-4">
                    <Badge
                      className={
                        entity.averageRisk >= 70
                          ? 'bg-red-100 text-red-800'
                          : entity.averageRisk >= 40
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }
                    >
                      {entity.averageRisk.toFixed(0)}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/entities/${entity.id}`)}
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
