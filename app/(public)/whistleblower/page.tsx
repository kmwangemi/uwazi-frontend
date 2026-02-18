'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle, Lock, Eye, EyeOff } from 'lucide-react'
import { whistleblowerFormSchema, type WhistleblowerFormData } from '@/lib/validations'
import { PROCUREMENT_CATEGORIES, KENYA_COUNTIES } from '@/lib/constants'

type FormState = { submitted: false } | { submitted: true; trackingId: string };

export default function WhistleblowerPage() {
  const [state, setState] = useState<FormState>({ submitted: false })
  const [showTrackingInfo, setShowTrackingInfo] = useState(true)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<WhistleblowerFormData>({
    resolver: zodResolver(whistleblowerFormSchema),
  })

  const reportType = watch('report_type')

  const onSubmit = async (data: WhistleblowerFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate tracking ID
      const trackingId = `TRACK-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
      setState({ submitted: true, trackingId })
    } catch (error) {
      console.error('Error submitting report:', error)
    }
  }

  if (state.submitted) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <Card className="p-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Lock className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Report Submitted Successfully</h1>
            <p className="mt-2 text-gray-600">
              Your anonymous report has been securely submitted and is now under review.
            </p>

            {/* Tracking ID */}
            <div className="mt-8 rounded-lg bg-gray-50 p-6">
              <p className="text-sm font-medium text-gray-700">Your Tracking ID</p>
              <p className="mt-2 font-mono text-xl font-bold text-primary">{state.trackingId}</p>
              <p className="mt-3 text-sm text-gray-600">
                Save this ID to check the status of your report at any time. Do not share it with others.
              </p>
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText(state.trackingId)
                  alert('Copied to clipboard')
                }}
                className="mt-4"
              >
                Copy ID
              </Button>
            </div>

            {/* Next Steps */}
            <div className="mt-8 text-left">
              <h2 className="font-semibold text-gray-900">What Happens Next?</h2>
              <ol className="mt-4 space-y-3 text-sm text-gray-600">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs font-semibold">1</span>
                  <span>Our team will review your report within 2-3 business days</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs font-semibold">2</span>
                  <span>If additional information is needed, we will contact you securely</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs font-semibold">3</span>
                  <span>You can track progress using your tracking ID</span>
                </li>
              </ol>
            </div>

            <Button className="mt-8 w-full" onClick={() => window.location.href = '/transparency'}>
              Return to Portal
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Report Corruption Anonymously</h1>
          <p className="mt-2 text-gray-600">
            Help us fight procurement fraud. Your anonymity is protected by law.
          </p>
        </div>

        {/* Anonymity Notice */}
        <Card className="mb-8 border-green-200 bg-green-50 p-4 sm:p-6">
          <div className="flex gap-3 sm:gap-4">
            <Lock className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900">Your Anonymity is Guaranteed</h3>
              <p className="mt-1 text-sm text-green-800">
                All reports are encrypted and confidential. We do not collect IP addresses or device identifiers. You are legally protected as a whistleblower.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type of Corruption Report <span className="text-red-500">*</span>
              </label>
              <select
                {...register('report_type')}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select report type...</option>
                <option value="PRICE_INFLATION">Price Inflation</option>
                <option value="GHOST_SUPPLIER">Ghost Supplier</option>
                <option value="CONFLICT_OF_INTEREST">Conflict of Interest</option>
                <option value="BRIBERY_KICKBACKS">Bribery/Kickbacks</option>
                <option value="TENDER_MANIPULATION">Tender Manipulation</option>
                <option value="OTHER">Other</option>
              </select>
              {errors.report_type && (
                <p className="mt-1 text-sm text-red-600">{errors.report_type.message}</p>
              )}
            </div>

            {/* Tender Information */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tender Number (Optional)
                </label>
                <Input
                  placeholder="e.g., TND/2024/001"
                  {...register('tender_number')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  County
                </label>
                <select
                  {...register('county')}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select county...</option>
                  {KENYA_COUNTIES.map(county => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('description')}
                placeholder="Provide as much detail as possible. Include dates, names, amounts, and specific evidence."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                rows={6}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-600">Minimum 100 characters required</p>
            </div>

            {/* Contact Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (Optional - for follow-up)
              </label>
              <Input
                type="email"
                placeholder="your-email@example.com"
                {...register('email')}
              />
              <p className="mt-1 text-xs text-gray-600">Will only be used to contact you securely about your report</p>
            </div>

            {/* Agreement */}
            <Card className="border-orange-200 bg-orange-50 p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-orange-600 mt-0.5" />
                <div className="text-sm text-orange-800">
                  <p className="font-semibold">Important</p>
                  <p className="mt-1">
                    Please ensure all information provided is factual to the best of your knowledge. False reports may have legal consequences.
                  </p>
                </div>
              </div>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Anonymous Report'}
            </Button>
          </form>
        </Card>

        {/* Tracking Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already submitted a report? <a href="/whistleblower/track" className="font-semibold text-primary hover:underline">Track its status here</a>
          </p>
        </div>

        {/* Guidelines */}
        <Card className="mt-8 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Reporting Guidelines</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900">What to Include</h3>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Specific dates and amounts</li>
                <li>Names of individuals involved</li>
                <li>Entity or department names</li>
                <li>Tender or contract numbers</li>
                <li>Any documentation or evidence</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Legal Protection</h3>
              <p className="mt-2">
                You are protected under the Whistleblower Protection Act. Retaliation against whistleblowers is illegal.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
