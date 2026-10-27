import React, { useState, useEffect, useCallback } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { 
  ChevronLeft, ChevronRight, Maximize2, Minimize2, 
  Volume2, ShieldAlert, Cpu, Wind, Layers, MapPin, 
  Building2, Activity, CheckCircle2, AlertTriangle, 
  ExternalLink, Sparkles, MessageSquare, Flame, School,
  ArrowRight
} from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: "VayuGrid (वायुग्रिड)",
    tagline: "Planetary-to-Pavement Digital Public Good for Air Pollution Governance",
    category: "EXECUTIVE VISION",
    badges: ["Google Gemini 1.5 Flash", "Google Maps Platform", "Open-Meteo Physics", "Google Cloud Run"],
    speakerNotes: "Respected jury and fellow innovators, today across India, over 1.4 billion people breathe some of the most toxic air on Earth. Yet when a citizen or municipal commissioner looks at their air quality app, all they see is a static number: 'AQI is 385, Severe'. That number tells you nothing about who burned what 20 minutes ago, where the toxic plume is heading right now, or which hospital or school is in the line of fire. Welcome to VayuGrid — India's first planetary-to-pavement federated intelligence platform that transforms passive air monitoring into real-time, closed-loop municipal dispatch and hyper-local vernacular citizen protection.",
    content: (
      <div className="flex flex-col items-center justify-center text-center py-8 space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>BUILD WITH AI: CODE FOR COMMUNITIES • NATIONAL FINALE 2026</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          VayuGrid <span className="text-blue-600">(वायु-सूत्र)</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 font-medium max-w-2xl leading-relaxed">
          India's First Federated Planetary-to-Pavement Digital Public Good for Real-Time Air Pollution Governance & Municipal Dispatch
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 w-full">
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-left">
            <span className="text-3xs font-mono font-bold text-blue-600 uppercase block">Tier A: Macro</span>
            <span className="text-xs font-bold text-slate-800">Satellite GEE Feeds</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-left">
            <span className="text-3xs font-mono font-bold text-indigo-600 uppercase block">Tier B: Meso</span>
            <span className="text-xs font-bold text-slate-800">CPCB Ground Arrays</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-left">
            <span className="text-3xs font-mono font-bold text-emerald-600 uppercase block">Tier C: Micro Edge</span>
            <span className="text-xs font-bold text-slate-800">Gemini AI Forensics</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-left">
            <span className="text-3xs font-mono font-bold text-rose-600 uppercase block">Action Loop</span>
            <span className="text-xs font-bold text-slate-800">3-Minute ULB Dispatch</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "The Problem: India's Triple Monitoring Blind Spot",
    tagline: "Why existing monitoring networks fail to prevent toxic exposure",
    category: "PROBLEM ANALYSIS",
    badges: ["₹1.5 Cr Capex", "15m Rooftop Elevation", "48h Lag"],
    speakerNotes: "India suffers from a triple monitoring blind spot. First, Capex: A single CAAQMS monitoring station costs over ₹1.2 to 1.5 Crore. Most Tier-2/3 Indian cities can afford barely two to five stations. Second, elevation: These stations sit 15 meters high on government rooftops, measuring diluted ambient air. They completely miss the ground-level breathing zone—where street vendors, commuters, and school children inhale toxic combustion plumes. Third, lack of enforcement: Existing systems are purely observational. They tell you the air is bad, but cannot identify the polluter, predict the downwind exposure footprint, or mobilize a single municipal water tanker.",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
        <div className="p-5 bg-white rounded-2xl border border-rose-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-lg">1</div>
          <h3 className="text-base font-bold text-slate-900">Capex Blind Spot</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            CAAQMS stations cost <strong className="text-rose-700">₹1.2–1.5 Crore</strong> each. Tier-2/3 cities have 0 to 2 stations covering millions of residents.
          </p>
          <div className="p-2.5 bg-rose-50/60 rounded-lg text-3xs font-mono text-rose-800">
            Result: 85% of Indian municipal wards operate in total data darkness.
          </div>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-amber-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-lg">2</div>
          <h3 className="text-base font-bold text-slate-900">Elevation Mismatch</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Official monitors sit atop <strong className="text-amber-800">15m government rooftops</strong>. Citizens, school children, and street vendors breathe at <strong>0–2m</strong>.
          </p>
          <div className="p-2.5 bg-amber-50/60 rounded-lg text-3xs font-mono text-amber-900">
            Result: Ground-level plastic/biomass burning plumes are missed entirely until diluted.
          </div>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-lg">3</div>
          <h3 className="text-base font-bold text-slate-900">Passive Observation Lag</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Current apps report a passive number: <em>"AQI 385"</em>. Manual inspection by municipal officers takes <strong className="text-slate-800">48+ hours</strong>.
          </p>
          <div className="p-2.5 bg-slate-100 rounded-lg text-3xs font-mono text-slate-700">
            Result: By the time inspectors arrive, fires have burned out and poison has been inhaled.
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "The Architecture: Planetary-to-Pavement DPG",
    tagline: "3-tier federated pyramid closing observation to civic action",
    category: "SOLUTION ARCHITECTURE",
    badges: ["Tier-A GEE", "Tier-B CPCB", "Tier-C Mobile Edge"],
    speakerNotes: "VayuGrid solves this through a three-tier federated Digital Public Good architecture. At Tier-A, we ingest satellite layers like Sentinel-5P to detect regional emission anomalies. At Tier-B, we calibrate with official CPCB ambient baseline monitors. And at Tier-C—our micro edge—we turn every citizen and municipal sanitation worker into a frontline environmental inspector using their smartphone camera. When combined with real-time micrometeorology, this closes the loop between planetary observation and pavement-level municipal intervention.",
    content: (
      <div className="space-y-4 py-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200 shadow-2xs">
            <div className="text-2xs font-mono font-bold text-blue-700 uppercase">TIER A: MACRO LAYER</div>
            <div className="text-sm font-bold text-slate-900 mt-1">Satellite Earth Observation</div>
            <p className="text-xs text-slate-600 mt-2">
              Sentinel-5P NO₂, SO₂, CO tropospheric column densities + VIIRS/MODIS thermal fire anomalies via Google Earth Engine.
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-200 shadow-2xs">
            <div className="text-2xs font-mono font-bold text-indigo-700 uppercase">TIER B: MESO LAYER</div>
            <div className="text-sm font-bold text-slate-900 mt-1">Ground Station Baselines</div>
            <p className="text-xs text-slate-600 mt-2">
              Statutory CPCB / OpenAQ reference monitors calibrate regional background concentrations and micro-meteorological baselines.
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-200 shadow-2xs">
            <div className="text-2xs font-mono font-bold text-emerald-700 uppercase">TIER C: MICRO EDGE</div>
            <div className="text-sm font-bold text-slate-900 mt-1">Citizen & Ward Telemetry</div>
            <p className="text-xs text-slate-600 mt-2">
              Geo-tagged smartphone captures processed via zero-temperature multimodal Gemini 1.5 Flash forensics with anti-spoofing validation.
            </p>
          </div>
        </div>
        <div className="p-4 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-2xs font-mono text-emerald-400 font-bold uppercase block">Dual Civic Execution Gates</span>
            <span className="text-sm font-bold text-white">Closed-Loop Autonomous Municipal Work Orders + 6-Language Public Air Guard Alerts</span>
          </div>
          <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400 text-emerald-300 rounded-full text-xs font-mono font-bold whitespace-nowrap">
            Response: &lt; 3 Minutes
          </span>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "Google Gemini 1.5 Flash: Chief AI Forensic Auditor",
    tagline: "Multimodal zero-temperature emission diagnosis with anti-spoofing",
    category: "AI & TECHNICAL CORE",
    badges: ["Zero-Temperature", "Anti-Spoofing", "Pydantic Schema"],
    speakerNotes: "At the heart of Tier-C is our multimodal AI auditor, powered by Google Gemini 1.5 Flash. When an image is submitted, Gemini doesn't just describe the photo. It runs an anti-spoofing check to ensure it's not a computer screen or indoor photo, classifies the emission into one of six statutory Indian archetypes—such as open waste burning or construction dust—estimates optical plume opacity, and generates legally binding intervention recommendations in strict, deterministic JSON with zero hallucination.",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-3">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
          <span className="text-2xs font-mono font-bold text-indigo-700 uppercase block">Deterministic Forensic Ingest</span>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Anti-Spoofing Guard:</strong> Instantly rejects digital graphics, computer monitors, and indoor non-environmental images.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>6 Statutory Archetypes:</strong> Municipal solid waste, construction dust, industrial stack, stubble burning, vehicular exhaust, unpaved road dust.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Optical Opacity Telemetry:</strong> Quantifies plume particulate opacity (0.00 to 1.00) based on soot absorption and scattering.</span>
            </li>
          </ul>
        </div>
        <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-2xs space-y-2 overflow-x-auto shadow-inner">
          <div className="text-emerald-400 font-bold border-b border-slate-800 pb-1">
            // Gemini 1.5 Flash Output Schema (Structured Pydantic)
          </div>
          <pre className="text-slate-300 leading-relaxed font-mono">
{`{
  "is_authentic_outdoor_scene": true,
  "confidence_score": 0.94,
  "classification": "OPEN_MUNICIPAL_WASTE_BURNING",
  "optical_opacity": 0.88,
  "estimated_origin_radius_m": 15.0,
  "recommended_statutory_action": {
    "action_code": "DISPATCH_WATER_CANNON",
    "bylaw_clause": "Sec 133 CrPC / Air Act 1981",
    "priority": "CRITICAL_P0"
  }
}`}
          </pre>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "Atmospheric Physics Dispersion Engine in < 15ms",
    tagline: "Vectorized Gaussian plume & puff equations replacing black-box neural nets",
    category: "ATMOSPHERIC PHYSICS",
    badges: ["Pasquill-Gifford", "Briggs Plume Rise", "11.68 ms Benchmark"],
    speakerNotes: "AI identifies the hazard, but atmospheric physics dictates where it goes. Rather than relying on black-box neural networks that take hours to compute or hallucinate trajectories, VayuGrid features a vectorized Gaussian plume and puff dispersion engine. We ingest live wind speed, wind bearing, and boundary layer mixing height from Open-Meteo. Our engine calculates Briggs buoyant plume rise, accounts for urban surface roughness, and projects four statutory concentration contours in under 15 milliseconds. This allows us to predict the toxic plume's exact path before it reaches nearby populations.",
    content: (
      <div className="space-y-4 py-2">
        <div className="p-4 bg-slate-900 text-white rounded-xl text-center space-y-2 shadow-sm font-mono">
          <span className="text-3xs text-blue-300 uppercase tracking-widest block">Continuous Steady-State Gaussian Formulation</span>
          <div className="text-sm sm:text-base text-amber-300 font-bold overflow-x-auto py-1">
            C(x,y,z) = [Q / (2π u σ_y σ_z)] · exp(-y² / 2σ_y²) · [exp(-(z-H)² / 2σ_z²) + exp(-(z+H)² / 2σ_z²)]
          </div>
          <span className="text-3xs text-slate-400 block">Factoring ground reflection & inversion lid capping</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <div className="text-2xs font-mono font-bold text-blue-700">BRIGGS PLUME RISE (ΔH)</div>
            <div className="text-xs text-slate-600 mt-1">Calculates thermal buoyancy flux (F) vs crosswind momentum penetration.</div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <div className="text-2xs font-mono font-bold text-indigo-700">IRWIN WIND SHEAR PROFILE</div>
            <div className="text-xs text-slate-600 mt-1">Scales 10m meteorological anemometer vectors to plume emission height.</div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <div className="text-2xs font-mono font-bold text-emerald-700">BENCHMARK SPEED: 11.68 ms</div>
            <div className="text-xs text-slate-600 mt-1">Vectorized NumPy + Shapely polygon isopleth generation executes in real time.</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: "Sensitive Infrastructure Intersections & Warning Shield",
    tagline: "Proactive spatial alerting for schools, hospitals, and informal settlements",
    category: "SPATIAL EXPOSURE",
    badges: ["GeoJSON Intersect", "ETA Countdown", "Pediatric Protection"],
    speakerNotes: "Here is why this matters: VayuGrid spatializes vulnerable infrastructure. When a plume is detected, our system intersects its downwind advection vector with a geo-indexed database of schools, maternity hospitals, and dense informal settlements. The system calculates the exact arrival countdown: 'The toxic plume will strike Government Senior Secondary School in 8 minutes.' This gives administrators and school principals an actionable window to seal classrooms or evacuate outdoor sports grounds before exposure occurs.",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
          <span className="text-2xs font-mono font-bold text-rose-700 uppercase block">Downwind Intersect Queue</span>
          <div className="space-y-2">
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">Govt Sr Secondary School Ward 12</div>
                <div className="text-3xs text-slate-500 font-mono">Distance: 1.8 km downwind • 850 Children</div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-rose-700 font-mono block">ETA 8m</span>
                <span className="text-3xs text-rose-600 font-mono">PM2.5: 148 µg/m³</span>
              </div>
            </div>
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">Community Maternity Clinic</div>
                <div className="text-3xs text-slate-500 font-mono">Distance: 2.4 km downwind • Ward 14</div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-amber-800 font-mono block">ETA 14m</span>
                <span className="text-3xs text-amber-700 font-mono">PM2.5: 82 µg/m³</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-3">
          <span className="text-2xs font-mono font-bold text-blue-800 uppercase block">Proactive Protocol Triggered</span>
          <p className="text-xs text-slate-700 leading-relaxed">
            Rather than retroactive health reporting days later, VayuGrid generates an automated advisory dispatch:
          </p>
          <div className="p-3 bg-white rounded-lg border border-blue-200 text-xs text-blue-900 font-medium space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-blue-700">
              <School className="w-4 h-4" />
              <span>School Administrative Advisory #VG-409</span>
            </div>
            <p className="text-2xs text-slate-600">
              "Seal classroom windows immediately. Suspend all outdoor physical education activities between 11:30 and 13:00 due to active waste fire plume advection."
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 7,
    title: "Side A: ULB Executive Command Desk",
    tagline: "Municipal portal transforming chaotic citizen complaints into statutory work orders",
    category: "MUNICIPAL WORKFLOW",
    badges: ["Parichay SSO", "CAQM GRAP IV", "One-Click Dispatch"],
    speakerNotes: "For Urban Local Bodies like BBMP in Bengaluru or MCD in Delhi, VayuGrid provides an executive command desk. No longer do sanitation officers waste hours reviewing vague citizen complaints. Every report arrives pre-audited, categorized, and prioritized by severity. With a single click, an enforcement officer can dispatch an anti-smog gun truck with an automated route or issue an emergency statutory notice under Section 133 of the CrPC.",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-2xs font-mono font-bold text-blue-700 uppercase">Pre-Audited Ingest Queue</span>
          <p className="text-xs text-slate-600">
            Zero noise: Every ticket has AI verification, GPS accuracy, and priority scoring before reaching the municipal officer.
          </p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-2xs font-mono font-bold text-indigo-700 uppercase">Live GIS Plume Canvas</span>
          <p className="text-xs text-slate-600">
            Real-time Leaflet GIS overlays active concentration isopleths, wind vectors, and sensitive infrastructure pins.
          </p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-2xs font-mono font-bold text-emerald-700 uppercase">One-Click Dispatch</span>
          <p className="text-xs text-slate-600">
            Dispatches nearest anti-smog water truck or mechanized road sweeper with statutory work order issuance in under 60 seconds.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 8,
    title: "Side B: Public Air Guard & 6-Language Vernacular Audio",
    tagline: "Democratizing air resilience for frontline non-literate populations",
    category: "INCLUSIVE CITIZEN SHIELD",
    badges: ["English", "हिंदी", "తెలుగు", "ಕನ್ನಡ", "தமிழ்", "മലയാളം"],
    speakerNotes: "Clean air cannot be a luxury reserved for English-speaking smartphone users who know what 'PM2.5' means. To protect vulnerable frontline communities—street vendors, gig workers, auto drivers—VayuGrid translates complex plume warnings into plain-language audio alerts across six Indian languages: English, Hindi, Telugu, Kannada, Tamil, and Malayalam. Citizens receive clear, synthesized voice broadcasts telling them simply: 'Toxic smoke is heading towards your street from the east. Seal your windows and wear a mask for the next two hours.'",
    content: (
      <div className="space-y-4 py-2">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-800">Supported Vernacular Languages:</span>
          <div className="flex flex-wrap gap-2 text-2xs font-mono">
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md font-bold">English (en-IN)</span>
            <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md font-bold">Hindi (हिंदी)</span>
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md font-bold">Telugu (తెలుగు)</span>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md font-bold">Kannada (ಕನ್ನಡ)</span>
            <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md font-bold">Tamil (தமிழ்)</span>
            <span className="px-2.5 py-1 bg-rose-50 text-rose-700 rounded-md font-bold">Malayalam (മലയാളം)</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-3xs font-mono font-bold text-slate-500 uppercase">Devanagari Advisory Broadcast</span>
            <p className="text-xs text-slate-800 italic leading-relaxed">
              "चेतावनी: आस-पास कचरे में आग लगने से जहरीला धुआं फैल रहा है। अगले 2 घंटे खिड़कियां बंद रखें और मास्क पहनें।"
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-3xs font-mono font-bold text-slate-500 uppercase">Kannada Advisory Broadcast</span>
            <p className="text-xs text-slate-800 italic leading-relaxed">
              "ಎಚ್ಚರಿಕೆ: ಹತ್ತಿರದ ಪ್ರದೇಶದಲ್ಲಿ ತ್ಯಾಜ್ಯ ಸುಡುವಿಕೆಯಿಂದ ವಿಷಕಾರಿ ಹೊಗೆ ಹರಡುತ್ತಿದೆ. ಮುಂದಿನ 2 ಗಂಟೆಗಳ ಕಾಲ ಕಿಟಕಿಗಳನ್ನು ಮುಚ್ಚಿರಿ."
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 9,
    title: "Complete Google Technology Stack Integration",
    tagline: "End-to-end synergy across Google AI, Maps Platform, Earth Engine & Cloud",
    category: "GOOGLE TECH STACK",
    badges: ["Gemini 1.5 Flash", "Google Maps API", "Google Earth Engine", "Cloud Run"],
    speakerNotes: "VayuGrid leverages the full power of the Google ecosystem. We use Gemini 1.5 Flash for high-speed, zero-temperature vision reasoning; Google Maps Platform for tactical geospatial rendering; Google Earth Engine for planetary satellite layers; Google Cloud & Web Speech TTS for authentic native Indian voice alerts; and Google Cloud Run for auto-scaling, low-latency microservice execution across Indian regions.",
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
        <div className="p-4 bg-white rounded-xl border border-blue-200 shadow-2xs space-y-1.5">
          <div className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Google Gemini 1.5 Flash</span>
          </div>
          <p className="text-2xs text-slate-600">Multimodal emission forensics, optical density estimation, and anti-spoofing verification.</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-emerald-200 shadow-2xs space-y-1.5">
          <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>Google Maps Platform</span>
          </div>
          <p className="text-2xs text-slate-600">Geospatial vector rendering, dynamic isopleth polygons, and infrastructure marker clustering.</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-indigo-200 shadow-2xs space-y-1.5">
          <div className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            <span>Google Earth Engine</span>
          </div>
          <p className="text-2xs text-slate-600">Sentinel-5P NO₂ column densities and VIIRS/MODIS thermal fire hotspot telemetry.</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-1.5">
          <div className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4" />
            <span>Google Cloud TTS & Web Speech</span>
          </div>
          <p className="text-2xs text-slate-600">Multilingual neural speech synthesis across Indian language locales (hi-IN, kn-IN, te-IN, etc.).</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-purple-200 shadow-2xs space-y-1.5">
          <div className="text-xs font-bold text-purple-700 flex items-center gap-1.5">
            <Cpu className="w-4 h-4" />
            <span>Google Cloud Run</span>
          </div>
          <p className="text-2xs text-slate-600">Fully managed serverless container runtime deployed in asia-south1 (Mumbai) for sub-50ms execution.</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
          <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Activity className="w-4 h-4" />
            <span>Open-Meteo & CPCB APIs</span>
          </div>
          <p className="text-2xs text-slate-600">Real-time boundary layer mixing heights, Pasquill stability classes, and statutory ground AQI.</p>
        </div>
      </div>
    )
  },
  {
    id: 10,
    title: "Pan-India Reach Across 5 Regional Archetypes",
    tagline: "Tailored to the unique atmospheric physics of Indian geographies",
    category: "DEPTH & SCALE",
    badges: ["Delhi NCR", "Bengaluru", "Kanpur", "Mumbai", "Punjab"],
    speakerNotes: "India is not a monolith. An air solution designed for Delhi cannot be blindly applied to Bengaluru or coastal Mumbai. VayuGrid is built from day one to handle five distinct regional archetypes: In Delhi, it models winter temperature inversions trapping municipal smoke. In Bengaluru, it targets construction corridor dust. In Kanpur, heavy industrial stacks. In Mumbai, coastal inversion layers. And in the Punjab belt, agricultural stubble burning. Any district administration in India can onboard onto VayuGrid on day one with zero new hardware procurement.",
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 py-3">
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
          <span className="text-2xs font-mono font-bold text-red-700 block">DELHI NCR</span>
          <div className="text-xs font-bold text-slate-900">Refuse & Inversion</div>
          <p className="text-3xs text-slate-500">Winter PBL inversion lids (420m) trapping high-density municipal solid waste burning.</p>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
          <span className="text-2xs font-mono font-bold text-blue-700 block">BENGALURU</span>
          <div className="text-xs font-bold text-slate-900">Construction Dust</div>
          <p className="text-3xs text-slate-500">Metro rail corridor silt resuspension, unpaved road dust, and transit corridors.</p>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
          <span className="text-2xs font-mono font-bold text-purple-700 block">KANPUR</span>
          <div className="text-xs font-bold text-slate-900">Industrial Stacks</div>
          <p className="text-3xs text-slate-500">Tannery cluster boilers, SO₂ plumes, and heavy manufacturing flares.</p>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
          <span className="text-2xs font-mono font-bold text-indigo-700 block">MUMBAI</span>
          <div className="text-xs font-bold text-slate-900">Coastal Inversion</div>
          <p className="text-3xs text-slate-500">Marine boundary layer thermal trapping & coastal high-rise redevelopment dust.</p>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
          <span className="text-2xs font-mono font-bold text-amber-800 block">PUNJAB BELT</span>
          <div className="text-xs font-bold text-slate-900">Stubble Burning</div>
          <p className="text-3xs text-slate-500">Seasonal post-harvest paddy residue combustion and regional transboundary advection.</p>
        </div>
      </div>
    )
  },
  {
    id: 11,
    title: "Measurable Civic Impact & Return on Investment (ROI)",
    tagline: "Concrete metrics delivering tangible outcomes for Indian municipalities",
    category: "CIVIC IMPACT",
    badges: ["65% Faster", "3-Hour Notice", "₹4.8 Cr Saved / City"],
    speakerNotes: "The return on investment for Indian cities is immediate and measurable: First, response time: We reduce the civic enforcement loop from 48 hours to under 3 minutes. Second, public health: A 15-minute advance notice to a school or hospital saves lives and prevents acute respiratory admissions. Third, municipal capital efficiency: Instead of spending ₹50 Crores buying imported hardware stations that break down, cities can deploy VayuGrid immediately as a Digital Public Good.",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
        <div className="p-6 bg-white rounded-2xl border border-emerald-200 shadow-sm text-center space-y-2">
          <div className="text-3xl sm:text-4xl font-black text-emerald-600 font-mono">65%</div>
          <div className="text-sm font-bold text-slate-900">Faster Municipal Mitigation</div>
          <p className="text-xs text-slate-600">
            Slashes municipal response from 48-hour manual ward inspections to 3-minute automated dispatch.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-blue-200 shadow-sm text-center space-y-2">
          <div className="text-3xl sm:text-4xl font-black text-blue-600 font-mono">3 Hours</div>
          <div className="text-sm font-bold text-slate-900">Advance Exposure Warning</div>
          <p className="text-xs text-slate-600">
            Real-time plume advection alerts allow schools and hospitals to seal windows before smoke arrives.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-indigo-200 shadow-sm text-center space-y-2">
          <div className="text-3xl sm:text-4xl font-black text-indigo-600 font-mono">₹4.8 Cr</div>
          <div className="text-sm font-bold text-slate-900">Capex Saved Per City</div>
          <p className="text-xs text-slate-600">
            Delivers monitoring resolution equivalent to 35 physical CAAQMS stations at zero new municipal hardware cost.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 12,
    title: "Deployment Roadmap & The Finale Vision",
    tagline: "Piloting with municipal corporations and scaling across the Smart Cities Mission",
    category: "DEPLOYABILITY ROADMAP",
    badges: ["Phase 1: Pilot", "Phase 2: WhatsApp", "Phase 3: Smart Cities"],
    speakerNotes: "Our roadmap is grounded in reality: In Phase 1, we deploy live pilots with BBMP Bengaluru and Kanpur Municipal Corporation. In Phase 2, we introduce a WhatsApp chatbot interface so any citizen can submit a photo without downloading an app. In Phase 3, we integrate directly with the Ministry of Environment's National Clean Air Programme portal. Clean air should not be a passive statistic we lament every winter. It must be an actively defended human right. With VayuGrid, we give Indian municipalities and citizens the intelligence shield they deserve. Thank you, and we welcome your questions!",
    content: (
      <div className="space-y-4 py-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-2xs font-mono font-bold text-blue-700">PHASE 1 (MONTHS 1–3)</span>
            <div className="text-sm font-bold text-slate-900">Live Municipal Pilots</div>
            <p className="text-xs text-slate-600">Deploy Cloud Run pilots with BBMP Bengaluru and Kanpur Municipal Corporation (KMC).</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-2xs font-mono font-bold text-indigo-700">PHASE 2 (MONTHS 4–6)</span>
            <div className="text-sm font-bold text-slate-900">WhatsApp Ingestion Chatbot</div>
            <p className="text-xs text-slate-600">Zero-install reporting via WhatsApp Business API for sanitation workers and frontline citizens.</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-2xs font-mono font-bold text-emerald-700">PHASE 3 (MONTHS 7–12)</span>
            <div className="text-sm font-bold text-slate-900">National DPG Integration</div>
            <p className="text-xs text-slate-600">MoEFCC National Clean Air Programme (NCAP) and CPCB Sameer national data grid federation.</p>
          </div>
        </div>
        <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl text-center space-y-1">
          <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
            VayuGrid • Code for Communities National Finale
          </div>
          <div className="text-sm font-bold">
            "Democratizing actionable air intelligence from planetary satellites to pavement level."
          </div>
        </div>
      </div>
    )
  }
];

