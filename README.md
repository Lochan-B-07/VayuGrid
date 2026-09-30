<div align="center">

# 🌬️ VayuGrid (वायुग्रिड)
### Verifiable Air-Quality Yield & Unified Spatio-Temporal Resilience Architecture

**A Federated, Multi-Tier Planetary-to-Pavement Digital Public Good for Pan-India Air Pollution Governance**

[![Hackathon](https://img.shields.io/badge/Event-Build%20with%20AI%3A%20Code%20for%20Communities-blue?style=for-the-badge&logo=google)](https://hack2skill.com)
[![Track](https://img.shields.io/badge/Track-Clean%20Air%20%26%20Climate%20Resilience-green?style=for-the-badge)](https://hack2skill.com)
[![Google AI](https://img.shields.io/badge/Google%20AI-Gemini%20Flash%20Multimodal-orange?style=for-the-badge&logo=google)](https://aistudio.google.com)
[![Tests: 38 Passing](https://img.shields.io/badge/Tests-38%20Passing-brightgreen?style=for-the-badge)](backend/tests/)
[![Latency: Sub--15ms](https://img.shields.io/badge/Latency-Sub--15ms%20Weak%20PC-success?style=for-the-badge)](backend/tests/test_benchmark_weak_pc.py)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-vayu--grid.vercel.app-blueviolet?style=for-the-badge&logo=vercel)](https://vayu-grid.vercel.app)

[🚀 Live Demo](https://vayu-grid.vercel.app) • [Architecture](docs/ARCHITECTURE.md) • [4-Member Work Allocation](docs/TEAM_WORK_ALLOCATION.md) • [Role 4 Handover](docs/ROLE_4_HANDOVER.md) • [API Contracts](docs/API_CONTRACTS.md) • [Pitch Deck](docs/PITCH_DECK.md) • [Demo Script](docs/DEMO_SCRIPT.md)

</div>

---

## 📌 Executive Summary

India's National Clean Air Programme (NCAP) monitors ambient air through Continuous Ambient Air Quality Monitoring Stations (CAAQMS). However, systemic operational barriers limit effective intervention:
1. **Capex & Spatial Gaps:** Each station costs ₹1.0–1.5 Crore to deploy and maintain, leaving Tier-2/3 industrial towns and rural districts underserved.
2. **Elevation vs. Breathing Zone Mismatch:** CAAQMS units are installed 10–15m atop government rooftops, measuring regional averages while missing acute toxic plumes at the 0–2m human breathing zone.
3. **Passive Metric Display vs. Proactive Enforcement:** Current platforms report numbers (*"AQI is 342 - Very Poor"*) without identifying the emission source, predicting the downwind exposure corridor, or dispatching municipal assets.

**VayuGrid** breaks this paradigm by fusing **macro satellite feeds (Sentinel-5P via Google Earth Engine)**, **meso ground sensors (CPCB/OpenAQ)**, and **micro crowdsourced citizen telemetry** through **Google Gemini Flash Multimodal Forensics** and a **Vectorized, Physics-Constrained Atmospheric Dispersion & Puff Simulation Engine**.

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
|   A. Multimodal Emission Forensic Agent (Gemini 1.5 / 2.5 Flash via Google AI Studio / Vertex AI)       |
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

## 👥 4-Member Professional Work Allocation

To ensure rapid, modular, and balanced execution during the hackathon, the system is split across four distinct engineering leads with defined interfaces:

| Member & Role | Core Domain & Ownership | Primary Deliverables | Detailed Plan |
| :--- | :--- | :--- | :--- |
| **Member 1: Frontend & UX Lead** | ULB Administrative Command Desk & Citizen PWA | React UI, Google Maps polygon vector rendering, Multi-city selector, Vernacular audio player | [Details](docs/TEAM_WORK_ALLOCATION.md#member-1-frontend--ux-lead-ulb-executive-command--citizen-pwa) |
| **Member 2: Backend & Systems Lead** | FastAPI REST Core, Ingestion Engine & Dispatch Queue | Data contracts, `/api/v1/incidents/audit`, ticket lifecycle, database models | [Details](docs/TEAM_WORK_ALLOCATION.md#member-2-backend--distributed-systems-lead-fastapi-core--ingestion-engine) |
| **Member 3: AI/ML & Vernacular Lead** | Gemini Multimodal Forensics & Multilingual Audio | Strict JSON schema prompts, anti-spoofing filter, 6-language translation & speech synthesis | [Details](docs/TEAM_WORK_ALLOCATION.md#member-3-aiml--vernacular-intelligence-lead-gemini-multimodal--speech-engine) |
| **Member 4: Geospatial & Cloud Lead** | Atmospheric Physics, Weather Telemetry & Deployment | Vectorized Gaussian plume/puff engine, 38 passing tests, Vercel & Cloud Run configs | [Details & Handover](docs/ROLE_4_HANDOVER.md) |

👉 Full breakdown, milestone schedule, and branch strategy: **[`docs/TEAM_WORK_ALLOCATION.md`](docs/TEAM_WORK_ALLOCATION.md)**

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

To protect non-literate and regional populations, emergency advisories are synthesized in real-time across:
* **English (en)**
* **Hindi (hi - हिंदी)**
* **Telugu (te - తెలుగు)**
* **Kannada (kn - ಕನ್ನಡ)**
* **Tamil (ta - தமிழ்)**
* **Malayalam (ml - മലയാളം)**

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

# Run the 38 automated verification tests
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
├── docs/                        # Complete Hackathon Deliverables & Specifications
│   ├── ARCHITECTURE.md          # System architecture & Briggs plume mathematics
│   ├── TEAM_WORK_ALLOCATION.md  # 4-Member professional split, milestones & git flow
│   ├── ROLE_4_HANDOVER.md       # Member 4 complete engineering handover guide
│   ├── API_CONTRACTS.md         # Full REST endpoints & Pydantic JSON schemas
│   ├── PITCH_DECK.md            # 12-Slide hackathon presentation framework
│   └── DEMO_SCRIPT.md           # 4-Minute video demonstration script & narrative
│
├── backend/                     # Python 3.12 FastAPI Core (managed via uv)
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── README.md                # Dedicated backend documentation
│   ├── app/
│   │   ├── main.py              # Application entrypoint
│   │   ├── api/                 # REST endpoints (telemetry, dispersion, incidents)
│   │   ├── core/                # Config, prompts & security
│   │   ├── data/                # Sensitive infrastructure GeoJSON datasets
│   │   ├── models/              # Pydantic v2 schemas (dispersion, weather)
│   │   └── services/            # Atmospheric dispersion engine & weather service
│   │       └── README.md        # Service-level API reference
│   └── tests/                   # 38 passing unit, integration & benchmark tests
│
└── frontend/                    # React 18 + Vite 5 Web App (managed via pnpm)
    ├── Dockerfile
    ├── package.json
    ├── vercel.json              # Frontend Vercel configuration
    └── src/                     # UI components, Google Maps wrapper & audio player
```

---

## 🏆 Hackathon Compliance & Deliverables Checklist

* [x] **Public GitHub Repository:** Documented `README.md`, setup scripts, and modular source tree.
* [x] **4-Member Work Allocation:** Documented in [`docs/TEAM_WORK_ALLOCATION.md`](docs/TEAM_WORK_ALLOCATION.md).
* [x] **Role 4 Engineering Handover:** Documented in [`docs/ROLE_4_HANDOVER.md`](docs/ROLE_4_HANDOVER.md).
* [x] **Architecture & Mathematical Specification:** Documented in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
* [x] **10-12 Slide Pitch Deck Framework:** Documented in [`docs/PITCH_DECK.md`](docs/PITCH_DECK.md).
* [x] **3-to-5 Minute Demo Video Script:** Documented in [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md).
* [x] **Production API Contracts:** Documented in [`docs/API_CONTRACTS.md`](docs/API_CONTRACTS.md).
* [x] **Automated Test Suite:** 38/38 passing tests with sub-15ms weak-PC benchmark.
* [x] **Deployment Ready:** Root & frontend `vercel.json` and Google Cloud Run deployment scripts prepared.
* [x] **Google AI Utilization:** Gemini 1.5/2.5 Flash, Google Maps Platform, Google Earth Engine, Cloud TTS/Translation.

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
