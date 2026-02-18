import { ReactNode } from 'react'
import { PublicLayout } from '@/components/layout/PublicLayout'

export default function PublicLayoutPage({
  children,
}: {
  children: ReactNode
}) {
  return <PublicLayout>{children}</PublicLayout>
}
