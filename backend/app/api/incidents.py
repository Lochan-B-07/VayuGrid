"""
VayuGrid Incident Audit, Lifecycle & ULB Dispatch API Routes.
Orchestrates:
1. Multimodal AI Forensics (Gemini Flash) with Anti-Spoofing & Opacity Detection.
2. Atmospheric Micrometeorology & Pasquill-Gifford Stability Ingestion.
3. Vectorized Gaussian Plume & Transient Lagrangian Puff Dispersion Physics.
4. Multilingual Public Health Emergency Advisories across 6 Indian Languages.
5. Statutory Incident Lifecycle Management, Dispatch Queue, and Municipal Work Orders.
"""

import logging
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Query, Body, status

from app.models.dispersion import (
    EmissionSourceType,
    SimulationParameters,
)
from app.models.incident import (
    IncidentStatusEnum,
    CoordinatesModel,
    IncidentVerificationDetails,
    MeteorologySummary,
    MunicipalActionRequest,
    MunicipalActionResponse,
    ResolveIncidentRequest,
    ResolveIncidentResponse,
    Base64AuditRequest,
    IncidentRecord,
)
from app.services.ticket_service import ticket_service
from app.services.dispersion_engine import DispersionEngine
from app.services.weather_service import WeatherService
from app.services.gemini_forensic import GeminiForensicService
from app.services.vernacular_service import VernacularService
from app.data.sensitive_infrastructure import get_candidate_receptors

logger = logging.getLogger("vayugrid.incidents")

router = APIRouter(prefix="/incidents", tags=["Incident Audit & ULB Dispatch"])

dispersion_engine = DispersionEngine()
weather_service = WeatherService()
gemini_forensic = GeminiForensicService()
vernacular_service = VernacularService()

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10MB

# Map forensic classification strings to dispersion emission physics
FORENSIC_TO_DISPERSION_MAP: Dict[str, EmissionSourceType] = {
    "OPEN_MUNICIPAL_WASTE_BURNING": EmissionSourceType.OPEN_MUNICIPAL_WASTE_BURNING,
    "CONSTRUCTION_DEMOLITION_DUST": EmissionSourceType.CONSTRUCTION_DUST_SUSPENSION,
    "INDUSTRIAL_STACK_EMISSION": EmissionSourceType.INDUSTRIAL_STACK_EMISSION,
    "BIOMASS_STUBBLE_BURNING": EmissionSourceType.AGRICULTURAL_BIOMASS_BURNING,
    "HIGH_DENSITY_VEHICULAR_IDLING": EmissionSourceType.TRAFFIC_CORRIDOR_EXHAUST,
    "UNPAVED_ROAD_SUSPENSION": EmissionSourceType.ROAD_RESUSPENSION,
}


