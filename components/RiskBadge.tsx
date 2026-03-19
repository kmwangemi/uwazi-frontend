import { cn } from '@/lib/utils';

interface RiskBadgeProps {
  level: 'critical' | 'high' | 'medium' | 'low';
  score?: number;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline';
}

export function RiskBadge({
  level,
  score,
  showScore = true,
  size = 'md',
  variant = 'solid',
}: RiskBadgeProps) {
  const baseClass = 'inline-flex items-center gap-1 font-semibold rounded';

  const variantClasses = {
    solid: {
      critical: 'bg-[#00ff88] text-black',
      high: 'bg-[#ef4444] text-white',
      medium: 'bg-[#f59e0b] text-black',
      low: 'bg-[#64748b] text-white',
    },
    outline: {
      critical: 'border border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5',
      high: 'border border-[#ef4444] text-[#ef4444] bg-[#ef4444]/5',
      medium: 'border border-[#f59e0b] text-[#f59e0b] bg-[#f59e0b]/5',
      low: 'border border-[#64748b] text-[#64748b] bg-[#64748b]/5',
    },
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const labelMap = {
    critical: 'CRITICAL',
    high: 'HIGH',
    medium: 'MEDIUM',
    low: 'LOW',
  };

  return (
    <div
      className={cn(
        baseClass,
        variantClasses[variant][level],
        sizeClasses[size],
        level === 'critical' && 'animate-pulse',
      )}
    >
      <span className='font-mono'>{labelMap[level]}</span>
      {showScore && score !== undefined && (
        <span className='font-mono ml-1'>{score}</span>
      )}
    </div>
  );
}
