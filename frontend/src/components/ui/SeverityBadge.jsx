import React from 'react';
import { getSeverityConfig } from '../../constants/classifications';

export function SeverityBadge({ score, label, className = '' }) {
  const config = label ? null : getSeverityConfig(score);
  const displayLabel = label || config?.label || 'ADVISORY';

  const styleMap = {
    CRITICAL: 'bg-red-50 text-red-700 border-red-200 font-bold',
    SEVERE: 'bg-orange-50 text-orange-800 border-orange-200 font-bold',
    MODERATE: 'bg-amber-50 text-amber-800 border-amber-200 font-bold',
    ADVISORY: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold',
    LOW: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold',
  };

  const badgeStyle = styleMap[displayLabel] || styleMap.ADVISORY;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-2xs font-mono font-semibold uppercase tracking-wider border whitespace-nowrap shrink-0 ${badgeStyle} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
      <span>{displayLabel}</span>
      {score !== undefined && (
        <span className="opacity-80 font-normal">({(score * 100).toFixed(0)}%)</span>
      )}
    </span>
  );
}
