import { clsx, type ClassValue } from 'clsx';
import { format, formatDistance, isValid } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKES(amount?: number | null): string {
  const value = Number(amount ?? 0);
  if (value >= 1_000_000_000) {
    return `KES ${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `KES ${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `KES ${(value / 1_000).toFixed(1)}K`;
  }
  return `KES ${value.toFixed(0)}`;
}

// Format date to Kenyan English convention
export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (!isValid(date)) return isoString;
    return format(date, 'd MMM yyyy');
  } catch {
    return isoString;
  }
}

// Get days until a date
export function daysUntil(isoString: string): number {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

// Get formatted time until deadline
export function timeUntil(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (date < new Date()) return 'Closed';
    return formatDistance(date, new Date(), { addSuffix: true });
  } catch {
    return '';
  }
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

// Risk color utilities
export function riskColor(level: string): string {
  const colors = {
    critical: 'bg-[#00ff88] text-black',
    high: 'bg-[#ef4444] text-white',
    medium: 'bg-[#f59e0b] text-black',
    low: 'bg-[#64748b] text-white',
  };
  return colors[level as keyof typeof colors] || colors.low;
}

export function riskColorHex(level: string): string {
  const colors = {
    critical: '#00ff88',
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#64748b',
  };
  return colors[level as keyof typeof colors] || colors.low;
}

export function riskTextColor(level: string): string {
  const colors = {
    critical: 'text-[#00ff88]',
    high: 'text-[#ef4444]',
    medium: 'text-[#f59e0b]',
    low: 'text-[#64748b]',
  };
  return colors[level as keyof typeof colors] || colors.low;
}

export function riskBgColor(level: string): string {
  const colors = {
    critical: 'bg-[#00ff88]/10',
    high: 'bg-[#ef4444]/10',
    medium: 'bg-[#f59e0b]/10',
    low: 'bg-[#64748b]/10',
  };
  return colors[level as keyof typeof colors] || colors.low;
}

// Percentage change indicator
export function formatDelta(delta: number | undefined): string {
  if (delta === undefined) return '';
  if (delta > 0) return `+${delta.toFixed(1)}%`;
  return `${delta.toFixed(1)}%`;
}

// Deviation percentage
export function formatDeviation(deviation: number): string {
  if (deviation > 0) return `+${deviation.toFixed(1)}%`;
  return `${deviation.toFixed(1)}%`;
}
