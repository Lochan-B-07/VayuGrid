# VayuGrid (वायुग्रिड): 4-Minute Demonstration Video Script

**Target Duration:** 3:45 to 4:15 minutes  
**Format:** Screen Recording + Webcam Inset + Live System Interaction

---

## Storyboard Timeline Summary

| Timecode | Segment | Primary Visual on Screen | Voiceover Focus |
| :--- | :--- | :--- | :--- |
| **0:00 - 0:35** | The Problem | Split view: Rooftop CAAQMS sensor vs. ground-level garbage fire. | Explain the ₹1.5 Cr cost barrier and the 15m elevation mismatch. |
| **0:35 - 1:15** | The Architecture | Interactive Architecture Diagram / Multi-Tier Ingestion flow. | Introduce the Planetary-to-Pavement DPG powered by Google AI. |
| **1:15 - 2:05** | Citizen Telemetry & Gemini Forensic Audit | Live Citizen PWA upload of a real waste burning photo. | Show anti-spoofing check, 6-way classification, and JSON output. |
| **2:05 - 2:50** | Physics Plume Dispersion & Map Projection | Command Desk map: Live Open-Meteo wind vectors + downwind cone. | Highlight polygon intersection with downwind school and hospital. |
| **2:50 - 3:30** | Dual Dispatch: ULB Work-Order & Vernacular Audio | Click "Dispatch Smog Gun" + Click play on Hindi, Kannada & Telugu audio. | Demonstrate instant administrative action and vernacular accessibility. |
| **3:30 - 4:00** | Multi-City Scalability & Conclusion | Switch city dropdown: Delhi $\rightarrow$ Bengaluru $\rightarrow$ Kanpur. | Highlight zero-capex Day-1 deployment across all 700+ Indian districts. |

---

## Detailed Script & Spoken Transcript

### [0:00 - 0:35] Scene 1: The National Air Quality Blind Spot
* **Visual:**
  * Screen opens on an official air dashboard showing a static number: *"AQI: 365 - Severe"*.
  * Mouse cursor highlights the problem: No indication of who caused the spike or where the plume is traveling.
* **Speaker:**
  > *"Every winter across India, millions of citizens breathe toxic air. But today's monitoring system suffers from a critical blind spot. A standard CPCB monitoring station costs over ₹1.5 Crore to build, meaning 90% of Indian towns have no real-time ground sensors. Even where they exist, they are installed 15 meters high on government rooftops — completely missing the toxic garbage fires, road dust, and vehicle idling plumes where citizens actually walk and breathe. Today, we introduce **VayuGrid**."*

---

### [0:35 - 1:15] Scene 2: The Planetary-to-Pavement Digital Public Good
* **Visual:**
  * Transition to the VayuGrid landing view with the clean dual-persona toggle (**ULB Administrative Command** vs. **Citizen Resilience Node**).
* **Speaker:**
  > *"VayuGrid is a federated, multi-tier Digital Public Good. It fuses macro satellite feeds from Sentinel-5P on Google Earth Engine, official ground station feeds from CPCB and OpenAQ, and hyper-local geotagged photos from citizens and municipal field wardens. At the center is Google Gemini Flash, acting as an autonomous Chief Environmental Forensic Inspector."*

---

### [1:15 - 2:05] Scene 3: Live Citizen Telemetry & Gemini Multimodal Forensic Audit
* **Visual:**
  * Switch to **Citizen Reporting PWA**.
  * Click *"Upload Incident Photo"* and select a field image of open municipal plastic waste burning in East Delhi.
  * Browser GPS automatically pins latitude: `28.6139`, longitude: `77.2090`.
  * Click *"Submit for Forensic Audit"*.
  * Show the immediate response card (< 1.5 seconds) displaying Gemini's structured forensic breakdown:
    * Anti-Spoofing: Verified Real Outdoor Hazard
    * Classification: `OPEN_MUNICIPAL_WASTE_BURNING`
    * Optical Smoke Opacity: `0.88 (Severe)`
    * Statutory Bylaw Action: *Deploy Water Sprinkler Tanker and Issue Bylaw Fine*.
