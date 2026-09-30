"""
Tests for VayuGrid TicketService and statutory incident lifecycle state machine.
Validates:
- Ticket ID generation formats
- Thread-safe storage & querying
- Pre-seeded flagship city archetypes (Delhi-NCR, Bengaluru, Kanpur, Mumbai, Punjab)
- Legal and illegal state transitions
- Municipal mitigation unit dispatch
- Incident resolution workflow
"""

import pytest
from app.models.incident import (
    IncidentStatusEnum,
    CoordinatesModel,
    IncidentVerificationDetails,
    MunicipalActionRequest,
    ResolveIncidentRequest,
    IncidentRecord,
)
from app.services.ticket_service import TicketService


@pytest.fixture
def service():
    """Provides a fresh TicketService instance with pre-seeded data."""
    srv = TicketService(seed_defaults=True)
    return srv


def test_pre_seeded_incidents(service):
    """Verifies that all 5 Indian flagship archetypes are pre-seeded."""
    incidents = service.list_incidents()
    assert len(incidents) >= 5

    city_ids = [inc.city_id for inc in incidents]
    assert "delhi_ncr" in city_ids
    assert "bengaluru" in city_ids
    assert "kanpur" in city_ids
    assert "mumbai" in city_ids
    assert "punjab" in city_ids


def test_query_filter_by_city(service):
    """Tests filtering incidents by city identifier."""
    delhi_incidents = service.list_incidents(city_id="delhi_ncr")
    assert len(delhi_incidents) >= 1
    assert all(inc.city_id == "delhi_ncr" for inc in delhi_incidents)

    delhi_alias = service.list_incidents(city_id="delhi")
    assert len(delhi_alias) >= 1
    assert all(inc.city_id == "delhi_ncr" for inc in delhi_alias)

    blr_incidents = service.list_incidents(city_id="bengaluru")
    assert len(blr_incidents) >= 1
    assert all(inc.city_id == "bengaluru" for inc in blr_incidents)


def test_query_filter_by_status(service):
    """Tests filtering incidents by lifecycle status."""
    verified = service.list_incidents(status="VERIFIED_HAZARD")
    assert len(verified) >= 1
    assert all(inc.status == IncidentStatusEnum.VERIFIED_HAZARD for inc in verified)

    dispatched = service.list_incidents(status="DISPATCHED")
    assert len(dispatched) >= 1
    assert all(inc.status == IncidentStatusEnum.DISPATCHED for inc in dispatched)


def test_ticket_id_generation():
    """Validates the statutory ticket naming convention."""
    ticket_id = TicketService.generate_ticket_id("delhi_ncr", 28.6139, 77.2090)
    assert ticket_id.startswith("VAYU-DEL-2861-7720-")
    assert len(ticket_id.split("-")) == 5

    blr_ticket = TicketService.generate_ticket_id("bengaluru", 12.9716, 77.5946)
    assert blr_ticket.startswith("VAYU-BLR-1297-7759-")


def test_create_and_get_incident(service):
    """Tests creating a new incident and retrieving it."""
    ticket_id = TicketService.generate_ticket_id("delhi_ncr", 28.5355, 77.3910)
    record = IncidentRecord(
        ticket_id=ticket_id,
        status=IncidentStatusEnum.REPORTED,
        reported_by="CITIZEN_REPORTER_TEST",
        city_id="delhi_ncr",
        coordinates=CoordinatesModel(
            latitude=28.5355,
            longitude=77.3910,
            address_hint="Noida Sector 62",
        ),
        verification=IncidentVerificationDetails(
            is_valid_environmental_hazard=True,
            source_classification="OPEN_MUNICIPAL_WASTE_BURNING",
            severity_score=0.82,
            confidence_score=0.90,
            optical_smoke_opacity=0.80,
            estimated_plume_spread_radius_meters=1500,
        ),
    )

    created = service.create_incident(record)
    assert created.ticket_id == ticket_id

    fetched = service.get_incident(ticket_id)
    assert fetched is not None
    assert fetched.ticket_id == ticket_id
    assert fetched.status == IncidentStatusEnum.REPORTED


def test_lifecycle_legal_transitions(service):
    """Tests legal forward transitions through the lifecycle."""
    ticket_id = TicketService.generate_ticket_id("delhi_ncr", 28.5, 77.2)
    record = IncidentRecord(
        ticket_id=ticket_id,
        status=IncidentStatusEnum.REPORTED,
        reported_by="TEST_RUNNER",
        city_id="delhi_ncr",
        coordinates=CoordinatesModel(latitude=28.5, longitude=77.2),
        verification=IncidentVerificationDetails(
            is_valid_environmental_hazard=True,
            source_classification="CONSTRUCTION_DEMOLITION_DUST",
            severity_score=0.7,
            confidence_score=0.85,
        ),
    )
    service.create_incident(record)

    # 1. REPORTED -> PENDING_AUDIT
    step1 = service.transition_status(ticket_id, IncidentStatusEnum.PENDING_AUDIT)
    assert step1.status == IncidentStatusEnum.PENDING_AUDIT

    # 2. PENDING_AUDIT -> VERIFIED_HAZARD
    step2 = service.transition_status(ticket_id, IncidentStatusEnum.VERIFIED_HAZARD)
    assert step2.status == IncidentStatusEnum.VERIFIED_HAZARD

    # 3. VERIFIED_HAZARD -> DISPATCHED
    step3 = service.transition_status(ticket_id, IncidentStatusEnum.DISPATCHED)
    assert step3.status == IncidentStatusEnum.DISPATCHED

    # 4. DISPATCHED -> RESOLVED
    step4 = service.transition_status(ticket_id, IncidentStatusEnum.RESOLVED)
    assert step4.status == IncidentStatusEnum.RESOLVED


