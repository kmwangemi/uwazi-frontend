'use client'

import { getRiskColor, getRiskLabel } from '@/lib/formatters'

interface RiskScoreMeterProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function RiskScoreMeter({ score, size = 'md', showLabel = true }: RiskScoreMeterProps) {
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (score / 100) * circumference

  const sizeMap = {
    sm: { container: 'w-20 h-20', text: 'text-lg' },
    md: { container: 'w-32 h-32', text: 'text-3xl' },
    lg: { container: 'w-48 h-48', text: 'text-5xl' }
  }

  const colorClass = getRiskColor(score)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative inline-flex items-center justify-center ${sizeMap[size].container}`}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`transition-all duration-300 ${colorClass}`}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
          />
        </svg>
        <span className={`relative font-bold ${sizeMap[size].text} ${colorClass}`}>
          {score}
        </span>
      </div>
      {showLabel && (
        <div className="text-center">
          <p className="text-xs font-semibold text-gray-700">{getRiskLabel(score)}</p>
        </div>
      )}
    </div>
  )
}