* **Speaker:**
  > *"Watch this in real-time. A citizen or sanitation worker snaps a photo of an active roadside fire. Our backend routes this to Gemini 3.5 Flash-Lite using a strict structured JSON schema. Notice the anti-spoofing verification — any indoor photo or screenshot is instantly rejected. Gemini extracts the optical opacity score, classifies the emission into one of six statutory categories, and automatically drafts an administrative enforcement order under municipal bylaws."*

---

### [2:05 - 2:50] Scene 4: Physics-Constrained Gaussian Dispersion Modeling
* **Visual:**
  * Transition to the **ULB Executive Command Desk** map interface.
  * Point of origin appears with a glowing red hazard marker.
  * Show the live weather telemetry panel pulling real-time wind speed and bearing from Open-Meteo (`14.2 km/h at 285°`).
  * Watch the dynamic vector cone draw itself downwind over the map in real time.
  * Zoom in on two highlighted infrastructure markers inside the cone:
    * `Government Senior Secondary School Ward 12 (Arrival: 11 mins)`
    * `Sanjay Community Healthcare Center (Arrival: 15 mins)`.
* **Speaker:**
  > *"Now comes the physics. VayuGrid immediately fetches live meteorological vectors from Open-Meteo. Our Gaussian dispersion engine calculates the plume's advection trajectory and projects a dynamic exposure cone downwind. Through automated spatial intersection, the system flags that a government school is 1.6 kilometers downwind, with toxic particulate matter scheduled to arrive in just 11 minutes. What used to take hours of manual inspection now happens in milliseconds."*

---

### [2:50 - 3:30] Scene 5: Dual Dispatch & Vernacular Audio Resilience
* **Visual:**
  * Click the red action button on the municipal card: *"Dispatch Smog Gun Truck #04"*. The ticket status flips to `DISPATCHED` with confirmation badge.
  * Scroll to the **Vernacular Resilience Audio Node**.
  * Click the language selector tabs (**English, Hindi, Telugu, Kannada, Tamil, Malayalam**).
  * Click the Play Audio button on **Hindi**:
    * Audio speaks clearly: *"आस-पास घना जहरीला धुआं देखा गया है... हवा के बहाव वाले क्षेत्र के स्कूलों और बुजुर्गों से अनुरोध है कि वे खिड़कियां बंद रखें..."*
  * Click the Play Audio button on **Kannada**:
    * Audio speaks clearly: *"ಹತ್ತಿರದಲ್ಲಿ ದಟ್ಟವಾದ ವಿಷಕಾರಿ ಹೊಗೆ ಪತ್ತೆಯಾಗಿದೆ..."*
* **Speaker:**
  > *"VayuGrid delivers a dual dispatch. On the municipal side, the officer dispatches a mist cannon truck with pre-routed GPS coordinates with one click. On the citizen side, we break the literacy barrier. Our Google translation and speech pipeline synthesizes localized voice alerts across six Indian languages — English, Hindi, Telugu, Kannada, Tamil, and Malayalam — ensuring street vendors and school staff get life-saving advisories in their mother tongue."*

---

### [3:30 - 4:00] Scene 6: Multi-City Scalability & Conclusion
* **Visual:**
  * Click the City Selector dropdown: Switch from **Delhi-NCR** to **Bengaluru (BBMP)**, then to **Kanpur Industrial Belt**, and **Punjab Agrarian Belt**.
  * The map smoothly pans, loading regional incidents and localized ambient layers.
  * Final slide showing GitHub repository link, live deployment URL, and team credits.
* **Speaker:**
  > *"VayuGrid is not limited to one city. Whether it is construction dust along Bengaluru's Outer Ring Road, tannery stacks in Kanpur, or seasonal stubble burning in Punjab, the platform scales immediately with zero initial capex for all 700+ Indian districts. This is how we use Google AI to build resilience for communities. Thank you."*
