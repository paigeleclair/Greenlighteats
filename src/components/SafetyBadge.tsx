import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { SafetyLevel } from '../types';

interface SafetyBadgeProps {
  level: SafetyLevel;
  size?: 'sm' | 'md' | 'lg';
  percentage?: number;
}

export function SafetyBadge({ level, size = 'sm', percentage }: SafetyBadgeProps) {
  const config = {
    safe: {
      icon: CheckCircle,
      label: 'Safe',
      bg: 'bg-green-50',
      text: 'text-[#2D7A46]',
      border: 'border-[#2D7A46]'
    },
    caution: {
      icon: AlertTriangle,
      label: 'Caution',
      bg: 'bg-yellow-50',
      text: 'text-[#C79A00]',
      border: 'border-[#C79A00]'
    },
    unsafe: {
      icon: XCircle,
      label: 'Unsafe',
      bg: 'bg-red-50',
      text: 'text-[#B55454]',
      border: 'border-[#B55454]'
    }
  };

  const { icon: Icon, label, bg, text, border } = config[level];
  const iconSize = size === 'lg' ? 24 : size === 'md' ? 20 : 16;
  const padding = size === 'lg' ? 'px-4 py-2' : size === 'md' ? 'px-3 py-1.5' : 'px-2 py-1';

  return (
    <div className={`inline-flex items-center gap-1.5 ${bg} ${text} ${border} border rounded-full ${padding}`}>
      <Icon size={iconSize} />
      <span className={size === 'lg' ? 'text-sm' : 'text-xs'}>
        {label}
        {percentage !== undefined && ` (${percentage}%)`}
      </span>
    </div>
  );
}