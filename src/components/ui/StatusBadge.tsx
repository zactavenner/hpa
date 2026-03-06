'use client';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'in-progress': 'bg-blue-50 text-blue-700 border-blue-200',
  approved: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  active: 'bg-green-50 text-green-700 border-green-200',
  inactive: 'bg-surface-50 text-surface-500 border-surface-200',
  'rate-limited': 'bg-orange-50 text-orange-700 border-orange-200',
};

const PRIORITY_STYLES: Record<string, string> = {
  low: 'bg-surface-50 text-surface-600 border-surface-200',
  medium: 'bg-blue-50 text-blue-700 border-blue-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
};

interface StatusBadgeProps {
  value: string;
  variant?: 'status' | 'priority';
}

export default function StatusBadge({ value, variant = 'status' }: StatusBadgeProps) {
  const styles = variant === 'priority' ? PRIORITY_STYLES : STATUS_STYLES;
  const style = styles[value] || 'bg-surface-50 text-surface-600 border-surface-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      {value.replace('-', ' ')}
    </span>
  );
}
