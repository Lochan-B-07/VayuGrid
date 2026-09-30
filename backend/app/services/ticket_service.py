"""
VayuGrid Incident & Ticketing Service
Provides thread-safe in-memory and SQLite incident persistence, statutory ticket generation,
strict lifecycle state machine transitions, and pre-seeded demonstration data
for Indian regional archetypes (Delhi-NCR, Bengaluru, Kanpur, Mumbai, Punjab).
"""

import uuid
import json
import sqlite3
import logging
import threading
from datetime import datetime, timezone
from typing import List, Optional, Dict

from app.models.incident import (
    IncidentStatusEnum,
    VALID_STATE_TRANSITIONS,
    CoordinatesModel,
    IncidentVerificationDetails,
    MeteorologySummary,
    MunicipalActionRequest,
    MunicipalActionResponse,
    ResolveIncidentRequest,
    ResolveIncidentResponse,
    IncidentRecord,
)

logger = logging.getLogger("vayugrid.ticket_service")


class TicketService:
    """
    Statutory incident lifecycle and dispatch management service.
    Guarantees thread-safe in-memory operations backed by optional SQLite persistence
    with pre-seeded Indian regional city archetypes.
    """

    def __init__(self, db_path: Optional[str] = None, seed_defaults: bool = True):
        self._lock = threading.RLock()
        self._store: Dict[str, IncidentRecord] = {}
        self._db_path = db_path

        if self._db_path:
            self._init_sqlite()

        if seed_defaults and not self._store:
            self._seed_archetypes()

    def _init_sqlite(self) -> None:
        """Initializes SQLite persistence table and loads existing tickets."""
        try:
            with sqlite3.connect(self._db_path) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    """
                    CREATE TABLE IF NOT EXISTS incidents (
                        ticket_id TEXT PRIMARY KEY,
                        status TEXT NOT NULL,
                        city_id TEXT,
                        created_at TEXT NOT NULL,
                        updated_at TEXT NOT NULL,
                        data_json TEXT NOT NULL
                    );
                    """
                )
                cursor.execute("SELECT data_json FROM incidents;")
                rows = cursor.fetchall()
                for (data_json,) in rows:
                    data = json.loads(data_json)
                    record = IncidentRecord.model_validate(data)
                    self._store[record.ticket_id] = record
                if rows:
                    logger.info(f"Loaded {len(rows)} incidents from SQLite database '{self._db_path}'.")
        except Exception as exc:
            logger.warning(f"SQLite initialization failed ({exc}). Operating in-memory only.")

    def _persist_sqlite(self, record: IncidentRecord) -> None:
        """Writes or updates an incident record in SQLite."""
        if not self._db_path:
            return
        try:
            with sqlite3.connect(self._db_path) as conn:
                cursor = conn.cursor()
                status_str = record.status.value if hasattr(record.status, "value") else str(record.status)
                cursor.execute(
                    """
                    INSERT OR REPLACE INTO incidents
                    (ticket_id, status, city_id, created_at, updated_at, data_json)
                    VALUES (?, ?, ?, ?, ?, ?);
                    """,
                    (
                        record.ticket_id,
                        status_str,
                        record.city_id,
                        record.created_at,
                        record.updated_at,
                        json.dumps(record.model_dump()),
                    ),
                )
                conn.commit()
        except Exception as exc:
            logger.warning(f"Failed to persist ticket {record.ticket_id} to SQLite: {exc}")

    @staticmethod
    def generate_ticket_id(
        city_id: Optional[str] = None,
        latitude: float = 28.6139,
        longitude: float = 77.2090,
    ) -> str:
        """
        Generates a unique statutory ticket identifier.
        Format: VAYU-{CITY_3}-{LAT_TAG}-{LON_TAG}-{HASH_4}
        Example: VAYU-DEL-2861-7720-A4F9
        """
        city_tag = "DEL"
        if city_id:
            slug = city_id.lower().replace("-", "_")
            if "bengaluru" in slug or "blr" in slug:
                city_tag = "BLR"
            elif "kanpur" in slug or "knp" in slug:
                city_tag = "KNP"
            elif "mumbai" in slug or "bom" in slug:
                city_tag = "BOM"
            elif "punjab" in slug or "pb" in slug:
                city_tag = "PJB"
            else:
                city_tag = (city_id[:3] or "IND").upper()

        lat_tag = f"{int(abs(latitude) * 100):04d}"
        lon_tag = f"{int(abs(longitude) * 100):04d}"
        rand_suffix = uuid.uuid4().hex[:4].upper()
        return f"VAYU-{city_tag}-{lat_tag}-{lon_tag}-{rand_suffix}"

    def create_incident(self, record: IncidentRecord) -> IncidentRecord:
        """Stores a new incident record thread-safely with SQLite persistence."""
        with self._lock:
            self._store[record.ticket_id] = record
            self._persist_sqlite(record)
            return record

    def get_incident(self, ticket_id: str) -> Optional[IncidentRecord]:
        """Retrieves an incident record by ticket_id."""
        with self._lock:
            return self._store.get(ticket_id)

    def list_incidents(
        self,
        city_id: Optional[str] = None,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> List[IncidentRecord]:
        """Queries and filters incident records."""
        with self._lock:
            results = list(self._store.values())

        if city_id:
            target_city = city_id.lower().replace("-", "_")
            alias_map = {
                "delhi": "delhi_ncr",
                "delhi_ncr": "delhi",
            }
            results = [
                inc for inc in results
                if inc.city_id and (
                    inc.city_id.lower().replace("-", "_") == target_city
                    or inc.city_id.lower().replace("-", "_") == alias_map.get(target_city, "")
                )
            ]

        if status:
            target_status = status.upper()
            results = [
                inc for inc in results
                if inc.status.value == target_status or inc.status == target_status
            ]

        if priority:
            target_prio = priority.upper()
            filtered = []
            for inc in results:
                action = inc.verification.recommended_ulb_action
                if action and isinstance(action, dict):
                    if action.get("priority_level", "").upper() == target_prio:
                        filtered.append(inc)
            results = filtered

        # Sort newest first
        results.sort(key=lambda x: x.created_at, reverse=True)
        return results[offset : offset + limit]

    def transition_status(
        self,
        ticket_id: str,
        new_status: IncidentStatusEnum,
    ) -> IncidentRecord:
        """
        Transitions an incident lifecycle status validating statutory transition rules.
        Raises KeyError if ticket not found, ValueError if transition is invalid.
        """
        with self._lock:
            if ticket_id not in self._store:
                raise KeyError(f"Ticket '{ticket_id}' not found.")

            incident = self._store[ticket_id]
            current_status = incident.status

            if current_status == new_status:
                return incident

            allowed = VALID_STATE_TRANSITIONS.get(current_status, [])
            if new_status not in allowed:
                raise ValueError(
                    f"Illegal lifecycle transition: Cannot transition from {current_status.value} to {new_status.value}."
                )

            now_iso = datetime.now(timezone.utc).isoformat()
            incident.status = new_status
            incident.updated_at = now_iso
            self._persist_sqlite(incident)
            return incident

    def dispatch_action(
        self,
        ticket_id: str,
        action: MunicipalActionRequest,
    ) -> MunicipalActionResponse:
        """
        Deploys municipal mitigation assets and advances ticket status to DISPATCHED.
        """
        with self._lock:
            if ticket_id not in self._store:
                raise KeyError(f"Ticket '{ticket_id}' not found.")

            incident = self._store[ticket_id]
            if incident.status in [IncidentStatusEnum.RESOLVED, IncidentStatusEnum.REJECTED_SPOOF]:
                raise ValueError(
                    f"Cannot dispatch unit to closed ticket {ticket_id} (Status: {incident.status.value})."
                )

            now_iso = datetime.now(timezone.utc).isoformat()
            disp_code = f"DISP-{uuid.uuid4().hex[:6].upper()}"

            incident.status = IncidentStatusEnum.DISPATCHED
            incident.updated_at = now_iso
            incident.dispatch_details = {
                "action_type": action.action_type,
                "assigned_unit": action.assigned_unit,
                "operator_notes": action.operator_notes,
                "officer_badge_id": action.officer_badge_id,
                "dispatched_at": now_iso,
                "eta_minutes": 12,
                "confirmation_code": disp_code,
            }
            self._persist_sqlite(incident)

            return MunicipalActionResponse(
                ticket_id=ticket_id,
                status="DISPATCHED",
                action_timestamp=now_iso,
                eta_minutes=12,
                confirmation_code=disp_code,
            )

    def resolve_incident(
        self,
        ticket_id: str,
        resolution: ResolveIncidentRequest,
    ) -> ResolveIncidentResponse:
        """
        Marks an incident as RESOLVED and logs operational mitigation notes.
        """
        with self._lock:
            if ticket_id not in self._store:
                raise KeyError(f"Ticket '{ticket_id}' not found.")

            incident = self._store[ticket_id]
            if incident.status not in [IncidentStatusEnum.VERIFIED_HAZARD, IncidentStatusEnum.DISPATCHED]:
                raise ValueError(
                    f"Cannot resolve ticket {ticket_id} from current status {incident.status.value}."
                )

            now_iso = datetime.now(timezone.utc).isoformat()
            incident.status = IncidentStatusEnum.RESOLVED
            incident.updated_at = now_iso
            incident.resolution_details = {
                "resolved_at": now_iso,
                "resolved_by": resolution.officer_badge_id,
                "resolution_notes": resolution.resolution_notes,
                "mitigation_summary": resolution.mitigation_summary,
            }
            self._persist_sqlite(incident)

            return ResolveIncidentResponse(
                ticket_id=ticket_id,
                status="RESOLVED",
                resolved_at=now_iso,
                message=f"Incident {ticket_id} successfully resolved and archived.",
            )

    def reset_to_seeds(self) -> None:
        """Resets the store back to pre-seeded city archetypes."""
        with self._lock:
            self.clear()
            self._seed_archetypes()

    def clear(self) -> None:
        """Clears all records in the store and SQLite table."""
        with self._lock:
            self._store.clear()
            if self._db_path:
                try:
                    with sqlite3.connect(self._db_path) as conn:
                        conn.execute("DELETE FROM incidents;")
                        conn.commit()
                except Exception as exc:
                    logger.warning(f"Error clearing SQLite incidents: {exc}")

    def _seed_archetypes(self) -> None:
        """Seeds initial realistic incidents across 5 flagship Indian cities."""
        # 1. Delhi-NCR (Ghazipur Landfill Open Waste Burning)
        delhi_inc = IncidentRecord(
            ticket_id="VAYU-DEL-2861-7720-A4F9",
            status=IncidentStatusEnum.VERIFIED_HAZARD,
            created_at="2026-09-30T10:00:00Z",
            updated_at="2026-09-30T10:00:00Z",
            reported_by="CPCB_PATROL_DELHI",
            city_id="delhi_ncr",
            coordinates=CoordinatesModel(
                latitude=28.6139,
                longitude=77.2090,
                address_hint="Ghazipur Landfill Perimeter, East Delhi",
            ),
            verification=IncidentVerificationDetails(
                is_valid_environmental_hazard=True,
                source_classification="OPEN_MUNICIPAL_WASTE_BURNING",
                severity_score=0.88,
                confidence_score=0.95,
                optical_smoke_opacity=0.90,
                estimated_plume_spread_radius_meters=2450,
                detected_visual_markers=[
                    "Dense toxic particulate plume (Open Municipal Waste Burning)",
                    "Calculated effective emission rate: 52.4 g/s",
                    "Briggs effective plume rise: 18.4m",
                ],
                recommended_ulb_action={
                    "intervention_type": "Deploy Water Sprinkler Tanker and Smog Mist Canon",
                    "target_department": "Municipal Solid Waste Enforcement / East Delhi Municipal Corp",
                    "priority_level": "CRITICAL",
                },
                summary_assessment=(
                    "Severe open municipal refuse burning adjacent to residential "
                    "settlement with active downwind advection."
                ),
            ),
            meteorology=MeteorologySummary(
                wind_speed_kmh=14.5,
                wind_speed_ms=4.03,
                wind_direction_deg=285.0,
                downwind_bearing_deg=105.0,
                temperature_c=29.5,
                humidity_pct=56.0,
                planetary_boundary_layer_height_m=480.0,
                stability_class="C",
            ),
            downwind_exposure_cone={
                "bearing_degrees": 105.0,
                "max_reach_km": 2.45,
                "angular_spread_deg": 38.2,
                "boundary_polygon": [
                    {"lat": 28.6139, "lon": 77.2090},
                    {"lat": 28.6085, "lon": 77.2280},
                    {"lat": 28.6010, "lon": 77.2340},
                    {"lat": 28.5940, "lon": 77.2260},
                    {"lat": 28.6139, "lon": 77.2090},
                ],
            },
            vernacular_advisories={
                "en": "Dense toxic smoke detected from municipal waste burning. Vulnerable groups stay indoors.",
                "hi": "नगर निगम कचरा जलने से घना जहरीला धुआं देखा गया है। कमजोर लोग और बच्चे घर के अंदर रहें।",
                "te": "మునిసిపల్ వ్యర్థాల దహనం నుండి విష పొగ కనుగొనబడింది. వృద్ధులు మరియు పిల్లలు ఇళ్లలోనే ఉండండి.",
                "kn": "ತ್ಯಾಜ್ಯ ಸುಡುವಿಕೆಯಿಂದ ವಿಷಕಾರಿ ಹೊಗೆ ಪತ್ತೆಯಾಗಿದೆ. ಹಿರಿಯರು ಮತ್ತು ಮಕ್ಕಳು ಮನೆಯೊಳಗೆ ಇರಿ.",
                "ta": "கழிவு எரிப்பிலிருந்து அடர்ந்த நச்சுப் புகை கண்டறியப்பட்டுள்ளது. வீட்டிற்குள் இருக்கவும்.",
                "ml": "മാലിന്യം കത്തുന്നതിൽ നിന്ന് കനത്ത വിഷപ്പുക കണ്ടെത്തി. വീടിനുള്ളിൽ തന്നെ തുടരുക.",
            },
            impacted_infrastructure=[
                {
                    "id": "DEL-EDU-01",
                    "name": "Government Senior Secondary School Ward 12",
                    "category": "EDUCATION_FACILITY",
                    "lat": 28.6185,
                    "lon": 77.2280,
                    "distance_meters": 1850.2,
                    "estimated_arrival_minutes": 8,
                    "modeled_concentration_ug_m3": 148.5,
                    "hazard_level": "SEVERE",
                }
            ],
        )

        # 2. Bengaluru (Outer Ring Road Construction Dust)
        blr_inc = IncidentRecord(
            ticket_id="VAYU-BLR-1297-7759-C102",
            status=IncidentStatusEnum.DISPATCHED,
            created_at="2026-09-30T09:30:00Z",
            updated_at="2026-09-30T09:45:00Z",
            reported_by="BBMP_CITIZEN_PWA",
            city_id="bengaluru",
            coordinates=CoordinatesModel(
                latitude=12.9716,
                longitude=77.5946,
                address_hint="Outer Ring Road Bellandur Flyover Construction Corridor",
            ),
            verification=IncidentVerificationDetails(
                is_valid_environmental_hazard=True,
                source_classification="CONSTRUCTION_DEMOLITION_DUST",
                severity_score=0.76,
                confidence_score=0.92,
                optical_smoke_opacity=0.70,
                estimated_plume_spread_radius_meters=1800,
                detected_visual_markers=[
                    "Unsuppressed dry particulate suspension",
                    "Transit dust cloud crossing arterial roadway",
                ],
                recommended_ulb_action={
                    "intervention_type": "Issue Stop-Work Notice and Deploy High-Pressure Water Cannon",
                    "target_department": "Bruhat Bengaluru Mahanagara Palike (BBMP) Environmental Cell",
                    "priority_level": "HIGH",
                },
                summary_assessment="High particulate dust suspension from flyover excavation.",
            ),
            meteorology=MeteorologySummary(
                wind_speed_kmh=18.0,
                wind_speed_ms=5.0,
                wind_direction_deg=240.0,
                downwind_bearing_deg=60.0,
                temperature_c=27.0,
                humidity_pct=65.0,
                planetary_boundary_layer_height_m=750.0,
                stability_class="B",
            ),
            dispatch_details={
                "action_type": "WATER_SPRINKLER",
                "assigned_unit": "BBMP_MIST_SPRINKLER_09",
                "operator_notes": "Dispatched water mist truck to Bellandur ORR stretch.",
                "officer_badge_id": "BBMP-ENF-4412",
                "dispatched_at": "2026-09-30T09:45:00Z",
                "eta_minutes": 10,
                "confirmation_code": "DISP-B4412A",
            },
            vernacular_advisories={
                "en": "Heavy construction dust plume detected along Outer Ring Road. Commuters should wear N95 masks.",
                "hi": "आउटर रिंग रोड पर निर्माण कार्य की भारी धूल देखी गई है। यात्री मास्क पहनें।",
                "te": "ఔటర్ రింగ్ రోడ్డులో భారీ నిర్మాణ ధూళి కనిపించింది. ప్రయాణికులు మాస్క్ ధరించాలి.",
                "kn": "ಔಟರ್ ರಿಂಗ್ ರೋಡ್‌ನಲ್ಲಿ ಭಾರಿ ನಿರ್ಮಾಣ ಧೂಳು ಪತ್ತೆಯಾಗಿದೆ. ಪ್ರಯಾಣಿಕರು ಮಾಸ್ಕ್ ಧರಿಸಬೇಕು.",
                "ta": "வெளிவட்டச் சாலையில் கடுமையான கட்டுமான தூசு கண்டறியப்பட்டுள்ளது.",
                "ml": "ഔട്ടർ റിംഗ് റോഡിൽ കനത്ത നിർമ്മാണ പൊടി കണ്ടെത്തി. യാത്രക്കാർ മാസ്ക് ധരിക്കുക.",
            },
        )

        # 3. Kanpur (Jajmau Industrial Stack Emissions)
        knp_inc = IncidentRecord(
            ticket_id="VAYU-KNP-2644-8033-E781",
            status=IncidentStatusEnum.VERIFIED_HAZARD,
            created_at="2026-09-30T10:15:00Z",
            updated_at="2026-09-30T10:15:00Z",
            reported_by="UPPCB_SENSOR_ARRAY",
            city_id="kanpur",
            coordinates=CoordinatesModel(
                latitude=26.4499,
                longitude=80.3319,
                address_hint="Jajmau Industrial Cluster, Ganges South Bank",
            ),
            verification=IncidentVerificationDetails(
                is_valid_environmental_hazard=True,
                source_classification="INDUSTRIAL_STACK_EMISSION",
                severity_score=0.91,
                confidence_score=0.96,
                optical_smoke_opacity=0.95,
                estimated_plume_spread_radius_meters=3200,
                detected_visual_markers=[
                    "High-temperature black effluent plume",
                    "Non-compliant industrial boiler combustion",
                ],
                recommended_ulb_action={
                    "intervention_type": "Execute Section 133 EP Act Immediate Cessation Notice",
                    "target_department": "Uttar Pradesh Pollution Control Board (UPPCB)",
                    "priority_level": "CRITICAL",
                },
                summary_assessment="Dense industrial stack plume advecting towards residential clusters in Kanpur South.",
            ),
            meteorology=MeteorologySummary(
                wind_speed_kmh=11.2,
                wind_speed_ms=3.11,
                wind_direction_deg=310.0,
                downwind_bearing_deg=130.0,
                temperature_c=31.2,
                humidity_pct=48.0,
                planetary_boundary_layer_height_m=350.0,
                stability_class="D",
            ),
            vernacular_advisories={
                "en": "Industrial emission detected in Jajmau corridor. Stay indoors and avoid outdoor physical exercise.",
                "hi": "जाजमऊ क्षेत्र में जहरीला उत्सर्जन देखा गया है। घर के अंदर रहें और व्यायाम से बचें।",
                "te": "జాజ్మౌ పారిశ్రామిక ప్రాంతంలో రసాయన పొగ గుర్తించబడింది. బయట తిరగవద్దు.",
                "kn": "ಜಾಜ್ಮೌ ಕೈಗಾರಿಕಾ ಪ್ರದೇಶದಲ್ಲಿ ಹೊಗೆ ಪತ್ತೆಯಾಗಿದೆ. ಹೊರಾಂಗಣ ಚಟುವಟಿಕೆಗಳನ್ನು ತಪ್ಪಿಸಿ.",
                "ta": "ஜாஜ்மவு தொழிற்பேட்டையில் நச்சு வாயு வெளியேற்றம் கண்டறியப்பட்டுள்ளது.",
                "ml": "ജാജ്മൗ വ്യവസായ മേഖലയിൽ കനത്ത പുക കണ്ടെത്തി. പുറത്തിറങ്ങുന്നത് ഒഴിവാക്കുക.",
            },
        )

        # 4. Mumbai (Deonar Smoldering Waste Refuse)
        bom_inc = IncidentRecord(
            ticket_id="VAYU-BOM-1907-7287-B229",
            status=IncidentStatusEnum.VERIFIED_HAZARD,
            created_at="2026-09-30T08:50:00Z",
            updated_at="2026-09-30T08:50:00Z",
            reported_by="BMC_DRONE_SURVEILLANCE",
            city_id="mumbai",
            coordinates=CoordinatesModel(
                latitude=19.0760,
                longitude=72.8777,
                address_hint="Deonar Waste Facility, Eastern Suburbs",
            ),
            verification=IncidentVerificationDetails(
                is_valid_environmental_hazard=True,
                source_classification="OPEN_MUNICIPAL_WASTE_BURNING",
                severity_score=0.82,
                confidence_score=0.91,
                optical_smoke_opacity=0.85,
                estimated_plume_spread_radius_meters=2100,
                detected_visual_markers=[
                    "Continuous sub-surface smoldering methane combustion",
                    "Marine boundary layer trapped ground smoke",
                ],
                recommended_ulb_action={
                    "intervention_type": "Deploy Fire Tender Soil Capping and Smog Mist Sprayers",
                    "target_department": "Brihanmumbai Municipal Corporation (BMC) Disaster Cell",
                    "priority_level": "CRITICAL",
                },
                summary_assessment="Sub-surface landfill combustion trapped under marine coastal inversion.",
            ),
            meteorology=MeteorologySummary(
                wind_speed_kmh=16.0,
                wind_speed_ms=4.44,
                wind_direction_deg=260.0,
                downwind_bearing_deg=80.0,
                temperature_c=32.0,
                humidity_pct=82.0,
                planetary_boundary_layer_height_m=520.0,
                stability_class="C",
            ),
            vernacular_advisories={
                "en": "Sub-surface smoke plume detected at Deonar. Chembur and Govandi residents keep windows closed.",
                "hi": "देवनार में कचरे का धुआं देखा गया है। चेंबूर और गोवंडी के निवासी खिड़कियां बंद रखें।",
                "te": "దేవనార్ వద్ద దట్టమైన పొగ వ్యాపించింది. కిటికీలు మూసివేయండి.",
                "kn": "ದೇವನಾರ್ ಕಸ ವಿಲೇವಾರಿ ಪ್ರದೇಶದಲ್ಲಿ ಹೊಗೆ ಹರಡಿದೆ. ಕಿಟಕಿಗಳನ್ನು ಮುಚ್ಚಿರಿ.",
                "ta": "தியோனாரில் புகை மூட்டம் காணப்படுகிறது. ஜன்னல்களை மூடி வைக்கவும்.",
                "ml": "ദിയോനാറിൽ മാലിന്യ പുക പടരുന്നു. ജനലുകൾ അടച്ചിടുക.",
            },
        )

        # 5. Punjab (Sangrur Agrarian Stubble Burning)
        pjb_inc = IncidentRecord(
            ticket_id="VAYU-PJB-3090-7585-F911",
            status=IncidentStatusEnum.REPORTED,
            created_at="2026-09-30T10:20:00Z",
            updated_at="2026-09-30T10:20:00Z",
            reported_by="SENTINEL_THERMAL_ALERT",
            city_id="punjab",
            coordinates=CoordinatesModel(
                latitude=30.9010,
                longitude=75.8573,
                address_hint="Sangrur Agrarian Belt, GT Road Corridor",
            ),
            verification=IncidentVerificationDetails(
                is_valid_environmental_hazard=True,
                source_classification="BIOMASS_STUBBLE_BURNING",
                severity_score=0.89,
                confidence_score=0.94,
                optical_smoke_opacity=0.92,
                estimated_plume_spread_radius_meters=4500,
                detected_visual_markers=[
                    "Widespread paddy stubble burning in open agrarian plot",
                    "Rapid horizontal advection downwind towards National Highway",
                ],
                recommended_ulb_action={
                    "intervention_type": "Deploy District Flying Squad and Agricultural Mulching Team",
                    "target_department": "Punjab Pollution Control Board & District Magistrate Flying Squad",
                    "priority_level": "HIGH",
                },
                summary_assessment="Open field stubble burning causing zero-visibility fog/smog hazard on GT Road.",
            ),
            meteorology=MeteorologySummary(
                wind_speed_kmh=12.0,
                wind_speed_ms=3.33,
                wind_direction_deg=315.0,
                downwind_bearing_deg=135.0,
                temperature_c=25.0,
                humidity_pct=60.0,
                planetary_boundary_layer_height_m=400.0,
                stability_class="C",
            ),
            vernacular_advisories={
                "en": "Agrarian stubble burning detected. High smog risk on GT Road. Motorists drive with low beams.",
                "hi": "खेतों में पराली जलाने का धुआं फैला है। जीटी रोड पर विजिबिलिटी कम है, वाहन धीमी गति से चलाएं।",
                "te": "పొలాల్లో వ్యర్థాలు తగలబెట్టడం వల్ల పొగ వ్యాపించింది. వాహనాలు నెమ్మదిగా నడపండి.",
                "kn": "ಹೊಲಗಳಲ್ಲಿ ಕೃಷಿ ತ್ಯಾಜ್ಯ ಸುಡುವಿಕೆ ಪತ್ತೆಯಾಗಿದೆ. ವಾಹನಗಳನ್ನು ನಿಧಾನವಾಗಿ ಚಲಾಯಿಸಿ.",
                "ta": "விவசாயக் கழிவுகள் எரிக்கப்படுவதால் புகை மூட்டம் ஏற்பட்டுள்ளது.",
                "ml": "പാടങ്ങളിൽ വൈക്കോൽ കത്തിക്കുന്ന പുക പടരുന്നു. ജാഗ്രത പാലിക്കുക.",
            },
        )

        for inc in [delhi_inc, blr_inc, knp_inc, bom_inc, pjb_inc]:
            self._store[inc.ticket_id] = inc
            self._persist_sqlite(inc)


# Global singleton service instance
ticket_service = TicketService()
