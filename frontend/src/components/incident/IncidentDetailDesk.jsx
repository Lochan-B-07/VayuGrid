import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SeverityBadge } from '../ui/SeverityBadge';
import { ClassificationTag } from '../ui/ClassificationTag';
import { 
  Building2, ShieldAlert, AlertTriangle, CheckCircle2, 
  MapPin, Wind, Eye, FileText, Send, Zap, Clock, ShieldCheck, Sparkles, XCircle
} from 'lucide-react';

export function IncidentDetailDesk() {
  const { activeIncident, updateIncidentStatus, addToast } = useApp();
  const [isDispatching, setIsDispatching] = useState(false);

  if (!activeIncident) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-white">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-3 shadow-sm">
          <ShieldAlert className="w-8 h-8 text-slate-400 animate-pulse" />
        </div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
          No Incident Selected
        </h3>
        <p className="text-2xs text-slate-500 mt-1 max-w-[220px] leading-relaxed">
          Select an incident from the queue or map to inspect multimodal forensic telemetry and execute statutory dispatches.
        </p>
      </div>
    );
  }

  const isDispatched = activeIncident.status === 'DISPATCHED';
  const isRejected = activeIncident.status === 'REJECTED_FALSE_POSITIVE';
  const isActionTaken = isDispatched || isRejected;

  const handleQuickDispatch = (action) => {
    setIsDispatching(true);
    setTimeout(() => {
      updateIncidentStatus(activeIncident.ticket_id, 'DISPATCHED');
      setIsDispatching(false);
      addToast({
        type: 'SUCCESS',
        title: 'Statutory Action Dispatched',
        message: `${action.label} initiated under CAQM GRAP IV framework.`,
      });
    }, 600);
  };

  const handleRejectIncident = () => {
    updateIncidentStatus(activeIncident.ticket_id, 'REJECTED_FALSE_POSITIVE');
    addToast({
      type: 'WARNING',
      title: 'Incident Flagged as False Positive',
      message: `Ticket ${activeIncident.ticket_id} dismissed under Rule 14 verification guidelines.`,
    });
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-border-subtle overflow-y-auto">
      {/* Panel Header */}
      <div className="p-4 border-b border-border-subtle bg-gradient-to-b from-white via-white to-slate-50/60 sticky top-0 z-10 shadow-2xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-xs font-bold text-blue-700 font-tabular bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            {activeIncident.ticket_id}
          </span>
          <SeverityBadge score={activeIncident.severity_score} />
        </div>

        <div className="mt-2">
          <ClassificationTag classificationKey={activeIncident.classification} />
        </div>

        <div className="mt-2.5 text-2xs text-slate-500 flex items-center gap-2 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>INGESTED: {new Date(activeIncident.timestamp).toLocaleTimeString()} IST</span>
          <span>•</span>
          <span className={`font-bold px-1.5 py-0.2 rounded text-3xs border ${
            isDispatched 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : isRejected 
                ? 'bg-rose-50 text-rose-800 border-rose-200' 
                : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            {isRejected ? 'REJECTED (FALSE POSITIVE)' : activeIncident.status}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4 text-xs">
        {/* Geolocation Card */}
        <div className="govtech-card p-3.5 bg-gradient-to-br from-white to-slate-50/50">
          <div className="flex items-center gap-1.5 text-2xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>GEO-VERIFIED LOCATION</span>
          </div>
          <p className="text-2xs text-slate-900 leading-snug font-semibold">
            {activeIncident.location.address_hint}
          </p>
          <div className="mt-2 text-3xs font-mono text-slate-500 font-tabular bg-white p-2 rounded border border-slate-200/80 shadow-2xs">
            {activeIncident.location.lat.toFixed(4)}°N, {activeIncident.location.lng.toFixed(4)}°E • <span className="font-semibold text-slate-700">{activeIncident.location.ward_no}</span>
          </div>
        </div>

        {/* Gemini Forensic Visual Markers Card */}
        <div className="govtech-card p-3.5 bg-gradient-to-br from-indigo-50/30 via-white to-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-2xs font-mono font-bold text-indigo-800 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>GEMINI FORENSIC MARKS</span>
            </div>
            <span className="text-3xs font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 font-tabular font-bold shadow-2xs">
              {(activeIncident.confidence * 100).toFixed(0)}% CONF
            </span>
          </div>

          <div className="space-y-2 mt-2">
            {(activeIncident.visual_markers || [
              'Dense toxic particulate plume (>80% Opacity)',
              'Chlorinated PVC & Polymer Pyrolysis Indicators Detected',
              'Open Uncontained Municipal Heap',
            ]).map((marker, idx) => (
              <div key={idx} className="flex items-start gap-2 text-2xs text-slate-800 bg-white p-2 rounded-lg border border-slate-200/70 shadow-2xs">
                <span className="text-indigo-600 font-bold shrink-0 mt-0.5">•</span>
                <span className="leading-snug font-medium">{marker}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sensitive Receptors Breach Table */}
        <div className="govtech-card p-3.5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-2xs font-mono font-bold text-amber-900 uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>DOWNWIND RECEPTORS</span>
            </div>
            <span className="text-3xs font-mono text-slate-500 font-semibold">
              {activeIncident.impacted_infrastructure?.length || 0} BREACHES
            </span>
          </div>

          <div className="space-y-2 mt-2">
            {activeIncident.impacted_infrastructure?.map((infra) => (
              <div
                key={infra.id}
                className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/90 flex items-center justify-between font-mono text-2xs shadow-2xs"
              >
                <div className="truncate max-w-[150px]">
                  <span className="text-slate-900 block truncate font-bold">{infra.name}</span>
                  <span className="text-3xs text-slate-500 uppercase">{infra.type || infra.category}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-red-700 font-bold font-tabular block text-2xs">
                    ETA {infra.eta_minutes || infra.estimated_arrival_minutes}m
                  </span>
                  <span className="text-3xs text-slate-500 font-tabular">{infra.distance_meters}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statutory Enforcement Actions */}
        <div className="pt-2">
          <div className="text-2xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>STATUTORY MITIGATION ACTIONS</span>
          </div>

          <div className="space-y-2.5">
            {activeIncident.mitigation_options?.map((action) => (
              <button
                key={action.action_id}
                onClick={() => handleQuickDispatch(action)}
                disabled={isActionTaken || isDispatching}
                className={`w-full p-3.5 rounded-xl border text-left font-mono transition-all flex flex-col justify-between ${
                  isDispatched
                    ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                    : isRejected
                      ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                      : 'bg-white hover:bg-blue-50/50 border-blue-300 text-slate-900 hover:border-blue-500 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xs font-bold text-blue-900 flex items-center gap-2">
                    <Send className="w-3.5 h-3.5 text-blue-600" />
                    {action.label}
                  </span>
                  {isDispatched && (
                    <span className="text-3xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                      EXECUTED
                    </span>
                  )}
                </div>

                <div className="mt-1.5 flex items-center justify-between text-3xs text-slate-600">
                  <span>{action.depot}</span>
                  <span className="text-blue-700 font-bold font-tabular">ETA {action.response_eta_minutes}m</span>
                </div>
              </button>
            ))}

            {/* Officer False Positive Dismissal Option */}
            {!isActionTaken && (
              <button
                type="button"
                onClick={handleRejectIncident}
                className="w-full mt-2 py-2 px-3 rounded-lg border border-slate-300 hover:border-rose-300 hover:bg-rose-50/50 text-slate-600 hover:text-rose-700 font-mono text-2xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>Flag as False Positive / Dismiss Ticket</span>
              </button>
            )}

            {isRejected && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-2xs text-rose-800 font-mono flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Ticket dismissed as False Positive by Officer on Duty. No municipal units dispatched.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncidentDetailDesk;