async def _execute_audit_pipeline(
    image_bytes: Optional[bytes],
    mime_type: str,
    latitude: float,
    longitude: float,
    city_id: Optional[str],
    reported_by: str,
    compass_heading_deg: Optional[float] = None,
) -> Dict[str, Any]:
    """Internal core orchestrator executing the full audit pipeline."""
    city_slug = city_id.lower().replace("-", "_") if city_id else None

    # 1. Forensic Audit (Live Gemini Flash or Statutory Heuristic Fallback)
    if image_bytes:
        audit_result = gemini_forensic.audit_image(
            image_data=image_bytes,
            mime_type=mime_type,
            latitude=latitude,
            longitude=longitude,
            city_hint=city_slug,
            reported_by=reported_by,
        )
    else:
        # Headless audit: generate resilient statutory fallback
        audit_result = gemini_forensic._generate_resilient_fallback(
            pil_image=None,
            city_hint=city_slug,
            latitude=latitude,
            longitude=longitude,
        )

    # 2. Check Anti-Spoofing / Hazard Validity
    if audit_result.source_classification is not None:
        source_class_str = (
            audit_result.source_classification.value
            if hasattr(audit_result.source_classification, "value")
            else str(audit_result.source_classification)
        )
    elif not audit_result.is_valid_environmental_hazard:
        rej = (audit_result.rejection_reason or "").lower()
        if "clean" in rej or "no_hazard" in rej or "no air pollution" in rej:
            source_class_str = "NO_HAZARD_DETECTED"
        else:
            source_class_str = "ANTI_SPOOF_REJECTED"
    else:
        source_class_str = "OPEN_MUNICIPAL_WASTE_BURNING"

    dispersion_source_type = FORENSIC_TO_DISPERSION_MAP.get(
        source_class_str, EmissionSourceType.OPEN_MUNICIPAL_WASTE_BURNING
    )

    ticket_id = ticket_service.generate_ticket_id(
        city_id=city_slug,
        latitude=latitude,
        longitude=longitude,
    )

    # If image is rejected by anti-spoofing
    if not audit_result.is_valid_environmental_hazard:
        rejected_record = IncidentRecord(
            ticket_id=ticket_id,
            status=IncidentStatusEnum.REJECTED_SPOOF,
            reported_by=reported_by,
            city_id=city_slug,
            coordinates=CoordinatesModel(
                latitude=latitude,
                longitude=longitude,
                address_hint=f"Coordinates ({latitude:.4f}, {longitude:.4f})",
            ),
            verification=IncidentVerificationDetails(
                is_valid_environmental_hazard=False,
                rejection_reason=audit_result.rejection_reason or "Image failed anti-spoofing verification.",
                source_classification=source_class_str,
                severity_score=audit_result.severity_score,
                confidence_score=audit_result.confidence_score,
                optical_smoke_opacity=audit_result.optical_smoke_opacity,
                estimated_plume_spread_radius_meters=audit_result.estimated_plume_spread_radius_meters,
                detected_visual_markers=audit_result.detected_visual_markers,
            ),
        )
        ticket_service.create_incident(rejected_record)
        d = rejected_record.model_dump()
        d["is_valid"] = False
        d["rejection_reason"] = rejected_record.verification.rejection_reason
        d["timestamp"] = rejected_record.created_at
        d["classification"] = source_class_str
        d["severity_score"] = audit_result.severity_score
        d["confidence"] = audit_result.confidence_score
        d["location"] = {
            "lat": latitude,
            "lng": longitude,
            "address_hint": rejected_record.coordinates.address_hint,
        }
        return d

    # 3. Ingest Live Meteorology from Open-Meteo with regional fallback
    weather = await weather_service.get_live_weather(
        lat=latitude,
        lon=longitude,
        city_id=city_slug,
    )

    # 4. Sensitive Infrastructure Candidate Receptors
    candidates = get_candidate_receptors(
        origin_lat=latitude,
        origin_lon=longitude,
        max_search_radius_km=15.0,
        city_id=city_slug,
    )

    # 5. Run Vectorized Gaussian Plume + Transient Puff Physics Engine
    severity = max(0.1, min(1.0, audit_result.severity_score))
    opacity = max(0.0, min(1.0, audit_result.optical_smoke_opacity or 0.85))
    radius_m = float(max(5.0, min(2000.0, float(audit_result.estimated_plume_spread_radius_meters or 25.0))))

    sim_params = SimulationParameters(
        origin_lat=latitude,
        origin_lon=longitude,
        source_type=dispersion_source_type,
        severity_score=severity,
        smoke_opacity=opacity,
        origin_radius_meters=radius_m,
        simulation_duration_minutes=60,
    )

    sim_result = dispersion_engine.run_simulation(
        params=sim_params,
        weather=weather,
        candidate_receptors=candidates,
    )

    # 6. Synthesize Vernacular Emergency Public Advisories across 6 Indian Languages
    city_display_name = (city_slug or "Delhi-NCR").replace("_", " ").title()
    advisories = vernacular_service.generate_advisories(
        source_classification=source_class_str,
        severity_score=severity,
        city_name=city_display_name,
        detected_markers=audit_result.detected_visual_markers,
    )

    # 7. Assemble Statutory Incident Record
    recommended_action_dict = (
        audit_result.recommended_ulb_action.model_dump()
        if hasattr(audit_result.recommended_ulb_action, "model_dump")
        else audit_result.recommended_ulb_action
    )

    record = IncidentRecord(
        ticket_id=ticket_id,
        status=IncidentStatusEnum.VERIFIED_HAZARD,
        reported_by=reported_by,
        city_id=city_slug,
        coordinates=CoordinatesModel(
            latitude=latitude,
            longitude=longitude,
            address_hint=f"Coordinates ({latitude:.4f}, {longitude:.4f})",
        ),
        verification=IncidentVerificationDetails(
            is_valid_environmental_hazard=True,
            source_classification=source_class_str,
            severity_score=severity,
            confidence_score=audit_result.confidence_score,
            optical_smoke_opacity=opacity,
            estimated_plume_spread_radius_meters=int(radius_m),
            detected_visual_markers=audit_result.detected_visual_markers,
            recommended_ulb_action=recommended_action_dict,
            summary_assessment=audit_result.summary_assessment,
        ),
        meteorology=MeteorologySummary(
            wind_speed_kmh=weather.wind_speed_kmh,
            wind_speed_ms=weather.wind_speed_ms,
            wind_direction_deg=weather.wind_direction_deg,
            downwind_bearing_deg=weather.downwind_bearing_deg,
            temperature_c=weather.temperature_c,
            humidity_pct=weather.humidity_pct,
            planetary_boundary_layer_height_m=weather.planetary_boundary_layer_height_m,
            stability_class=weather.stability_class.value,
        ),
        downwind_exposure_cone=sim_result.downwind_exposure_cone.model_dump(),
        physics_simulation=sim_result.model_dump(),
        impacted_infrastructure=[r.model_dump() for r in sim_result.impacted_infrastructure],
        vernacular_advisories=advisories.model_dump(),
    )

    # Persist in TicketService
    ticket_service.create_incident(record)
    res_dict = record.model_dump()
    res_dict["timestamp"] = record.created_at
    res_dict["classification"] = record.verification.source_classification
    res_dict["severity_score"] = record.verification.severity_score
    res_dict["confidence"] = record.verification.confidence_score
    res_dict["visual_markers"] = record.verification.detected_visual_markers
    res_dict["is_valid"] = record.verification.is_valid_environmental_hazard
    res_dict["rejection_reason"] = record.verification.rejection_reason
    res_dict["location"] = {
        "lat": latitude,
        "lng": longitude,
        "address_hint": record.coordinates.address_hint,
    }
    return res_dict


