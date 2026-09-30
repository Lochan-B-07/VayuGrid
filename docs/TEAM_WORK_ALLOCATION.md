# VayuGrid (वायुग्रिड): 4-Member Professional Work Allocation

**Project Track:** Track 2 — Clean Air & Climate Resilience (Build with AI: Code for Communities)  
**Team Structure:** 4 Dedicated Engineers with Equal Ownership & Clear Cross-System Interfaces

---

## Team Overview & Ownership Matrix

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       SYSTEM INTEGRATION                                        │
├───────────────────────────────┬───────────────────────────────┬─────────────────────────────────┤
│ Role & Member                 │ Core Domain Responsibility    │ Primary Tech Stack              │
├───────────────────────────────┼───────────────────────────────┼─────────────────────────────────┤
│ Member 1: Frontend & UX       │ ULB Command Desk & Citizen PWA│ React 18, Vite, Tailwind CSS,   │
│ Lead                          │ Multi-city view, Audio Player │ Lucide, Google Maps JS API      │
├───────────────────────────────┼───────────────────────────────┼─────────────────────────────────┤
│ Member 2: Backend & Systems   │ FastAPI REST Core, Ingestion, │ Python 3.12, FastAPI, Pydantic, │
│ Lead                          │ Dispatch Queue, Incident Store│ Uvicorn, SQLite/PostGIS, Docker │
├───────────────────────────────┼───────────────────────────────┼─────────────────────────────────┤
│ Member 3: AI/ML & Vernacular  │ Gemini Multimodal Forensics,  │ Google Generative AI SDK,       │
│ Lead                          │ Strict JSON Schemas, Speech   │ Gemini 3.5 Flash-Lite, Web TTS  │
├───────────────────────────────┼───────────────────────────────┼─────────────────────────────────┤
│ Member 4: Geospatial, Physics │ Gaussian Plume Dispersion,    │ Shapely, NumPy, Open-Meteo API, │
│ & Cloud Lead                  │ Wind Advection, Cloud Run     │ OpenAQ API, GCP Cloud Run       │
└───────────────────────────────┴───────────────────────────────┴─────────────────────────────────┘
```

---

## Detailed Member Breakdown

### Member 1: Frontend & UX Lead (ULB Executive Command & Citizen PWA)
* **Goal:** Deliver an intuitive dual-persona interface (Executive Command vs. Citizen Resilience) that impresses evaluators within the first 10 seconds.
* **Core Responsibilities:**
  1. **ULB Executive Command Dashboard (`/admin`):**
     * Multi-city selector dropdown (**Delhi-NCR, Bengaluru, Kanpur, Mumbai, Punjab Agrarian Corridor**).
     * Interactive map integrating Google Maps JavaScript API with dynamic vector polygon rendering for plume cones.
     * Real-time statutory enforcement queue with action buttons (*"Dispatch Smog Gun Truck"*, *"Issue Section 133 EP Act Notice"*).
  2. **Citizen Resilience Interface (`/report` & `/citizen`):**
     * Single-tap photo upload with browser geolocation fallback (`navigator.geolocation`).
     * Real-time vernacular audio player supporting 6 languages: **English, Hindi, Telugu, Kannada, Tamil, Malayalam**.
     * Visual plume hazard radius indicator & safe walking corridor route display.
  3. **State Management & UX Polish:**
     * Loading skeletons, optimistic UI updates, and error toast states.
     * Dark/Light mode theme tuned for operational command centers.
* **Key Deliverable Files:**
  * `frontend/src/components/CommandMap.jsx`
  * `frontend/src/components/IncidentQueue.jsx`
  * `frontend/src/components/CitizenReporter.jsx`
  * `frontend/src/components/VernacularAudioPlayer.jsx`
  * `frontend/src/components/CitySelector.jsx`

---

### Member 2: Backend & Distributed Systems Lead (FastAPI Core & Ingestion Engine)
* **Goal:** Provide a resilient, high-throughput backend coordinating media ingestion, incident ticketing, database persistence, and external REST endpoints.
* **Core Responsibilities:**
  1. **FastAPI Application Architecture:**
     * Project layout, middleware (CORS, timing, error interceptors), and Pydantic v2 data models.
     * Upload validation (MIME-type checks, base64 / multipart parsing, file size bounds).
  2. **Data Ingestion Pipeline (Tier-B & Tier-C):**
     * REST endpoint `/api/v1/incidents/audit` coordinating forensic analysis, meteorological telemetry, and dispersion calculation.
     * Integration with OpenAQ / CPCB public feeds for live background station AQI polling.
  3. **Ticket & Dispatch Workflow:**
     * Unique ticket generator (`VAYU-{CITY}-{TIMESTAMP}-{HASH}`).
     * Incident lifecycle manager (`PENDING_AUDIT` $\rightarrow$ `VERIFIED_HAZARD` $\rightarrow$ `DISPATCHED` $\rightarrow$ `RESOLVED`).
     * Mock in-memory / SQLite persistence layer for incident records.
* **Key Deliverable Files:**
  * `backend/app/main.py`
  * `backend/app/api/endpoints/incidents.py`
  * `backend/app/api/endpoints/telemetry.py`
  * `backend/app/models/incident.py`
  * `backend/app/services/ticket_service.py`

---

### Member 3: AI/ML & Vernacular Intelligence Lead (Gemini Multimodal & Speech Engine)
* **Goal:** Architect zero-temperature, reliable Gemini 3.5 Flash-Lite multimodal reasoning pipelines with strict JSON schemas and multi-language alert synthesis.
* **Core Responsibilities:**
  1. **Gemini Multimodal Forensic Audit Pipeline:**
     * System prompt engineering for anti-spoofing verification and outdoor environmental validation.
     * 6-way classification:
       - `OPEN_MUNICIPAL_WASTE_BURNING`
       - `CONSTRUCTION_DEMOLITION_DUST`
       - `INDUSTRIAL_STACK_EMISSION`
       - `BIOMASS_STUBBLE_BURNING`
       - `HIGH_DENSITY_VEHICULAR_IDLING`
       - `UNPAVED_ROAD_SUSPENSION`
     * Optical smoke opacity estimation (0.0 to 1.0) and plume radius estimation.
     * Statutory municipal intervention recommendation generation.
  2. **Vernacular Translation & Synthesis Engine:**
     * Multi-language translation prompt generator producing JSON across 6 languages:
       `en` (English), `hi` (Hindi), `te` (Telugu), `kn` (Kannada), `ta` (Tamil), `ml` (Malayalam).
     * Audio synthesis: Built-in Browser Web Speech API (`window.speechSynthesis`) with dual-tone emergency broadcast chime (Web Audio API) + optional Cloud TTS fallback.
  3. **AI Evaluation & Test Fixtures:**
     * Create synthetic test image suites (plastic burning, construction site, clean road) to validate model precision and schema adherence.
* **Key Deliverable Files:**
  * `backend/app/services/gemini_forensic.py`
  * `backend/app/services/vernacular_service.py`
  * `backend/app/core/prompts.py`
  * `backend/app/data/sample_audit_payloads.py`

---

### Member 4: Geospatial, Physics & Cloud Lead (Gaussian Dispersion, Weather & Deployment)
* **Status:** ✅ **100% Engineering Complete & Verified** ([Detailed Handover Guide](ROLE_4_HANDOVER.md))
* **Goal:** Model the physics of downwind air dispersion, calculate real-time vulnerable infrastructure intersections, and manage cloud infrastructure.
* **Core Responsibilities & Deliverables Completed:**
  1. **Meteorological Vector Ingestion:**
     * Real-time telemetry ingestion from Open-Meteo API (wind speed at 10m, wind direction bearing, boundary layer height, ambient temperature, relative humidity).
     * Downwind trajectory bearing calculation: $\theta_{downwind} = (\theta_{wind} + 180^\circ) \pmod{360^\circ}$.
     * Pasquill-Gifford stability determination (A-F) & friction velocity ($u_*$).
     * Pre-computed microclimate fallbacks for Delhi-NCR, Bengaluru, Kanpur, Mumbai, Punjab.
  2. **Gaussian Plume & Puff Dispersion Model:**
     * Irwin vertical wind shear profile: $u(z) = u_{10}(z/10)^p$.
     * Briggs buoyant plume rise: $\Delta H = f(F_b, F_m, u, \text{Stability})$.
     * Briggs continuous rational formulas for $\sigma_y(x)$ and $\sigma_z(x)$ across all 12 stability regimes.
     * Boundary layer 5-term method of images reflection with uniform mixing transition ($\sigma_z \ge 1.6 z_i$).
     * Closed-form statutory isopleths (`HAZARDOUS`, `SEVERE`, `MODERATE`, `ADVISORY`) in $< 1\text{ ms}$.
     * Transient Lagrangian puff milestones ($5, 15, 30, 60\text{ mins}$) with arrival countdown timers.
     * Backwards-compatible legacy exposure cone mapping for seamless frontend integration.
  3. **Geospatial Infrastructure Intersection:**
     * Catalog of 25+ real-world schools, healthcare centers, and dense residential wards across 5 Indian archetypes.
     * Estimated arrival time calculation: $t = (d / u) \times 60 \text{ mins}$ and spatial distance filters.
  4. **DevOps, Docker, Vercel & Cloud Run Deployment:**
     * Multi-container Docker configuration for local and cloud environments.
     * Vercel frontend build configuration (`frontend/vercel.json` & root `vercel.json`).
     * Google Cloud Run deployment scripts and environment secret configuration.
     * 38 automated verification tests (unit, mass conservation, weak-PC latency benchmarks).
* **Key Deliverable Files:**
  * `backend/app/services/dispersion_engine.py`
  * `backend/app/services/weather_service.py`
  * `backend/app/data/sensitive_infrastructure.py`
  * `backend/tests/` (5 test suites, 38 passing tests)
  * `frontend/vercel.json` & `vercel.json`
  * `docs/ROLE_4_HANDOVER.md`
  * `docker-compose.yml`

---

## Collaborative Schedule & Milestones (6-Day Sprint)

```
┌──────────┬────────────────────────────────────────────────────────────────────────────────────────┐
│ Day      │ Shared Milestone & Integration Checkpoint                                              │
├──────────┼────────────────────────────────────────────────────────────────────────────────────────┤
│ Day 1    │ • Repo initialization, branch protection, env templates, API contract alignment.       │
│          │ • Member 1 & 2 agree on JSON schemas; Member 3 & 4 validate weather & Gemini keys.     │
├──────────┼────────────────────────────────────────────────────────────────────────────────────────┤
│ Day 2    │ • Member 2 builds FastAPI server skeleton & mock endpoints.                            │
│          │ • Member 3 validates Gemini multimodal prompt & JSON schema with test images.          │
│          │ • Member 4 writes Gaussian cone generator & Open-Meteo client.                         │
│          │ • Member 1 builds UI layout, responsive shell, and Google Maps wrapper.                │
├──────────┼────────────────────────────────────────────────────────────────────────────────────────┤
│ Day 3    │ • Backend Integration: Member 2 connects Member 3 (Gemini) and Member 4 (Dispersion).  │
│          │ • Member 1 connects live API to Google Maps vector cone rendering.                     │
│          │ • Full end-to-end pipeline verified on local machine with test images.                 │
├──────────┼────────────────────────────────────────────────────────────────────────────────────────┤
│ Day 4    │ • Multi-city selector added (Delhi, Bengaluru, Kanpur, Mumbai, Punjab).               │
│          │ • Vernacular audio synthesis wired across 6 Indian languages.                          │
│          │ • ULB dispatch workflow and action buttons functional.                                 │
├──────────┼────────────────────────────────────────────────────────────────────────────────────────┤
│ Day 5    │ • Cloud deployment to Google Cloud Run (Backend) and Firebase/Vercel (Frontend).       │
│          │ • Rigorous error-handling tests: offline mode, invalid images, quota fallback.         │
├──────────┼────────────────────────────────────────────────────────────────────────────────────────┤
│ Day 6    │ • Record 4-minute demonstration video using DEMO_SCRIPT.md.                            │
│          │ • Finalize 10-slide Pitch Deck using PITCH_DECK.md.                                    │
│          │ • Final README verification and repository submission freeze.                          │
└──────────┴────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Git Branching Strategy & Workflow Rules

* `main`: Production-ready, stable codebase. Deploys to hosted environment.
* `develop`: Active integration branch where feature branches merge via Pull Request.
* **Feature Branches:**
  * `feature/m1-frontend-command-desk`
  * `feature/m2-backend-fastapi-core`
  * `feature/m3-gemini-forensics-vernacular`
  * `feature/m4-physics-dispersion-geospatial`
* **Rule:** No direct commits to `main`. Every PR requires at least 1 peer review and pass lint checks.
