"""Integration tests for FastAPI endpoints."""

from starlette.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_and_health():
    res_root = client.get("/")
    assert res_root.status_code == 200
    assert res_root.json()["platform"] == "VayuGrid"

    res_health = client.get("/health")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "healthy"


def test_telemetry_cities():
    res = client.get("/api/v1/telemetry/cities")
    assert res.status_code == 200
    cities = res.json()
    assert len(cities) >= 5
    city_ids = [c["id"] for c in cities]
    assert "delhi_ncr" in city_ids
    assert "bengaluru" in city_ids


def test_telemetry_weather():
    res = client.get("/api/v1/telemetry/weather?latitude=28.6139&longitude=77.2090&city_id=delhi_ncr")
    assert res.status_code == 200
    data = res.json()
    assert "wind_speed_kmh" in data
    assert "downwind_bearing_deg" in data
    assert "stability_class" in data
    assert "planetary_boundary_layer_height_m" in data


def test_dispersion_simulation_endpoint():
    payload = {
        "origin_lat": 28.6139,
        "origin_lon": 77.2090,
        "source_type": "OPEN_MUNICIPAL_WASTE_BURNING",
        "severity_score": 0.85,
        "smoke_opacity": 0.90,
        "origin_radius_meters": 20.0,
        "simulation_duration_minutes": 60,
    }
    res = client.post("/api/v1/dispersion/simulate?city_id=delhi_ncr", json=payload)
    assert res.status_code == 200
    sim = res.json()
    assert "simulation_id" in sim
    assert "plume_dynamics" in sim
    assert "isopleth_contours" in sim
    assert "downwind_exposure_cone" in sim
    assert "time_series_snapshots" in sim
    assert sim["execution_time_ms"] > 0


def test_incident_audit_endpoint():
    # Audit without binary file (testing JSON response structure)
    res = client.post(
        "/api/v1/incidents/audit",
        data={
            "latitude": "28.6139",
            "longitude": "77.2090",
            "city_id": "delhi_ncr",
            "reported_by": "CITIZEN_TEST_RUNNER",
        },
    )
    assert res.status_code == 200
    ticket = res.json()
    assert ticket["status"] == "VERIFIED_HAZARD"
    assert "ticket_id" in ticket
    assert "downwind_exposure_cone" in ticket
    assert "physics_simulation" in ticket
    assert "vernacular_advisories" in ticket
    assert "impacted_infrastructure" in ticket


def test_telemetry_aqi():
    res = client.get("/api/v1/telemetry/aqi?city_id=delhi_ncr")
    assert res.status_code == 200
    stations = res.json()
    assert len(stations) >= 1
    assert "aqi_value" in stations[0]
    assert "aqi_category" in stations[0]


def test_active_incidents_list():
    res = client.get("/api/v1/incidents/active?city_id=delhi_ncr")
    assert res.status_code == 200
    incidents = res.json()
    assert len(incidents) >= 1
    assert incidents[0]["city_id"] == "delhi_ncr"

    res_alias = client.get("/api/v1/incidents/active?city_id=delhi")
    assert res_alias.status_code == 200
    incidents_alias = res_alias.json()
    assert len(incidents_alias) >= 1


def test_get_incident_by_id():
    res = client.get("/api/v1/incidents/VAYU-DEL-2861-7720-A4F9")
    assert res.status_code == 200
    data = res.json()
    assert data["ticket_id"] == "VAYU-DEL-2861-7720-A4F9"
    assert data["status"] == "VERIFIED_HAZARD"


def test_dispatch_and_resolve_flow():
    ticket_id = "VAYU-DEL-2861-7720-A4F9"
    action_payload = {
        "action_type": "DISPATCH_SMOG_GUN",
        "assigned_unit": "EAST_DELHI_SMOG_GUN_04",
        "operator_notes": "Mist cannon deployed to perimeter.",
        "officer_badge_id": "MCD-ENF-8821",
    }
    res_disp = client.post(f"/api/v1/incidents/{ticket_id}/action", json=action_payload)
    assert res_disp.status_code == 200
    disp_data = res_disp.json()
    assert disp_data["status"] == "DISPATCHED"

    resolve_payload = {
        "officer_badge_id": "MCD-ENF-8821",
        "resolution_notes": "Plume fully suppressed.",
        "mitigation_summary": "Applied 15,000L fine mist spray.",
    }
    res_resolve = client.post(f"/api/v1/incidents/{ticket_id}/resolve", json=resolve_payload)
    assert res_resolve.status_code == 200
    resolve_data = res_resolve.json()
    assert resolve_data["status"] == "RESOLVED"


def test_base64_json_audit_endpoint():
    payload = {
        "latitude": 19.0760,
        "longitude": 72.8777,
        "city_id": "mumbai",
        "reported_by": "MUMBAI_EDGE_PWA",
    }
    res = client.post("/api/v1/incidents/audit/json", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "VERIFIED_HAZARD"
    assert "ticket_id" in data
    assert "vernacular_advisories" in data


def test_middleware_headers():
    res = client.get("/health")
    assert res.status_code == 200
    assert "x-process-time" in res.headers
    assert "x-request-id" in res.headers


def test_vernacular_endpoints():
    res_syn = client.post(
        "/api/v1/vernacular/synthesize",
        json={
            "source_classification": "OPEN_MUNICIPAL_WASTE_BURNING",
            "severity_score": 0.85,
            "city_name": "Delhi-NCR",
            "detected_markers": ["Dense smoke"],
        },
    )
    assert res_syn.status_code == 200
    advisories = res_syn.json()
    assert "en" in advisories
    assert "hi" in advisories
    assert "te" in advisories
    assert "kn" in advisories
    assert "ta" in advisories
    assert "ml" in advisories

    res_aud = client.post(
        "/api/v1/vernacular/audio",
        json={
            "text": "Dense toxic smoke detected nearby. Stay indoors.",
            "language_code": "hi",
        },
    )
    assert res_aud.status_code == 200
    aud = res_aud.json()
    assert aud["language_code"] == "hi"
    assert "audio_base64" in aud or aud.get("audio_source") == "SYNTHESIZED_FALLBACK"


