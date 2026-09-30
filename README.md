<div align="center">

# 🌬️ VayuGrid (वायुग्रिड)
### Verifiable Air-Quality Yield & Unified Spatio-Temporal Resilience Architecture

**A Federated, Multi-Tier Planetary-to-Pavement Digital Public Good for Pan-India Air Pollution Governance**

[![Hackathon](https://img.shields.io/badge/Event-Build%20with%20AI%3A%20Code%20for%20Communities-blue?style=for-the-badge&logo=google)](https://hack2skill.com)
[![Track](https://img.shields.io/badge/Track-Clean%20Air%20%26%20Climate%20Resilience-green?style=for-the-badge)](https://hack2skill.com)
[![Google AI](https://img.shields.io/badge/Google%20AI-Gemini%203.5%20Flash--Lite-orange?style=for-the-badge&logo=google)](https://aistudio.google.com)
[![Tests: 62+ Passing](https://img.shields.io/badge/Tests-62%2B%20Passing-brightgreen?style=for-the-badge)](backend/tests/)
[![Latency: Sub--15ms](https://img.shields.io/badge/Latency-Sub--15ms%20Weak%20PC-success?style=for-the-badge)](backend/tests/test_benchmark_weak_pc.py)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[Architecture](docs/ARCHITECTURE.md) • [Integration Plan](docs/INTEGRATION_PLAN.md) • [API Contracts](docs/API_CONTRACTS.md) • [Pitch Deck](docs/PITCH_DECK.md) • [Demo Script](docs/DEMO_SCRIPT.md)

</div>

---

## 📌 Executive Summary

India's National Clean Air Programme (NCAP) monitors ambient air through Continuous Ambient Air Quality Monitoring Stations (CAAQMS). However, systemic operational barriers limit effective intervention:
1. **Capex & Spatial Gaps:** Each station costs ₹1.0–1.5 Crore to deploy and maintain, leaving Tier-2/3 industrial towns and rural districts underserved.
2. **Elevation vs. Breathing Zone Mismatch:** CAAQMS units are installed 10–15m atop government rooftops, measuring regional averages while missing acute toxic plumes at the 0–2m human breathing zone.
3. **Passive Metric Display vs. Proactive Enforcement:** Current platforms report numbers (*"AQI is 342 - Very Poor"*) without identifying the emission source, predicting the downwind exposure corridor, or dispatching municipal assets.

**VayuGrid** breaks this paradigm by fusing **macro satellite feeds (Sentinel-5P via Google Earth Engine)**, **meso ground sensors (CPCB/OpenAQ)**, and **micro crowdsourced citizen telemetry** through **Google Gemini 3.5 Flash-Lite Multimodal Forensics** and a **Vectorized, Physics-Constrained Atmospheric Dispersion & Puff Simulation Engine**.

---

## 🏛️ System Architecture

```
+---------------------------------------------------------------------------------------------------------+
|                                         1. INGESTION LAYER                                              |
|                                                                                                         |
|   [Macro Satellite Feeds]             [Micro Terrestrial Feeds]           [Crowdsourced Citizen Telemetry]
|   - Google Earth Engine               - CPCB / OpenAQ APIs (Official)      - Geo-tagged Mobile Web App  |
|   - Sentinel-5P (NO2, SO2, CO, AOD)   - Low-Cost Modbus/MQTT IoT Arrays    - Progressive Web App (PWA)  |
|   - VIIRS / MODIS Thermal Fire Spots  - Open-Meteo / IMD Wind Vectors      - Compressed Multi-Angle JPEGs|
+---------------------------------------------------------------------------------------------------------+
                                                     │
                                                     ▼
+---------------------------------------------------------------------------------------------------------+
|                                    2. COMPUTATION & REASONING CORE                                      |
|                                                                                                         |
|   A. Multimodal Emission Forensic Agent (Gemini 3.5 Flash-Lite via Google AI Studio / Vertex AI)        |
|      - Strict JSON Structured Output Schema                                                             |
|      - Anti-spoofing verification (rejects indoor captures, screenshots)                                |
|      - 6-Class Source Diagnostic (Waste, Construction Dust, Industrial Stack, Biomass, Traffic, Road)   |
|      - Optical smoke opacity (0.0 to 1.0) & origin footprint estimation                                 |
|                                                                                                         |
|   B. Vectorized Atmospheric Physics Dispersion Engine (FastAPI + NumPy + Shapely + Open-Meteo)          |
|      - Irwin wind shear power profile: u(z) = u10 * (z/10)^p                                            |
|      - Briggs convective thermal plume rise: Delta H = f(Fb, Fm, u, Stability)                          |
|      - Briggs continuous rational dispersion coefficients for 12 stability regimes                      |
|      - Method of Images Planetary Boundary Layer (PBL) inversion lid trapping                           |
|      - Analytical statutory isopleth polygons (Hazardous, Severe, Moderate, Advisory) in < 1ms          |
|      - Transient Lagrangian Gaussian puff kinematics with smoke front arrival countdown timers          |
|      - Ultra-lightweight weak-PC performance: 11.68ms median latency, < 12MB RAM                        |
+---------------------------------------------------------------------------------------------------------+
                                                     │
                                                     ▼
+---------------------------------------------------------------------------------------------------------+
|                                        3. DUAL-DISPATCH LAYER                                           |
|                                                                                                         |
|   A. ULB / Administrative Command Desk (React + Vite)  | B. Hyper-Local Citizen Resilience Node         |
|   - Dynamic Google Maps Multi-Tier Iso-Hazard Meshes   | - Web Audio Vernacular Broadcast               |
|   - Legacy Exposure Cone Backwards-Compatibility       |   (English, Hindi, Telugu, Kannada, Tamil, ML) |
|   - Auto-generated Enforcement Incident Tickets        | - 1-Tap Geotagged Hazard Reporting             |
|   - Sensitive Receptor Countdown Intersections         | - Low-Exposure Commute Safe Corridors          |
|   - Mitigation Resource Routing (Smog Guns, Tankers)   | - Advancing Smoke Front Arrival Clock          |
+---------------------------------------------------------------------------------------------------------+
```

---

## 🏙️ Multi-City Demonstration Regional Archetypes

VayuGrid comes pre-configured with 5 distinct regional archetypes across India:

1. **Delhi-NCR:** Municipal solid waste burning & seasonal inversion smog (MCD).
2. **Bengaluru (BBMP):** High-density tech corridor construction dust & transit resuspension.
3. **Kanpur (KMC):** Industrial stack emissions & tannery cluster pollutants.
4. **Mumbai (BMC):** Coastal inversion & transit canyon pollution.
5. **Punjab Agrarian Belt:** Seasonal biomass & post-harvest agricultural stubble burning.

---

## 🗣️ Vernacular Audio Resilience (6 Languages)

To protect non-literate and regional populations, emergency advisories are synthesized in real-time across 6 Indian languages via Gemini 3.5 Flash-Lite and broadcast via zero-latency client-side Browser Web Speech:
* **English (en / en-IN)**
* **Hindi (hi / hi-IN - हिंदी)**
* **Telugu (te / te-IN - తెలుగు)**
* **Kannada (kn / kn-IN - ಕನ್ನಡ)**
* **Tamil (ta / ta-IN - தமிழ்)**
* **Malayalam (ml / ml-IN - മലയാളം)**

### 🔊 Resilient Audio Architecture
* **Inbuilt Browser Speech Synthesis (`window.speechSynthesis`):** Instantaneous client-side vocalization mapped to statutory BCP-47 locale tags without requiring external cloud audio credentials.
* **Dual-Tone Web Audio Chime:** Generates an authentic dual-tone emergency alert frequency (523.25 Hz & 783.99 Hz) via browser Web Audio API oscillator synthesis before every voice broadcast.
* **Graceful Degradation:** Automatic fallback to standard Indian English broadcast if regional voice packs are absent on the client OS.

---

## 🚀 Quickstart & Setup Guide

### Prerequisites
* **Python 3.11+** or **3.12** with **`uv`**
* **Node.js v18+** with **`pnpm`**
* (Optional) **Docker** & **Docker Compose**

### 1. Clone & Configure Environment
```bash
git clone https://github.com/seeramsujay/vayu-grid.git
cd vayu-grid

# Copy environment template
cp .env.example .env
```
Edit `.env` and insert your credentials:
```env
GEMINI_API_KEY=your_gemini_api_key_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 2. Backend Setup (using `uv`)
```bash
cd backend

# Create virtual environment and install dependencies
uv venv
source .venv/bin/activate
uv pip install -r requirements.txt

# Run the 62+ automated verification tests
uv run pytest -v

# Run the weak-PC benchmark directly (< 15ms median latency)
uv run pytest -v tests/test_benchmark_weak_pc.py -s

# Start backend server
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
* **Interactive API Documentation:** `http://localhost:8000/docs`
* **Health Check:** `http://localhost:8000/health`

### 3. Frontend Setup (using `pnpm`)
```bash
cd frontend

# Install dependencies and start development server
pnpm install
pnpm run dev
```
* **Frontend Application:** `http://localhost:5173`

---

## ☁️ Cloud & Vercel Deployment

### A. Deploy Frontend to Vercel
The repository includes root `vercel.json`, `frontend/vercel.json`, and `.vercelignore`:
```bash
cd frontend
npx vercel
# To deploy to production:
npx vercel --prod
```

### B. Deploy Backend to Google Cloud Run
```bash
cd backend
gcloud run deploy vayugrid-backend \
  --source . \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars "ENVIRONMENT=production"
```

---

## 📂 Project Repository Tree

```
vayu-grid/
├── .env.example                 # Environment configuration template
├── .gitignore                   # Multi-tier ignore rules
├── .vercelignore                # Vercel deployment ignore rules
├── docker-compose.yml           # Unified orchestration file
├── vercel.json                  # Root Vercel build & route rules
├── README.md                    # Main Project Documentation
│
├── docs/                        # Complete Architecture & System Specifications
│   ├── ARCHITECTURE.md          # System architecture & Briggs plume mathematics
│   ├── INTEGRATION_PLAN.md      # Full system integration, verification & component status
│   ├── API_CONTRACTS.md         # Full REST endpoints & Pydantic JSON schemas
│   ├── PITCH_DECK.md            # Hackathon presentation framework
│   └── DEMO_SCRIPT.md           # 4-Minute video demonstration script & narrative
│
├── backend/                     # Python 3.12 FastAPI Core (managed via uv)
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── README.md                # Dedicated backend documentation
│   ├── app/
│   │   ├── main.py              # Application entrypoint
│   │   ├── api/                 # REST endpoints (telemetry, dispersion, incidents, vernacular)
│   │   ├── core/                # Config, prompts (Gemini 3.5 Flash-Lite) & security
│   │   ├── data/                # Sensitive infrastructure GeoJSON datasets
│   │   ├── models/              # Pydantic v2 schemas (dispersion, weather, forensic, incident)
│   │   └── services/            # Atmospheric dispersion engine, Gemini forensics & vernacular
│   │       └── README.md        # Service-level API reference
│   └── tests/                   # 62+ passing unit, integration & benchmark tests
│
└── frontend/                    # React 18 + Vite 5 Web App (managed via pnpm)
    ├── Dockerfile
    ├── package.json
    ├── vercel.json              # Frontend Vercel configuration
    └── src/                     # UI components, Google Maps wrapper & Web Speech audio player
```

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
