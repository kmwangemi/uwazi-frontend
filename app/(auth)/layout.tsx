import { ReactNode } from 'react'

export default function AuthLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary via-blue-50 to-blue-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="text-4xl font-bold text-primary mb-2">PROCMON</div>
          <p className="text-sm text-gray-600">
            Kenya's Procurement Monitoring System
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Fighting corruption to protect public funds
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