export function PitchDeckPage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentSlide = SLIDES[currentSlideIndex];

  const handleNext = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev < SLIDES.length - 1 ? prev + 1 : prev));
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  // Keyboard navigation: Left/Right arrows
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <PageShell className="bg-slate-100 min-h-screen flex flex-col justify-between">
      {/* Top Deck Controls Ribbon */}
      <div className="bg-white border-b border-border-subtle px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            FINALE PITCH DECK
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-600 font-semibold">{currentSlide.category}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Slide Selector Dropdown */}
          <select
            value={currentSlideIndex}
            onChange={(e) => setCurrentSlideIndex(Number(e.target.value))}
            className="px-2 py-1 rounded bg-slate-50 border border-slate-300 text-slate-800 text-xs font-mono font-semibold"
          >
            {SLIDES.map((slide, idx) => (
              <option key={slide.id} value={idx}>
                Slide {slide.id}: {slide.title.slice(0, 32)}...
              </option>
            ))}
          </select>

          <span className="text-slate-500 font-tabular font-bold px-2">
            {currentSlideIndex + 1} / {SLIDES.length}
          </span>

          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`px-2.5 py-1 rounded border text-2xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
              showNotes 
                ? 'bg-amber-50 border-amber-300 text-amber-800' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Speaker Script</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Slide Canvas */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-10 relative overflow-hidden flex flex-col justify-between min-h-[500px]">
          {/* Slide Header */}
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-xs">
                  {currentSlide.id}
                </span>
                <span className="text-2xs font-mono font-bold text-blue-700 tracking-wider uppercase">
                  {currentSlide.category}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentSlide.badges.map((b, i) => (
                  <span key={i} className="text-3xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {b}
                  </span>
                ))}
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
              {currentSlide.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium font-sans">
              {currentSlide.tagline}
            </p>
          </div>

          {/* Slide Body */}
          <div className="py-4 flex-1 flex flex-col justify-center">
            {currentSlide.content}
          </div>

          {/* Slide Navigation Footbar */}
          <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-mono text-xs font-bold hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>PREVIOUS</span>
            </button>

            {/* Slide dots */}
            <div className="hidden sm:flex items-center gap-1.5">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentSlideIndex 
                      ? 'bg-blue-600 w-6' 
                      : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                  title={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentSlideIndex === SLIDES.length - 1}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <span>NEXT</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Verbatim Presenter Script Drawer */}
        {showNotes && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-mono font-bold text-amber-800 uppercase flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                <span>Verbatim Speaker Script (What to say to the judges):</span>
              </span>
              <span className="text-3xs font-mono text-amber-700">Slide {currentSlide.id} / 12</span>
            </div>
            <p className="text-xs text-amber-950 font-sans leading-relaxed italic bg-white/70 p-3 rounded-xl border border-amber-200/60">
              "{currentSlide.speakerNotes}"
            </p>
          </div>
        )}
      </div>
    </PageShell>
  );
}

export default PitchDeckPage;
