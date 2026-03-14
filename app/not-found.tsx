import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0c0f] flex items-center justify-center p-4">
      <Card className="bg-[#121418] border-[#1f2937] p-8 max-w-md text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-16 h-16 text-[#f59e0b]" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2 font-mono">404</h1>
        <h2 className="text-xl font-semibold text-white mb-2">Page Not Found</h2>
        <p className="text-[#94a3b8] mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button className="w-full bg-[#00ff88] text-black hover:bg-[#00ff88]/90">
            Return to Dashboard
          </Button>
        </Link>
      </Card>
    </div>
  )
}
