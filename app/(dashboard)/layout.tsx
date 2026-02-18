'use client'

import { ReactNode, useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export default function DashboardLayoutPage({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, hydrate } = useAuthStore()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    } else {
      setIsReady(true)
    }
  }, [isAuthenticated, router])

  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <LoadingSpinner text="Loading..." />
      </div>
    )
  }

  return <DashboardLayout>{children}</DashboardLayout>
}
