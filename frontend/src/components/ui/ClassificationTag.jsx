import React from 'react';
import { CLASSIFICATION_META } from '../../constants/classifications';

export function ClassificationTag({ classificationKey, className = '' }) {
  const meta = CLASSIFICATION_META[classificationKey] || {
    code: 'SRC-GEN',
    label: classificationKey?.replace(/_/g, ' ') || 'Unclassified Event',
    color: '#94A3B8',
  };

  return (
    <div className={`flex flex-wrap items-center gap-1.5 min-w-0 ${className}`}>
      <span className="font-mono text-2xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border border-slate-300 dark:border-slate-700 shrink-0">
        {meta.code}
      </span>
      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 break-words leading-snug">
        {meta.label}
      </span>
    </div>
  );
}
