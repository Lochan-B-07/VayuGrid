import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Wind, ShieldAlert, Radio, Activity, MapPin, Eye, FileText } from 'lucide-react';
import { CitySelector } from '../ui/CitySelector';

export function TopBar() {
  const location = useLocation();
  const { weather, istTime, selectedCity } = useApp();

  const navLinks = [
    { to: '/admin', label: 'ULB Command Desk', icon: Activity },
    { to: '/report', label: 'Citizen Forensic Ingest', icon: ShieldAlert },
    { to: '/citizen', label: 'Public Air Guard', icon: Eye },
    { to: '/pitch', label: 'Pitch Deck', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-[1000] bg-white border-b border-border-subtle text-slate-900 shadow-sm">
      {/* Official GovTech Hairline Accent Strip */}
      <div className="h-0.5 w-full bg-gradient-to-r from-[#FF9933] via-slate-200 to-[#138808]" />

      {/* Statutory Top Banner Strip */}
      <div className="bg-slate-100/80 px-4 py-1 text-2xs text-slate-600 flex items-center justify-between border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-800 tracking-wider">
            GOVT OF INDIA DIGITAL PUBLIC INFRASTRUCTURE
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600">Track 2: Clean Air & Climate Resilience</span>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="font-mono text-2xs font-semibold">CPCB CENTRAL INGESTION: OPERATIONAL</span>
          </div>
        </div>

        <div className="flex items-center gap-4 font-mono text-slate-700">
          <span className="text-slate-500 text-2xs">LATENCY: 38ms</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-800 font-semibold font-tabular">{istTime}</span>
        </div>
      </div>

      {/* Main Command Navigation Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-lg border border-blue-200 bg-blue-50 flex items-center justify-center text-blue-700 font-mono font-bold text-sm tracking-tight shadow-sm">
              VG
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  VayuGrid
                </span>
                <span className="text-xs text-blue-600 font-semibold tracking-wide">
                  (वायु-सूत्र)
                </span>
              </div>
              <p className="text-2xs text-slate-500 tracking-normal font-normal">
                National Air Quality Intelligence & Enforcement Desk
              </p>
            </div>
          </Link>

          {/* Navigation Route Tabs */}
          <nav className="hidden md:flex items-center gap-1 ml-4 border-l border-border-subtle pl-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* City Selector & Weather Telemetry */}
        <div className="flex items-center gap-3">
          <CitySelector />

          {/* Micro-Meteorology Strip */}
          {weather && (
            <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-50 border border-border-subtle text-xs shadow-2xs">
              <div className="flex items-center gap-1.5 text-slate-700">
                <Wind className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-2xs text-slate-500 uppercase tracking-wider font-semibold">Surface Wind:</span>
                <span className="font-mono font-bold text-slate-800 font-tabular">
                  {weather.wind_direction} @ {weather.wind_speed_mps} m/s
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopBar;
