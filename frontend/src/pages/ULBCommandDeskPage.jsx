import React from 'react';
import { PageShell } from '../components/layout/PageShell';
import { useApp } from '../context/AppContext';
import { CommandMap } from '../components/map/CommandMap';
import { IncidentQueue } from '../components/incident/IncidentQueue';
import { IncidentDetailDesk } from '../components/incident/IncidentDetailDesk';
import { LiveTickerStrip } from '../components/charts/LiveTickerStrip';
import { Wind, Truck, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

export function ULBCommandDeskPage() {
  const { incidents, selectedCity, weather } = useApp();

  const criticalCount = incidents.filter((i) => i.severity_score >= 0.8).length;
  const pendingCount = incidents.filter((i) => i.status !== 'DISPATCHED').length;

  return (
    <PageShell className="h-[calc(100vh-4rem)] overflow-hidden flex flex-col justify-between bg-slate-50">
      {/* Executive Command Metric Ribbon */}
      <div className="bg-slate-900 text-white px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 text-3xs font-mono shrink-0 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-400">OFFICER ON DUTY:</span>
          <span className="font-bold text-slate-100">Sh. Rajesh Kumar, Exec. Engineer (Air Quality Cell), MCD Delhi</span>
          <span className="text-slate-600">|</span>
          <span className="bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded border border-blue-700/50">PARICHAY SSO: DL-ENV-4092</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span>STATUTORY DISPATCH AUTHORITY: <strong className="text-emerald-400">ACTIVE</strong></span>
          <span className="text-slate-600">•</span>
          <span>AIR ACT SEC 31A / CAQM GRAP IV</span>
        </div>
      </div>

      <div className="bg-white border-b border-border-subtle px-4 py-2 flex flex-wrap items-center justify-between gap-4 text-xs font-mono shrink-0 shadow-2xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-sans font-bold uppercase text-2xs">MONITORED SECTOR:</span>
            <span className="text-slate-900 font-bold tracking-wide">{selectedCity.name.toUpperCase()} COMMAND GRID</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-slate-500 border-l border-border-subtle pl-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
              <span className="text-red-700 font-bold font-tabular">{criticalCount}</span>
              <span className="text-2xs text-slate-600 font-medium">CRITICAL P0 PLUMES</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-amber-700 font-bold font-tabular">{pendingCount}</span>
              <span className="text-2xs text-slate-600 font-medium">AWAITING DISPATCH</span>
            </div>
          </div>
        </div>

        {/* Micro-Meteorological Readout */}
        <div className="flex items-center gap-4 text-slate-600">
          <div className="flex items-center gap-1.5">
            <Wind className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-slate-800 font-bold font-tabular">
              {weather?.wind_direction || 'NE'} @ {weather?.wind_speed_mps || 4.8} m/s
            </span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <Truck className="h-3.5 w-3.5" />
            <span className="text-2xs">6 SMOG UNITS STANDBY</span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Enterprise Mission Control Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-0 bg-slate-50">
        {/* Left Column: Live Incident Feed & Filter (col-span-3 = 25%) */}
        <div className="lg:col-span-3 h-full overflow-hidden border-r border-border-subtle">
          <IncidentQueue />
        </div>

        {/* Center Column: Real Geographic Leaflet GIS Map with OSM Tiles (col-span-6 = 50%) */}
        <div className="lg:col-span-6 h-full relative overflow-hidden bg-slate-100">
          <CommandMap />
        </div>

        {/* Right Column: Forensic Details & Statutory Dispatch Desk (col-span-3 = 25%) */}
        <div className="lg:col-span-3 h-full overflow-hidden">
          <IncidentDetailDesk />
        </div>
      </div>

      {/* Bottom Mission-Critical System Ticker Strip */}
      <div className="shrink-0">
        <LiveTickerStrip />
      </div>
    </PageShell>
  );
}

export default ULBCommandDeskPage;
