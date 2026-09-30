import { CITIES, SENSITIVE_RECEPTORS, VERNACULAR_TEMPLATES } from '../../_lib/mockDatabase.js';
import {
  calculateEmissionRateQ,
  computeBriggsPlumeRise,
  computeWindAtHeight,
  extractIsoplethContours,
  simulateTransientPuffs,
  projectGeodesic,
} from '../../_lib/dispersionEngine.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { city_id } = req.query;
  const normCityId = city_id === 'delhi_ncr' ? 'delhi' : (city_id || 'delhi');

  const city = CITIES.find((c) => c.id === normCityId || c.alias_id === normCityId) || CITIES[0];
  const cLat = city.center.lat;
  const cLng = city.center.lng;
  const weather = city.default_weather;
  const downwindBearing = weather.downwind_bearing_deg;

  // Generate 3 incidents localized around the city
  const incidentProfiles = [
    {
      offsetLat: 0.015,
      offsetLng: 0.012,
      classification: normCityId === 'punjab' ? 'BIOMASS_STUBBLE_BURNING' : 'OPEN_MUNICIPAL_WASTE_BURNING',
      severity_score: 0.88,
      confidence: 0.94,
      address_hint: `${city.name} Civic Sector 12 Peripheral Transit Belt`,
      ward_no: `Ward 18-${city.name.slice(0, 2).toUpperCase()}`,
      status: 'AUDIT_VERIFIED',
    },
    {
      offsetLat: -0.018,
      offsetLng: 0.022,
      classification: normCityId === 'kanpur' ? 'INDUSTRIAL_STACK_EMISSION' : 'CONSTRUCTION_DEMOLITION_DUST',
      severity_score: 0.76,
      confidence: 0.91,
      address_hint: `${city.name} Metro Station Phase 2 Extension Worksite`,
      ward_no: `Ward 07-${city.name.slice(0, 2).toUpperCase()}`,
      status: 'PENDING_DISPATCH',
    },
    {
      offsetLat: 0.022,
      offsetLng: -0.016,
      classification: normCityId === 'mumbai' ? 'HIGH_DENSITY_VEHICULAR_IDLING' : 'UNPAVED_ROAD_SUSPENSION',
      severity_score: 0.62,
      confidence: 0.89,
      address_hint: `${city.name} Heavy Arterial Ring Road Underpass`,
      ward_no: `Ward 24-${city.name.slice(0, 2).toUpperCase()}`,
      status: 'RESOLVED',
    },
  ];

  const cityReceptors = SENSITIVE_RECEPTORS.filter((r) => r.city_id === normCityId);

  const incidents = incidentProfiles.map((p, idx) => {
    const incLat = cLat + p.offsetLat;
    const incLng = cLng + p.offsetLng;
    const ticketId = `VAYU-${city.name.slice(0, 3).toUpperCase()}-2026-${String(idx + 101).padStart(3, '0')}`;

    // Compute real atmospheric dispersion
    const qGS = calculateEmissionRateQ(p.classification, p.severity_score, 18.0);
    const { deltaH, effectiveReleaseHeight } = computeBriggsPlumeRise(
      p.classification,
      p.classification === 'INDUSTRIAL_STACK_EMISSION' ? 25.0 : 2.0,
      6.0,
      weather.temperature_c + 273.15,
      680.0,
      weather.wind_speed_ms,
      weather.stability_class
    );
    const uEff = computeWindAtHeight(weather.wind_speed_ms, effectiveReleaseHeight, weather.stability_class, city.terrain);

    const isopleths = extractIsoplethContours(
      incLat,
      incLng,
      downwindBearing,
      qGS,
      uEff,
      effectiveReleaseHeight,
      weather.stability_class,
      city.terrain,
      weather.pbl_height_m
    );

    const snapshots = simulateTransientPuffs(
      incLat,
      incLng,
      downwindBearing,
      qGS,
      uEff,
      effectiveReleaseHeight,
      weather.stability_class,
      city.terrain,
      weather.pbl_height_m
    );

    // Compute downwind cone boundary
    const coneReachM = Math.max(isopleths[0]?.max_downwind_reach_km ? isopleths[0].max_downwind_reach_km * 1000 : 2800, 2200);
    const coneAngleDeg = 30.0;
    const pRight = projectGeodesic(incLat, incLng, downwindBearing + coneAngleDeg / 2, coneReachM, 0);
    const pApex = projectGeodesic(incLat, incLng, downwindBearing, coneReachM * 1.05, 0);
    const pLeft = projectGeodesic(incLat, incLng, downwindBearing - coneAngleDeg / 2, coneReachM, 0);

    const boundaryPolygon = [
      { lat: incLat, lng: incLng },
      { lat: pRight.lat, lng: pRight.lng },
      { lat: pApex.lat, lng: pApex.lng },
      { lat: pLeft.lat, lng: pLeft.lng },
      { lat: incLat, lng: incLng },
    ];

    // Compute impacted infrastructure
    const impactedInfrastructure = (cityReceptors.length ? cityReceptors : [
      { id: `${ticketId}-INFRA-1`, name: `${city.name} Central School & Daycare`, type: 'SCHOOL', lat: incLat + 0.008, lng: incLng + 0.009, capacity: 540 },
      { id: `${ticketId}-INFRA-2`, name: `${city.name} Ward Maternity Health Clinic`, type: 'HOSPITAL', lat: incLat + 0.014, lng: incLng + 0.016, capacity: 80 },
    ]).map((r, rIdx) => {
      const distM = Math.round(Math.hypot((r.lat - incLat) * 111000, (r.lng - incLng) * 111000 * Math.cos(incLat * Math.PI / 180)));
      const etaMin = Math.max(1, Math.round(distM / (Math.max(uEff, 0.5) * 60)));
      return {
        id: r.id || `REC-${rIdx + 1}`,
        name: r.name,
        type: r.type,
        lat: r.lat,
        lng: r.lng,
        distance_meters: distM,
        eta_minutes: etaMin,
        estimated_arrival_minutes: etaMin,
        hazard_level: etaMin <= 10 ? 'IMMEDIATE_EXPOSURE' : 'ELEVATED_RISK',
        alert_status: etaMin <= 10 ? 'DISPERSION_BREACH_IMMUTABLE' : 'ELEVATED_RISK',
      };
    });

    const vernacularAdvisories = VERNACULAR_TEMPLATES[p.classification] || VERNACULAR_TEMPLATES.OPEN_MUNICIPAL_WASTE_BURNING;

    return {
      ticket_id: ticketId,
      city_id: city.id,
      timestamp: new Date(Date.now() - (idx * 38 + 12) * 60000).toISOString(),
      status: p.status,
      classification: p.classification,
      severity_score: p.severity_score,
      confidence: p.confidence,
      location: {
        lat: incLat,
        lng: incLng,
        address_hint: p.address_hint,
        ward_no: p.ward_no,
      },
      coordinates: {
        latitude: incLat,
        longitude: incLng,
        address_hint: p.address_hint,
      },
      meteorology: {
        wind_speed_ms: weather.wind_speed_ms,
        wind_direction_deg: weather.wind_direction_deg,
        downwind_bearing_deg: downwindBearing,
        atmospheric_stability: `Class ${weather.stability_class}`,
        ambient_temp_c: weather.temperature_c,
      },
      weather_context: {
        wind_bearing_deg: downwindBearing,
        wind_direction: 'NE',
        wind_speed_mps: weather.wind_speed_ms,
        ambient_temp_c: weather.temperature_c,
        atmospheric_stability: `Class ${weather.stability_class}`,
      },
      downwind_exposure_cone: {
        bearing_degrees: downwindBearing,
        max_reach_km: +(coneReachM / 1000.0).toFixed(2),
        angular_spread_deg: coneAngleDeg,
        origin: { lat: incLat, lng: incLng },
        boundary_polygon: boundaryPolygon,
      },
      physics_simulation: {
        emission_rate_q_g_per_sec: +qGS.toFixed(2),
        plume_dynamics: {
          effective_wind_speed_ms: +uEff.toFixed(2),
          plume_rise_dh_m: +deltaH.toFixed(2),
          effective_release_height_m: +effectiveReleaseHeight.toFixed(2),
        },
        isopleth_contours: isopleths,
        time_series_snapshots: snapshots,
      },
      impacted_infrastructure: impactedInfrastructure,
      mitigation_options: [
        {
          action_id: `ACTION-SMOG-${idx + 1}`,
          label: 'Deploy High-Pressure Water Mist Cannon',
          type: 'SMOG_GUN',
          response_eta_minutes: 10 + idx * 3,
          efficacy_rating: '88% PM Quenching',
          assigned_unit: `MCD-SMOG-UNIT-0${idx + 1}`,
        },
        {
          action_id: `ACTION-SWEEPER-${idx + 1}`,
          label: 'Deploy Mechanical Road Sweeper & Wash Tanker',
          type: 'WATER_TANKER',
          response_eta_minutes: 15 + idx * 2,
          efficacy_rating: '75% Resuspension Suppression',
          assigned_unit: `MCD-TANKER-0${idx + 2}`,
        },
      ],
      visual_markers: [
        'Dense particulate pyrolytic column identified',
        'Visible thermal ground perimeter',
        'Significant optical opacity breach verified',
      ],
      vernacular_advisories: vernacularAdvisories,
    };
  });

  return res.status(200).json(incidents);
}
