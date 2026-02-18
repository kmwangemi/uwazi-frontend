export function formatCurrency(
  amount: number,
  decimals: boolean = true,
): string {
  // Add this check at the top
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'KSh 0.00';
  }
  if (amount >= 1_000_000_000) {
    return `KSh ${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `KSh ${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `KSh ${(amount / 1_000).toFixed(1)}K`;
  }
  if (decimals) {
    return `KSh ${amount.toLocaleString('en-KE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `KSh ${amount.toLocaleString('en-KE')}`;
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getRiskColor(score: number): string {
  if (score >= 76) return 'text-red-600';
  if (score >= 51) return 'text-orange-500';
  if (score >= 26) return 'text-yellow-500';
  return 'text-green-600';
}

export function getRiskBgColor(score: number): string {
  if (score >= 76) return 'bg-red-100 text-red-800';
  if (score >= 51) return 'bg-orange-100 text-orange-800';
  if (score >= 26) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
}

export function getRiskLabel(score: number): string {
  if (score >= 76) return 'Critical';
  if (score >= 51) return 'High';
  if (score >= 26) return 'Medium';
  return 'Low';
}

export function formatTenderNumber(number: string): string {
  return number.toUpperCase();
}

export function getDaysAgo(date: string | Date): number {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - dateObj.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getStatusBadgeColor(status: string): string {
  const statusLower = status.toLowerCase();
  if (statusLower === 'flagged' || statusLower === 'under_investigation')
    return 'bg-red-100 text-red-800';
  if (statusLower === 'awarded') return 'bg-green-100 text-green-800';
  if (statusLower === 'published') return 'bg-blue-100 text-blue-800';
  if (statusLower === 'cancelled') return 'bg-gray-100 text-gray-800';
  return 'bg-gray-100 text-gray-800';
}

export function truncateText(text: string, length: number = 100): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}