@router.post(
    "/audit",
    summary="Audit environmental hazard image (multipart/form-data) and compute physical dispersion",
    response_model=Dict[str, Any],
)
async def audit_incident_multipart(
    image: Optional[UploadFile] = File(None, description="Hazard photograph (JPEG/PNG/WebP, max 10MB)"),
    latitude: float = Form(..., ge=-90.0, le=90.0),
    longitude: float = Form(..., ge=-180.0, le=180.0),
    city_id: Optional[str] = Form(None),
    reported_by: Optional[str] = Form("FIELD_TELEMETRY"),
    compass_heading_deg: Optional[float] = Form(None),
):
    """
    Core multipart audit endpoint:
    1. Validates file MIME type and max 10MB bounds.
    2. Runs Gemini Flash Multimodal Forensic Audit with Anti-Spoofing.
    3. Fetches live boundary layer height and wind vectors from Open-Meteo.
    4. Computes Briggs plume rise, Irwin shear, and Pasquill-Gifford dispersion.
    5. Calculates sensitive receptor intersections (schools, hospitals, informal settlements).
    6. Synthesizes multilingual public alerts in 6 languages.
    7. Creates statutory ticket and registers in ULB dispatch queue.
    """
    image_bytes = None
    mime_type = "image/jpeg"

    if image is not None and image.filename:
        # Validate content type
        content_type = (image.content_type or "").lower()
        if content_type and content_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file format '{content_type}'. Allowed: JPEG, PNG, WebP.",
            )
        mime_type = content_type or "image/jpeg"

        # Read and check size
        image_bytes = await image.read()
        if len(image_bytes) > MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File size exceeds the statutory 10MB limit.",
            )

    try:
        return await _execute_audit_pipeline(
            image_bytes=image_bytes,
            mime_type=mime_type,
            latitude=latitude,
            longitude=longitude,
            city_id=city_id,
            reported_by=reported_by or "FIELD_TELEMETRY",
            compass_heading_deg=compass_heading_deg,
        )
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Incident audit pipeline failed: {str(exc)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Incident audit failure: {str(exc)}",
        )


