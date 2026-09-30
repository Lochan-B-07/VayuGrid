import React from 'react';
import { SeverityBadge } from '../ui/SeverityBadge';
import { ClassificationTag } from '../ui/ClassificationTag';
import { VernacularAudioPlayer } from '../audio/VernacularAudioPlayer';
import { ShieldCheck, CheckCircle, FileText, AlertTriangle, ArrowRight, MapPin } from 'lucide-react';
import { CLASSIFICATION_META } from '../../constants/classifications';

export function AuditResultCard({ result }) {
  if (!result) return null;

  if (result.is_valid === false || result.status === 'REJECTED_SPOOF') {
    const isCleanAir = (result.rejection_reason || '').includes('NO_HAZARD') || (result.rejection_reason || '').toLowerCase().includes('clean');

    if (isCleanAir) {
      return (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-5 sm:p-6 space-y-4 shadow-sm animate-fade-in text-slate-800 min-w-0 w-full overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200 pb-3 min-w-0">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="h-6 px-2.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono text-2xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                <span>CLEAN AIR CONFIRMED</span>
              </span>
              <span className="font-mono text-xs font-bold text-slate-700 font-tabular bg-emerald-100/60 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                {result.ticket_id}
              </span>
            </div>
            <span className="text-3xs font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-medium shrink-0">
              VERIFIED CLEAN
            </span>
          </div>
          <div className="p-4 rounded-lg bg-white border border-emerald-200 shadow-2xs min-w-0">
            <p className="text-xs font-bold text-emerald-800 mb-1">Optical Inspection Assessment:</p>
            <p className="text-xs text-slate-700 leading-relaxed font-mono break-words">
              {result.rejection_reason || 'Outdoor scene analyzed shows clean air with clear sky and no visible smoke or particulate plume.'}
            </p>
          </div>
          <p className="text-2xs text-slate-500 leading-normal">
            Gemini Vision verified that this location currently exhibits clear air quality without active combustion flares, toxic smoke, or unmitigated construction dust.
          </p>
        </div>
      );
    }

    return (
      <div className="bg-rose-50 border border-rose-300 rounded-xl p-5 sm:p-6 space-y-4 shadow-sm animate-fade-in text-slate-800 min-w-0 w-full overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-200 pb-3 min-w-0">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="h-6 px-2.5 rounded bg-rose-100 text-rose-700 border border-rose-300 font-mono text-2xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0">
              <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
              <span>ANTI-SPOOF REJECTED</span>
            </span>
            <span className="font-mono text-xs font-bold text-slate-700 font-tabular bg-rose-100/60 px-2 py-0.5 rounded border border-rose-200 shrink-0">
              {result.ticket_id}
            </span>
          </div>
          <span className="text-3xs font-mono text-rose-600 bg-rose-100 px-2 py-0.5 rounded border border-rose-200 font-medium shrink-0">
            AI AUDIT REJECTED
          </span>
        </div>
        <div className="p-4 rounded-lg bg-white border border-rose-200 shadow-2xs min-w-0">
          <p className="text-xs font-bold text-rose-800 mb-1">Reason for Rejection:</p>
          <p className="text-xs text-slate-700 leading-relaxed font-mono break-words">
            {result.rejection_reason || 'Image failed anti-spoofing verification or depicts an indoor scene.'}
          </p>
        </div>
        <p className="text-2xs text-slate-500 leading-normal">
          VayuGrid's Gemini AI filter ensures only genuine outdoor pollution photographs trigger municipal emergency work orders.
        </p>
      </div>
    );
  }

  const meta = CLASSIFICATION_META[result.classification] || {};

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm animate-fade-in w-full max-w-full overflow-hidden min-w-0 text-slate-800">
      {/* Top Banner: Verification Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 min-w-0">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <span className="h-6 px-2.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono text-2xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>FORENSIC VERIFIED</span>
          </span>
          <span className="font-mono text-xs font-bold text-slate-800 font-tabular truncate min-w-0">
            {result.ticket_id}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <SeverityBadge score={result.severity_score} />
          <div className="text-right font-mono">
            <span className="text-3xs text-slate-500 block">AI CONFIDENCE</span>
            <span className="text-xs font-bold text-emerald-700 font-tabular">
              {((result.confidence || 0.94) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Primary Classification & Statutory Standard */}
      <div className="grid grid-cols-1 gap-3 min-w-0">
        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5 min-w-0 overflow-hidden">
          <span className="text-2xs font-mono font-bold uppercase tracking-wider text-slate-500 block">
            Statutory Source Classification
          </span>
          <div className="min-w-0 overflow-hidden">
            <ClassificationTag classificationKey={result.classification} />
          </div>
          {meta.statutoryRef && (
            <p className="text-2xs font-mono text-slate-600 mt-2 pt-2 border-t border-slate-200/80 break-words">
              LEGAL CLAUSE: {meta.statutoryRef}
            </p>
          )}
        </div>

        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5 min-w-0 overflow-hidden">
          <span className="text-2xs font-mono font-bold uppercase tracking-wider text-slate-500 block">
            Automated ULB Mitigation Directive
          </span>
          <p className="text-xs font-bold text-amber-800 break-words">
            {meta.actionRequired || 'Rapid Municipal Squad Dispatch'}
          </p>
          <div className="flex items-center gap-1.5 text-2xs text-slate-600 font-mono mt-2 pt-2 border-t border-slate-200/80 min-w-0">
            <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
            <span className="truncate">GEO-FENCED WARD: {result.location?.ward_no || 'Ward 18-N'}</span>
          </div>
        </div>
      </div>

      {/* Identified Visual Spectral Markers */}
      {result.visual_markers?.length > 0 && (
        <div className="space-y-2 min-w-0">
          <span className="text-2xs font-mono font-bold uppercase tracking-wider text-slate-600 block">
            Gemini Vision Multi-Spectral Markers Identified:
          </span>
          <div className="grid grid-cols-1 gap-1.5 min-w-0">
            {result.visual_markers.map((marker, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-700 font-sans min-w-0 overflow-hidden"
              >
                <CheckCircle className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span className="break-words min-w-0">{marker}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Integrated Multilingual Vernacular Audio Broadcast */}
      <div className="pt-1 min-w-0 overflow-hidden">
        <VernacularAudioPlayer activeIncident={result} title="Incident Health Warning Broadcast" />
      </div>
    </div>
  );
}
