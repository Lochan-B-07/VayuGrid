import React from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { useApp } from '../context/AppContext';
import { CityBarChart } from '../components/charts/CityBarChart';
import { LiveCounter } from '../components/charts/LiveCounter';
import { LiveTickerStrip } from '../components/charts/LiveTickerStrip';
import { 
  Activity, ShieldAlert, Eye, ArrowRight, Wind, Layers, 
  Cpu, Compass, CheckCircle2, Radio, Zap, AlertTriangle, Building2, Flame, Users 
} from 'lucide-react';

export function LandingPage() {
  const { cities, setSelectedCity } = useApp();

  return (
    <PageShell className="flex flex-col justify-between bg-slate-50 min-h-screen">
      {/* Top Hero Section with Ambient Pattern */}
      <section className="relative border-b border-border-subtle bg-gradient-to-b from-blue-50/50 via-white to-slate-50/80 px-4 py-12 sm:py-16 overflow-hidden">
        {/* Subtle Architectural Dot Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto space-y-8">
          {/* Institutional Badge & Live Status */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-white border border-blue-200 text-blue-700 font-mono text-xs font-bold shadow-2xs">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse"></span>
              <span>HACKATHON TRACK 2: CLEAN AIR & CLIMATE RESILIENCE</span>
            </div>

            <div className="flex items-center gap-3 font-mono text-2xs text-slate-600 bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
              <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>FEDERATED GRID: ACTIVE</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="font-semibold">CAQM GRAP IV PROTOCOL</span>
            </div>
          </div>

          {/* Title & Vision */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 font-sans leading-tight">
              Federated Planetary-to-Pavement Digital Public Good for Air Pollution Governance
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans max-w-3xl font-medium">
              <strong className="text-blue-700 font-bold">VayuGrid (वायु-सूत्र)</strong> connects statutory CPCB IoT sensor telemetry, multimodal Gemini 3.5 Flash-Lite forensic image verification, and atmospheric Gaussian plume physics into an automated municipal enforcement grid.
            </p>
          </div>

          {/* Elevated Live National KPI Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3">
            {/* KPI 1: Active Plumes */}
            <div className="govtech-card overflow-hidden group hover:-translate-y-0.5 transition-all">
              <div className="h-1 bg-gradient-to-r from-red-500 to-rose-600" />
              <div className="p-5">
                <div className="flex items-center justify-between text-2xs font-mono text-slate-500 mb-2">
                  <span className="font-bold">ACTIVE CRITICAL PLUMES</span>
                  <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                    <Flame className="w-4 h-4 animate-pulse" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-red-700 font-tabular tracking-tight">
                  <LiveCounter value={12} duration={900} />
                </div>
                <span className="text-3xs text-slate-500 mt-1.5 block font-mono font-semibold">P0 STATUTORY BREACHES</span>
              </div>
            </div>

            {/* KPI 2: Exposed Citizens */}
            <div className="govtech-card overflow-hidden group hover:-translate-y-0.5 transition-all">
              <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
              <div className="p-5">
                <div className="flex items-center justify-between text-2xs font-mono text-slate-500 mb-2">
                  <span className="font-bold">DOWNWIND CITIZENS</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-amber-700 font-tabular tracking-tight">
                  <LiveCounter value={42850} duration={1100} />
                </div>
                <span className="text-3xs text-slate-500 mt-1.5 block font-mono font-semibold">2.5KM PLUME ENVELOPE</span>
              </div>
            </div>

            {/* KPI 3: Stations Online */}
            <div className="govtech-card overflow-hidden group hover:-translate-y-0.5 transition-all">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
              <div className="p-5">
                <div className="flex items-center justify-between text-2xs font-mono text-slate-500 mb-2">
                  <span className="font-bold">CAAQMS SENSORS</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                    <Radio className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-blue-700 font-tabular tracking-tight">
                  <LiveCounter value={218} duration={800} />
                </div>
                <span className="text-3xs text-slate-500 mt-1.5 block font-mono font-semibold">CONTINUOUS TELEMETRY</span>
              </div>
            </div>

            {/* KPI 4: Gemini Confidence */}
            <div className="govtech-card overflow-hidden group hover:-translate-y-0.5 transition-all">
              <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
              <div className="p-5">
                <div className="flex items-center justify-between text-2xs font-mono text-slate-500 mb-2">
                  <span className="font-bold">GEMINI CONFIDENCE</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-700 font-tabular tracking-tight">
                  94.2%
                </div>
                <span className="text-3xs text-slate-500 mt-1.5 block font-mono font-semibold">STRICT PYDANTIC SCHEMAS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Persona Gateways & Live Archetype Matrix */}
      <section className="max-w-7xl mx-auto px-4 py-12 space-y-12 w-full">
        {/* Persona Action Cards */}
        <div>
          <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider font-sans">
                Operational Persona Access
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Role-based interfaces for municipal executives, forensic reporters, and vulnerable communities
              </p>
            </div>
            <span className="font-mono text-2xs text-slate-400 hidden sm:inline">DUAL-PERSONA FEDERATION</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Persona 1: ULB Executive Command Desk */}
            <Link
              to="/admin"
              className="govtech-card overflow-hidden group hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div className="h-1.5 bg-blue-600" />
              <div className="p-6 space-y-3">
                <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-2xs group-hover:scale-105 transition-transform">
                  <Activity className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  ULB Executive Command Desk
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Real OpenStreetMap tiles, dynamic Gaussian plume dispersion cones, school/hospital breach ETAs, and automated statutory smog gun mobilization.
                </p>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-mono text-xs font-bold text-blue-600">
                  <span>OPEN DESK (/admin)</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Persona 2: Citizen Forensic Ingest */}
            <Link
              to="/report"
              className="govtech-card overflow-hidden group hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div className="h-1.5 bg-emerald-600" />
              <div className="p-6 space-y-3">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-2xs group-hover:scale-105 transition-transform">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Citizen Forensic Ingest
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Upload emission evidence with browser GPS acquisition. Instant Gemini multimodal forensic audit and immediate tamper-evident statutory ticket.
                </p>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-mono text-xs font-bold text-emerald-700">
                  <span>SUBMIT EVIDENCE (/report)</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Persona 3: Citizen Air Guard */}
            <Link
              to="/citizen"
              className="govtech-card overflow-hidden group hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div className="h-1.5 bg-amber-600" />
              <div className="p-6 space-y-3">
                <div className="h-12 w-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs group-hover:scale-105 transition-transform">
                  <Eye className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                  Public Health Air Guard
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Hyper-local AQI gauge, regional plume radar with OSM tiles, and 6-language vernacular voice broadcasts for vulnerable populations and school corridors.
                </p>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-mono text-xs font-bold text-amber-700">
                  <span>VIEW RADAR (/citizen)</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Pan-India Archetype Telemetry Matrix */}
        <div className="govtech-card p-6 shadow-sm">
          <CityBarChart 
            cities={cities} 
            selectedCityId="delhi" 
            onSelectCity={(city) => setSelectedCity(city)} 
          />
        </div>

        {/* Technical Architecture Depth Strip */}
        <div className="govtech-card p-6 shadow-sm bg-gradient-to-br from-white to-slate-50/50">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="h-5 w-5 text-indigo-700" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-sans">
              Algorithmic & Forensic Verification Pipeline
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
            <div className="space-y-1.5 border-l-2 border-indigo-600 pl-3.5">
              <span className="font-bold text-slate-900 font-mono block">1. GEMINI 3.5 FLASH-LITE FORENSICS</span>
              <p className="text-2xs text-slate-600 leading-relaxed font-normal">
                Multimodal classification checks for optical smoke density, flame spectra, and chlorinated polymer pyrolysis with strict JSON schema validation.
              </p>
            </div>

            <div className="space-y-1.5 border-l-2 border-blue-600 pl-3.5">
              <span className="font-bold text-slate-900 font-mono block">2. GAUSSIAN DISPERSION PHYSICS</span>
              <p className="text-2xs text-slate-600 leading-relaxed font-normal">
                Real-time atmospheric advection equations driven by Pasquill-Gifford stability, boundary layer inversion capping, and OpenWeather / Open-Meteo wind vectors.
              </p>
            </div>

            <div className="space-y-1.5 border-l-2 border-emerald-600 pl-3.5">
              <span className="font-bold text-slate-900 font-mono block">3. AUTOMATED STATUTORY DISPATCH</span>
              <p className="text-2xs text-slate-600 leading-relaxed font-normal">
                CAQM Section 31A statutory notices and municipal anti-smog water canon truck routing triggered automatically upon verified infraction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Live System Ticker */}
      <div className="shrink-0">
        <LiveTickerStrip />
      </div>
    </PageShell>
  );
}

export default LandingPage;