@router.post(
    "/audit/json",
    summary="Audit environmental hazard via Base64 JSON payload",
    response_model=Dict[str, Any],
)
async def audit_incident_json(payload: Base64AuditRequest = Body(...)):
    """
    JSON ingestion endpoint accepting Base64-encoded imagery or headless sensor coordinates.
    """
    image_bytes = None
    mime_type = "image/jpeg"

    if payload.image_base64:
        import base64
        raw_b64 = payload.image_base64
        if "," in raw_b64:
            header, raw_b64 = raw_b64.split(",", 1)
            if "png" in header:
                mime_type = "image/png"
            elif "webp" in header:
                mime_type = "image/webp"

        try:
            image_bytes = base64.b64decode(raw_b64)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid Base64 image payload.",
            )

        if len(image_bytes) > MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Decoded image payload exceeds 10MB limit.",
            )

    try:
        return await _execute_audit_pipeline(
            image_bytes=image_bytes,
            mime_type=mime_type,
            latitude=payload.latitude,
            longitude=payload.longitude,
            city_id=payload.city_id,
            reported_by=payload.reported_by or "FIELD_TELEMETRY",
            compass_heading_deg=payload.compass_heading_deg,
        )
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"JSON incident audit failure: {str(exc)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"JSON incident audit failure: {str(exc)}",
        )


@router.get(
    "/active",
    response_model=List[Dict[str, Any]],
    summary="Retrieve active hazard incidents with city, status, and priority filters",
)
async def get_active_incidents(
    city_id: Optional[str] = Query(None, description="Optional city filter (e.g. 'delhi_ncr')"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status (e.g. 'VERIFIED_HAZARD', 'DISPATCHED')"),
    priority: Optional[str] = Query(None, description="Filter by priority ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    """
    Returns active environmental hazard tickets.
    Includes pre-seeded flagship regional archetypes across Delhi-NCR, Bengaluru, Kanpur, Mumbai, and Punjab.
    """
    incidents = ticket_service.list_incidents(
        city_id=city_id,
        status=status_filter,
        priority=priority,
        limit=limit,
        offset=offset,
    )
    results = []
    for inc in incidents:
        d = inc.model_dump()
        d["timestamp"] = inc.created_at
        d["classification"] = inc.verification.source_classification
        d["severity_score"] = inc.verification.severity_score
        d["confidence"] = inc.verification.confidence_score
        d["visual_markers"] = inc.verification.detected_visual_markers
        d["is_valid"] = inc.verification.is_valid_environmental_hazard
        d["rejection_reason"] = inc.verification.rejection_reason
        d["location"] = {
            "lat": inc.coordinates.latitude,
            "lng": inc.coordinates.longitude,
            "address_hint": inc.coordinates.address_hint,
        }
        results.append(d)
    return results


@router.get(
    "/{ticket_id}",
    response_model=Dict[str, Any],
    summary="Retrieve single incident ticket by statutory ID",
)
async def get_incident_by_id(ticket_id: str):
    """Fetches full incident dossier including dispersion contours and dispatch work orders."""
    incident = ticket_service.get_incident(ticket_id)
    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket '{ticket_id}' not found in registry.",
        )
    d = incident.model_dump()
    d["timestamp"] = incident.created_at
    d["classification"] = incident.verification.source_classification
    d["severity_score"] = incident.verification.severity_score
    d["confidence"] = incident.verification.confidence_score
    d["visual_markers"] = incident.verification.detected_visual_markers
    d["is_valid"] = incident.verification.is_valid_environmental_hazard
    d["rejection_reason"] = incident.verification.rejection_reason
    d["location"] = {
        "lat": incident.coordinates.latitude,
        "lng": incident.coordinates.longitude,
        "address_hint": incident.coordinates.address_hint,
    }
    return d


@router.post(
    "/{ticket_id}/action",
    response_model=MunicipalActionResponse,
    summary="Dispatch municipal mitigation asset for verified ticket",
)
async def dispatch_action(ticket_id: str, action: MunicipalActionRequest = Body(...)):
    """
    Dispatches ULB assets (water tanker, smog mist gun, enforcement patrol).
    Advances ticket lifecycle state to DISPATCHED.
    """
    try:
        return ticket_service.dispatch_action(ticket_id=ticket_id, action=action)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket '{ticket_id}' not found.",
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve),
        )


@router.post(
    "/{ticket_id}/resolve",
    response_model=ResolveIncidentResponse,
    summary="Mark incident as resolved upon mitigation completion",
)
async def resolve_incident(ticket_id: str, resolution: ResolveIncidentRequest = Body(...)):
    """
    Statutory incident closure by ULB officers upon site remediation.
    Advances ticket lifecycle state to RESOLVED.
    """
    try:
        return ticket_service.resolve_incident(ticket_id=ticket_id, resolution=resolution)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket '{ticket_id}' not found.",
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve),
        )
