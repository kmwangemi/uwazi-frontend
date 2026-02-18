'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Check, X } from 'lucide-react'

interface Bid {
  id: string
  supplierId: string
  supplierName: string
  bidAmount: number
  dateSubmitted: string
  status: 'Pending' | 'Approved' | 'Rejected'
}

interface SupplierBiddingDialogProps {
  tenderId: string
  tenderTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SupplierBiddingDialog({ tenderId, tenderTitle, open, onOpenChange }: SupplierBiddingDialogProps) {
  const [activeTab, setActiveTab] = useState('submit')
  const [formData, setFormData] = useState({
    supplierName: '',
    bidAmount: '',
  })
  const [bids, setBids] = useState<Bid[]>([
    {
      id: '1',
      supplierId: 'SUP001',
      supplierName: 'ABC Supplies Ltd',
      bidAmount: 850000,
      dateSubmitted: '2024-01-15',
      status: 'Pending',
    },
    {
      id: '2',
      supplierId: 'SUP002',
      supplierName: 'Tech Solutions Inc',
      bidAmount: 920000,
      dateSubmitted: '2024-01-16',
      status: 'Pending',
    },
  ])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.supplierName || !formData.bidAmount) {
      toast.error('Please fill in all fields')
      return
    }

    const newBid: Bid = {
      id: Math.random().toString(),
      supplierId: `SUP${Math.floor(Math.random() * 1000)}`,
      supplierName: formData.supplierName,
      bidAmount: parseFloat(formData.bidAmount),
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'Pending',
    }

    setBids([...bids, newBid])
    toast.success('Bid submitted successfully')
    setFormData({ supplierName: '', bidAmount: '' })
  }

  const handleApproveBid = (bidId: string) => {
    setBids(bids.map((bid) => (bid.id === bidId ? { ...bid, status: 'Approved' } : bid)))
    toast.success('Bid approved')
  }

  const handleRejectBid = (bidId: string) => {
    setBids(bids.map((bid) => (bid.id === bidId ? { ...bid, status: 'Rejected' } : bid)))
    toast.success('Bid rejected')
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Bids for {tenderTitle}</DialogTitle>
          <DialogDescription>Submit, review, and manage supplier bids</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="submit">Submit Bid</TabsTrigger>
            <TabsTrigger value="review">Review Bids ({bids.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="submit" className="space-y-6">
            <form onSubmit={handleSubmitBid} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="supplierName">Your Company Name</Label>
                <Input
                  id="supplierName"
                  name="supplierName"
                  placeholder="Enter company name"
                  value={formData.supplierName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bidAmount">Bid Amount (KSh)</Label>
                <Input
                  id="bidAmount"
                  name="bidAmount"
                  type="number"
                  placeholder="Enter bid amount"
                  value={formData.bidAmount}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">Submit Bid</Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="review" className="space-y-4">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {bids.map((bid) => (
                <div key={bid.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{bid.supplierName}</h4>
                      <p className="text-sm text-gray-600">ID: {bid.supplierId}</p>
                    </div>
                    <Badge className={getStatusColor(bid.status)}>{bid.status}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Bid Amount:</span>
                      <p className="font-semibold text-gray-900">KSh {bid.bidAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Submitted:</span>
                      <p className="font-semibold text-gray-900">{bid.dateSubmitted}</p>
                    </div>
                  </div>

                  {bid.status === 'Pending' && (
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleApproveBid(bid.id)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleRejectBid(bid.id)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
