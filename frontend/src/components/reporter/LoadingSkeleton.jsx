import React from 'react';
import { Cpu, Search, ShieldCheck } from 'lucide-react';

export function LoadingSkeleton() {
  return (
    <div className="bg-app-surface border border-blue-500/50 rounded-lg p-6 space-y-4 animate-pulse">
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Cpu className="h-5 w-5 animate-spin" />
          </div>
          <div>
            <div className="h-4 w-44 bg-slate-700 rounded mb-1.5"></div>
            <div className="h-3 w-64 bg-slate-800 rounded"></div>
          </div>
        </div>
        <div className="h-6 w-24 bg-slate-800 rounded"></div>
      </div>

      {/* Synthetic Forensic Scan Bars */}
      <div className="space-y-2 py-2">
        <div className="flex items-center justify-between text-2xs font-mono text-blue-400">
          <span className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 animate-bounce" />
            <span>RUNNING MULTI-SPECTRAL EMISSION FORENSICS (GEMINI 3.5 FLASH-LITE)</span>
          </span>
          <span>STEP 3 OF 4</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-blue-500 h-full w-3/4 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="h-16 bg-slate-800/80 rounded border border-border-subtle"></div>
        <div className="h-16 bg-slate-800/80 rounded border border-border-subtle"></div>
        <div className="h-16 bg-slate-800/80 rounded border border-border-subtle"></div>
      </div>

      <div className="h-28 bg-slate-800/60 rounded border border-border-subtle"></div>
    </div>
  );
}
