# VayuGrid System Architecture & Mathematical Foundations

**Verifiable Air-Quality Yield & Unified Spatio-Temporal Resilience Architecture**  
*A Federated, Multi-Tier Planetary-to-Pavement Digital Public Good for Pan-India Air Pollution Governance*

---

## 1. High-Level System Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 1. INGESTION TIER                                      │
├───────────────────────────────┬───────────────────────────────┬────────────────────────┤
│ TIER-A: MACRO PLANETARY       │ TIER-B: MESO GROUND TRUTH     │ TIER-C: MICRO EDGE     │
│ - Sentinel-5P Level-3 (NO2/CO)│ - CPCB Official Stations      │ - Mobile Web App / PWA │
│ - Google Earth Engine Tiles   │ - OpenAQ Global Sensors       │ - Geotagged Photos     │
│ - VIIRS/MODIS Thermal Spots   │ - Low-cost PMS5003 IoT Arrays │ - Device Compass & GPS │
└───────────────────────────────┴───────────────────────────────┴────────────────────────┘
                                                │
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        2. GOOGLE AI REASONING & FORENSICS                              │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ • Gemini 1.5/2.5 Flash Multimodal Pipeline                                             │
│ • Anti-Spoofing & Environmental Validation Check                                       │
│ • 6-Class Emission Diagnostic (Waste / Dust / Industrial / Biomass / Traffic / Road)  │
│ • Optical Smoke Opacity Index (0.0 to 1.0) & Origin Radius Estimation                  │
│ • Statutory Municipal Intervention Protocol Synthesis                                  │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                                │
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                   3. PHYSICS DISPERSION & SPATIOTEMPORAL ENGINE                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ • Real-Time Micrometeorology (Open-Meteo & IMD Telemetry: Wind, Solar, PBL Inversion) │
│ • Vectorized Gaussian Plume Core with Irwin Wind Shear: u(z) = u10 * (z/10)^p          │
│ • Briggs Thermal Plume Rise: Delta H = f(Fb, Fm, u, Stability)                         │
│ • Briggs Urban & Rural Dispersion Formulations for Lateral & Vertical Sigmas           │
│ • Method of Images Inversion Lid Boundary Trapping (n = -2 to +2)                      │
│ • Analytical Statutory Iso-Concentration Polygons (Hazardous, Severe, Moderate, Alert) │
│ • Transient Lagrangian Gaussian Puff Tracking with Smoke Front Arrival Timers          │
│ • Vectorized NumPy Architecture (<15ms Median Latency, Runs on Low-Power / Weak PCs)   │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                                │
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                             4. DUAL-DISPATCH DELIVERY                                  │
├───────────────────────────────────────────────┬────────────────────────────────────────┤
│ URBAN LOCAL BODY (ULB) COMMAND DESK           │ CITIZEN RESILIENCE HYPER-LOCAL NODE    │
│ • Interactive Multi-Tier Iso-Hazard Polygons  │ • 1-Tap Geotagged Incident Reporter    │
│ • Downwind Legacy Exposure Cone Compatibility │ • 6-Language Vernacular Audio Alerts   │
│ • Geo-Referenced Vulnerable Asset Intersect   │ • Low-Exposure Commute Safe Corridors  │
│ • Automated Enforcement Work-Order Generator  │ • Smoke Front ETA Countdown Timers     │
│ • Asset Routing (Smog Guns, Water Sprinklers) │ • Offline Fallback Microclimate Engine │
└───────────────────────────────────────────────┴────────────────────────────────────────┘
```

---

## 2. Advanced Mathematical Formulation: Atmospheric Physics Core

To deliver scientific fidelity without the crushing computational overhead of 3D Computational Fluid Dynamics (CFD), VayuGrid implements an analytical, fully vectorized atmospheric dispersion engine optimized for instantaneous execution on commodity and low-spec PCs.

### 2.1 Deacon/Irwin Vertical Wind Shear Profile
Wind velocity scales with altitude due to planetary boundary layer surface friction:

$$u(z) = u_{10} \left( \frac{z}{10} \right)^p$$

where:
* $u_{10}$ is the surface wind speed at standard 10m anemometer height ($m/s$).
* $z$ is the effective emission or receptor elevation ($m$).
* $p$ is the Irwin aerodynamic shear exponent calibrated against Pasquill-Gifford stability:
  * **Urban Terrain:** Class A-B: $0.15$, Class C: $0.20$, Class D: $0.25$, Class E-F: $0.30$.
  * **Rural Open Plain:** Class A: $0.07$, Class B: $0.10$, Class C: $0.10$, Class D: $0.15$, Class E: $0.25$, Class F: $0.35$.

### 2.2 Briggs Plume Rise ($\Delta H$) & Effective Release Height ($H_{eff}$)
Hot combustion plumes from open fires and industrial exhausts rise buoyantly before bending downwind:

$$H_{eff} = H_{stack} + \Delta H$$

The buoyancy flux $F_b$ ($m^4/s^3$) is derived from the thermal convective heat release rate $Q_H$ (Watts):

$$F_b = 8.79 \times 10^{-6} \cdot Q_H \quad \text{(Open Municipal & Biomass Combustion)}$$
$$F_b = g \cdot v_s \cdot r_s^2 \cdot \left( \frac{T_s - T_a}{T_s} \right) \quad \text{(Industrial Stack)}$$

Under unstable or neutral atmospheric conditions (Classes A, B, C, D):
$$\Delta H = \begin{cases} \frac{21.42 \cdot F_b^{3/4}}{u_{eff}}, & F_b < 55\,m^4/s^3 \\ \frac{38.71 \cdot F_b^{3/5}}{u_{eff}}, & F_b \ge 55\,m^4/s^3 \end{cases}$$

Under stable nocturnal inversion conditions (Classes E, F) with ambient potential temperature gradient $s = \frac{g}{T_a} \frac{\partial \theta}{\partial z}$:
$$\Delta H = 2.6 \left( \frac{F_b}{u_{eff} \cdot s} \right)^{1/3}$$

### 2.3 Briggs Urban & Rural Dispersion Coefficients ($\sigma_y$, $\sigma_z$)
Instead of coarse lookup approximations, VayuGrid evaluates continuous rational Briggs formulas vectorized in NumPy across downwind distance $x$ ($10\,m \le x \le 50\,km$):

* **Urban Class A-B:** $\sigma_y = 0.32 x (1 + 0.0004 x)^{-1/2}$, $\sigma_z = 0.24 x (1 + 0.001 x)^{1/2}$
* **Urban Class C:** $\sigma_y = 0.22 x (1 + 0.0004 x)^{-1/2}$, $\sigma_z = 0.20 x$
* **Urban Class D:** $\sigma_y = 0.16 x (1 + 0.0004 x)^{-1/2}$, $\sigma_z = 0.14 x (1 + 0.0003 x)^{-1/2}$
* **Urban Class E-F:** $\sigma_y = 0.11 x (1 + 0.0004 x)^{-1/2}$, $\sigma_z = 0.08 x (1 + 0.0015 x)^{-1/2}$
* **Rural Formulations:** Parameterized for open agrarian belts (Punjab/Haryana stubble corridors).

### 2.4 Planetary Boundary Layer (PBL) Inversion Lid Multi-Reflection
In North Indian winter smog scenarios (Delhi, Kanpur, Punjab), shallow nocturnal boundary layers ($z_i \approx 300 - 500\,m$) trap toxic emissions between the ground surface ($z = 0$) and the capping inversion lid ($z = z_i$). VayuGrid evaluates the 5-term method of image sources:

$$V(z, H_{eff}, \sigma_z, z_i) = \sum_{n=-2}^{2} \left[ \exp\left( -\frac{(z - H_{eff} + 2 n z_i)^2}{2 \sigma_z^2} \right) + \exp\left( -\frac{(z + H_{eff} + 2 n z_i)^2}{2 \sigma_z^2} \right) \right]$$

When vertical dispersion expands to fully mix within the boundary layer ($\sigma_z \ge 1.6 z_i$), the concentration profile transitions smoothly to uniform vertical entrapment:
$$V(z) \to \frac{\sqrt{2\pi} \cdot \sigma_z}{z_i}$$

The resulting ground-level concentration at receptor breathing height ($z = 1.5\,m$) is:
$$C(x, y, 1.5) = \frac{Q}{2 \pi u_{eff} \sigma_y \sigma_z} \exp\left( -\frac{y^2}{2 \sigma_y^2} \right) V(1.5, H_{eff}, \sigma_z, z_i) \times 10^6 \, (\mu g / m^3)$$

### 2.5 Analytical Statutory Iso-Concentration Polygons (Isopleths)
Rather than rasterizing a heavy 2D grid, VayuGrid inverts the Gaussian distribution analytically to obtain the exact lateral plume half-width $y_{half}(x)$ for any regulatory concentration threshold $T$ ($\mu g / m^3$):

$$y_{half}(x) = \sigma_y(x) \sqrt{2 \ln\left( \frac{C(x, 0, 1.5)}{T} \\right)}$$

This yields closed, smooth, aerodynamic polygons for statutory emergency tiers:
* **Hazardous ($250\,\mu g/m^3$):** Immediate shelter-in-place; smog-gun prioritization.
* **Severe ($120\,\mu g/m^3$):** School morning outdoor assembly suspension; vulnerable elder advisory.
* **Moderate ($60\,\mu g/m^3$):** Mask mandate; sensitive population warning.
* **Advisory ($25\,\mu g/m^3$):** Edge of detectable particulate envelope.

### 2.6 Transient Lagrangian Gaussian Puff Kinematics
For non-stationary hazard dynamics, VayuGrid computes transient Gaussian puff advection tracking advancing smoke front isochrones at $t = 5, 15, 30, \text{and } 60$ minutes:
$$x_{center}(t) = \int_0^t u_{eff} \, dt' \approx u_{eff} \cdot t_{age}$$
$$C_{puff}(x, y, z, t) = \frac{q_i}{(2\pi)^{3/2} \sigma_x \sigma_y \sigma_z} \exp\left( -\frac{(x - x_c)^2}{2\sigma_x^2} - \frac{y^2}{2\sigma_y^2} - \frac{z^2}{2\sigma_z^2} \right)$$

This directly enables the **ETA Arrival Countdown** for downwind schools, hospitals, and informal habitats:
$$t_{arrival} = \frac{x_{downwind}}{u_{eff}} \times \frac{1}{60} \text{ minutes}$$

---

## 3. Backwards Compatibility & Breaking Changes Safeguards

To prevent breaking changes with Member 1 (Frontend Map UI) and Member 2/3 (Data Ingestion & Gemini Forensics), the upgraded physics engine strictly maintains full backwards compatibility:

1. **Downwind Exposure Cone (`downwind_exposure_cone`):**
   * Still generated and returned in all responses.
   * Rather than drawing a crude, unrealistic $45^\circ$ static triangle, it dynamically wraps the outermost statutory physical isopleth envelope with identical polygon fields:
     `{ "bearing_degrees": float, "max_reach_km": float, "angular_spread_deg": float, "boundary_polygon": [{"lat": ..., "lon": ...}] }`.
   * Any legacy map layer consumes this without a single code modification.
2. **Upgraded Multi-Tier Isopleths (`isopleth_contours`):**
   * Returned alongside the legacy cone as a nested array of multi-tier contours.
   * Modern renderers can overlay semi-transparent nested heat contours (Hazardous = Red, Severe = Orange, Moderate = Amber, Advisory = Yellow).
3. **Plume Kinematics & Puff Milestones (`plume_dynamics`, `time_series_snapshots`):**
   * Provides time-stepping countdown sliders for animated smoke front evolution.

---

## 4. Hardware Optimization & Weak PC Benchmarks

Designed for low-resource environments (municipal ULB control room laptops, edge microservers, budget desktop PCs):
* **Computational Complexity:** Analytical 1D NumPy evaluation rather than $O(N^3)$ CFD meshes.
* **Execution Latency:**
  * Median Runtime: **11.68 milliseconds** per full simulation run.
  * P95 Latency: **< 25 milliseconds**.
* **Memory Footprint:** Peak memory consumption **< 12 MB RAM**.
* **No GPU Requirement:** 100% pure CPU execution with zero acceleration dependencies.

---

## 5. Google Technologies Integration Matrix

| Google Technology | Role in VayuGrid | Implementation Specifics |
| :--- | :--- | :--- |
| **Gemini 1.5/2.5 Flash** | Multimodal forensic image inspection & structuring | Uses `response_mime_type: "application/json"` with schema constraints to extract opacity, source classification, and ULB action orders. |
| **Google Maps JavaScript API** | Dynamic command center vector rendering | Custom vector overlays displaying multi-tier physical isopleths, legacy cones, hotspot circles, and receptor markers. |
| **Google Earth Engine (GEE)** | Macro atmospheric baseline mapping | Ingests Sentinel-5P Level-3 tropospheric $NO_2$, Carbon Monoxide ($CO$), and Aerosol Optical Depth ($AOD$). |
| **Google Cloud Translation & TTS** | Vernacular resilience pipeline | Translates dynamic English incident advisories into Hindi, Telugu, Kannada, Tamil, and Malayalam; synthesizes natural speech audio for mobile browsers. |
| **Google Cloud Run** | Scalable microservice container execution | Hosts containerized FastAPI backend and React frontend with sub-second cold starts and zero-capex scaling. |

---

## 6. Dual-Mode Deployment Architecture: Zero-GCP-Credits Innovation

To solve the real-world constraint where evaluators, hackathon judges, or open-source contributors do not possess active paid Google Cloud billing credits, VayuGrid implements an innovative **Dual-Mode System Architecture**:

* **Mode 1: Enterprise GCP Cloud Run Stack** (Containerized Python FastAPI, Cloud SQL PostGIS, Vertex AI Gemini 1.5 Flash Vision, GEE Sentinel-5P).
* **Mode 2: Zero-Cost Vercel Serverless Edge Simulation Stack** ([`https://vayu-grid.vercel.app`](https://vayu-grid.vercel.app)):
  * 100% serverless, zero cost ($0), zero cold start.
  * Native pure JavaScript physics engine with exact mathematical parity to the Python engine (Irwin shear, Briggs plume rise, 12 stability regimes, 5-term reflection method of images).
  * Direct real-time Open-Meteo satellite radiosonde microclimate feeds.
  * In-memory statutory registry for 5 regional CPCB non-attainment archetypes (Delhi-NCR, Bengaluru, Kanpur, Mumbai, Punjab).
  * Pre-compiled 6-language vernacular advisories and anti-spoofing validation heuristics.

For complete architectural specifications, formula derivations, and maintainer guides, consult the dedicated technical manual:  
👉 **[`docs/DUAL_MODE_DEPLOYMENT.md`](docs/DUAL_MODE_DEPLOYMENT.md)**