def test_lifecycle_illegal_transitions(service):
    """Tests that invalid transitions raise ValueError."""
    ticket_id = "VAYU-DEL-2861-7720-A4F9"  # Currently VERIFIED_HAZARD

    # Cannot transition backwards from VERIFIED_HAZARD to REPORTED
    with pytest.raises(ValueError, match="Illegal lifecycle transition"):
        service.transition_status(ticket_id, IncidentStatusEnum.REPORTED)

    # Cannot transition backwards from VERIFIED_HAZARD to PENDING_AUDIT
    with pytest.raises(ValueError, match="Illegal lifecycle transition"):
        service.transition_status(ticket_id, IncidentStatusEnum.PENDING_AUDIT)


def test_dispatch_action(service):
    """Tests deploying municipal mitigation assets."""
    ticket_id = "VAYU-DEL-2861-7720-A4F9"
    action = MunicipalActionRequest(
        action_type="DISPATCH_SMOG_GUN",
        assigned_unit="EAST_DELHI_SMOG_GUN_04",
        operator_notes="Dispatched to Ghazipur perimeter.",
        officer_badge_id="MCD-ENF-8821",
    )

    response = service.dispatch_action(ticket_id, action)
    assert response.ticket_id == ticket_id
    assert response.status == "DISPATCHED"
    assert response.eta_minutes == 12
    assert response.confirmation_code.startswith("DISP-")

    # Verify incident record updated
    incident = service.get_incident(ticket_id)
    assert incident.status == IncidentStatusEnum.DISPATCHED
    assert incident.dispatch_details is not None
    assert incident.dispatch_details["assigned_unit"] == "EAST_DELHI_SMOG_GUN_04"


def test_resolve_incident(service):
    """Tests resolving an incident."""
    ticket_id = "VAYU-BLR-1297-7759-C102"  # Currently DISPATCHED
    resolution = ResolveIncidentRequest(
        officer_badge_id="BBMP-ENF-4412",
        resolution_notes="Water mist applied. Particulate matter levels normalized.",
        mitigation_summary="Suppressed construction dust across 1.8km stretch.",
    )

    response = service.resolve_incident(ticket_id, resolution)
    assert response.ticket_id == ticket_id
    assert response.status == "RESOLVED"

    incident = service.get_incident(ticket_id)
    assert incident.status == IncidentStatusEnum.RESOLVED
    assert incident.resolution_details is not None
    assert incident.resolution_details["resolved_by"] == "BBMP-ENF-4412"


def test_cannot_dispatch_to_resolved_incident(service):
    """Verifies that an asset cannot be dispatched to an already resolved ticket."""
    ticket_id = "VAYU-BLR-1297-7759-C102"
    service.resolve_incident(
        ticket_id,
        ResolveIncidentRequest(
            officer_badge_id="OFFICER-01",
            resolution_notes="Closed.",
        ),
    )

    with pytest.raises(ValueError, match="Cannot dispatch unit to closed ticket"):
        service.dispatch_action(
            ticket_id,
            MunicipalActionRequest(
                action_type="WATER_SPRINKLER",
                assigned_unit="UNIT-1",
                operator_notes="Test",
                officer_badge_id="OFFICER-01",
            ),
        )


def test_sqlite_persistence_roundtrip(tmp_path):
    """Verifies that TicketService correctly persists and reloads incidents across SQLite restarts."""
    db_file = str(tmp_path / "test_vayu.db")

    # Instance 1: Create new custom ticket
    srv1 = TicketService(db_path=db_file, seed_defaults=False)
    custom_ticket_id = TicketService.generate_ticket_id("delhi_ncr", 28.7, 77.1)
    record = IncidentRecord(
        ticket_id=custom_ticket_id,
        status=IncidentStatusEnum.VERIFIED_HAZARD,
        reported_by="OFFLINE_INSPECTOR",
        city_id="delhi_ncr",
        coordinates=CoordinatesModel(latitude=28.7, longitude=77.1),
        verification=IncidentVerificationDetails(
            is_valid_environmental_hazard=True,
            source_classification="OPEN_MUNICIPAL_WASTE_BURNING",
            severity_score=0.9,
            confidence_score=0.95,
        ),
    )
    srv1.create_incident(record)

    # Instance 2: Reload from same db_file
    srv2 = TicketService(db_path=db_file, seed_defaults=False)
    reloaded = srv2.get_incident(custom_ticket_id)
    assert reloaded is not None
    assert reloaded.ticket_id == custom_ticket_id
    assert reloaded.status == IncidentStatusEnum.VERIFIED_HAZARD
    assert reloaded.reported_by == "OFFLINE_INSPECTOR"

