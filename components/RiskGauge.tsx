'use client'

import { useEffect, useRef, useState } from 'react'
import { riskColorHex } from '@/lib/utils'

interface RiskGaugeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  label?: string
}

export function RiskGauge({
  score,
  size = 'md',
  animated = true,
  label,
}: RiskGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score)

  // Determine risk level
  const getRiskLevel = (s: number) => {
    if (s >= 75) return 'critical'
    if (s >= 50) return 'high'
    if (s >= 25) return 'medium'
    return 'low'
  }

  const riskLevel = getRiskLevel(score)
  const color = riskColorHex(riskLevel)

  // Animation
  useEffect(() => {
    if (!animated) return
    let frame = 0
    const maxFrames = 60
    const interval = setInterval(() => {
      frame++
      const progress = frame / maxFrames
      const current = Math.round(score * progress)
      setDisplayScore(current)
      if (frame >= maxFrames) clearInterval(interval)
    }, 25)
    return () => clearInterval(interval)
  }, [score, animated])

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const sizeMap = { sm: 80, md: 120, lg: 160 }
    const size_ = sizeMap[size]
    canvas.width = size_
    canvas.height = size_

    const centerX = size_ / 2
    const centerY = size_ / 2
    const radius = size_ / 2 - 8

    // Background circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.strokeStyle = '#1f2937'
    ctx.lineWidth = 8
    ctx.stroke()

    // Progress circle
    const startAngle = -Math.PI / 2
    const endAngle = startAngle + (Math.PI * 2 * displayScore) / 100
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.strokeStyle = color
    ctx.lineWidth = 8
    ctx.lineCap = 'round'
    ctx.stroke()

    // Center circle (cover the lines)
    ctx.fillStyle = '#0a0c0f'
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius - 8, 0, Math.PI * 2)
    ctx.fill()

    // Text
    ctx.font = `bold ${size_ / 3}px "IBM Plex Mono"`
    ctx.fillStyle = '#e0e0e0'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(displayScore.toString(), centerX, centerY - 8)

    ctx.font = `11px "IBM Plex Sans"`
    ctx.fillStyle = '#94a3b8'
    ctx.fillText('RISK', centerX, centerY + 16)
  }, [displayScore, size, color])

  return (
    <div className="flex flex-col items-center gap-2">
      <canvas ref={canvasRef} />
      {label && <p className="text-sm text-[#94a3b8]">{label}</p>}
    </div>
  )
}
