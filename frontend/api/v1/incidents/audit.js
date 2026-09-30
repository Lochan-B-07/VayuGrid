import { VERNACULAR_TEMPLATES, SENSITIVE_RECEPTORS } from '../../_lib/mockDatabase.js';
import {
  calculateEmissionRateQ,
  computeBriggsPlumeRise,
  computeWindAtHeight,
  extractIsoplethContours,
  simulateTransientPuffs,
  projectGeodesic,
} from '../../_lib/dispersionEngine.js';

export const config = {
  api: {
    bodyParser: false, // We'll parse or inspect incoming multipart/form-data or json
  },
};

// Helper to buffer stream
async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const rawBody = await getRawBody(req);

  // Extract fields heuristically from raw multipart or JSON
  let lat = 28.6289;
  let lng = 77.2065;
  let fileName = '';
  let sourceHint = '';

  try {
    if (rawBody.startsWith('{')) {
      const parsed = JSON.parse(rawBody);
      lat = parseFloat(parsed.latitude) || lat;
      lng = parseFloat(parsed.longitude) || lng;
      fileName = parsed.filename || '';
      sourceHint = parsed.source_hint || '';
    } else {
      // Multipart form text extraction
      const latMatch = rawBody.match(/name="latitude"[^\r\n]*[\r\n]+([0-9.-]+)/);
      if (latMatch) lat = parseFloat(latMatch[1]);

      const lngMatch = rawBody.match(/name="longitude"[^\r\n]*[\r\n]+([0-9.-]+)/);
      if (lngMatch) lng = parseFloat(lngMatch[1]);

      const fileMatch = rawBody.match(/filename="([^"]+)"/);
      if (fileMatch) fileName = fileMatch[1].toLowerCase();

      const hintMatch = rawBody.match(/name="source_hint"[^\r\n]*[\r\n]+([^\r\n]+)/);
      if (hintMatch) sourceHint = hintMatch[1];
    }
  } catch (err) {
    // default coordinates
  }

  const isIndoor = fileName.includes('indoor') || fileName.includes('room') || fileName.includes('screen') || fileName.includes('selfie');
  const isClean = fileName.includes('clean') || fileName.includes('clear') || fileName.includes('park');
  const isDust = fileName.includes('dust') || fileName.includes('construction') || sourceHint.includes('DUST');
  const isStack = fileName.includes('stack') || fileName.includes('industry') || fileName.includes('chimney');
  const isStubble = fileName.includes('stubble') || fileName.includes('farm') || fileName.includes('crop');

  const nowYear = new Date().getFullYear();
  const ticketId = `VAYU-${nowYear}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Handle Clean Air Submission
  if (isClean) {
    return res.status(200).json({
      ticket_id: ticketId,
      created_at: new Date().toISOString(),
      status: 'REJECTED',
      verification: {
        is_valid_environmental_hazard: false,
        source_classification: 'AMBIENT_AIR_NORMAL',
        confidence_score: 0.98,
        severity_score: 0.05,
        optical_opacity: 0.02,
        estimated_plume_radius_meters: 0.0,
        rejection_reason: 'CLEAN_AIR_VERIFIED: No acute emission plume or particulate haze detected.',
        detected_visual_markers: [
          'High visual horizon contrast',
          'Absence of combustion thermal shimmer',
          'Clear sky optical transparency',
        ],
      },
      message: 'Air quality within clean thresholds. No intervention warranted.',
    });
  }

  // Handle Anti-Spoofing Indoor Rejection
  if (isIndoor) {
    return res.status(200).json({
      ticket_id: ticketId,
      created_at: new Date().toISOString(),
      status: 'REJECTED',
      verification: {
        is_valid_environmental_hazard: false,
        source_classification: 'NON_ENVIRONMENTAL_INDOOR',
        confidence_score: 0.96,
        severity_score: 0.0,
        optical_opacity: 0.0,
        estimated_plume_radius_meters: 0.0,
        rejection_reason: 'ANTI_SPOOFING_REJECT: Image appears to be captured indoors or from an electronic display screen.',
        detected_visual_markers: [
          'Indoor structural elements detected',
          'Artificial interior lighting signatures',
          'No outdoor horizon or atmospheric dispersion geometry',
        ],
      },
      message: 'Submission rejected: Must be a direct outdoor capture of an active air pollution hazard.',
    });
  }

  // Valid hazard classification
  let classification = 'OPEN_MUNICIPAL_WASTE_BURNING';
  let severityScore = 0.86;
  if (isDust) {
    classification = 'CONSTRUCTION_DEMOLITION_DUST';
    severityScore = 0.74;
  } else if (isStack) {
    classification = 'INDUSTRIAL_STACK_EMISSION';
    severityScore = 0.92;
  } else if (isStubble) {
    classification = 'BIOMASS_STUBBLE_BURNING';
    severityScore = 0.89;
  }

  // Atmospheric physics calculation
  const downwindBearing = 52.0;
  const windSpeed = 4.2;
  const stability = 'D';
  const qGS = calculateEmissionRateQ(classification, severityScore, 16.0);
  const { deltaH, effectiveReleaseHeight } = computeBriggsPlumeRise(
    classification,
    classification === 'INDUSTRIAL_STACK_EMISSION' ? 25.0 : 2.0,
    5.0,
    301.65,
    650.0,
    windSpeed,
    stability
  );
  const uEff = computeWindAtHeight(windSpeed, effectiveReleaseHeight, stability, 'URBAN');

  const isopleths = extractIsoplethContours(lat, lng, downwindBearing, qGS, uEff, effectiveReleaseHeight, stability, 'URBAN', 500.0);
  const snapshots = simulateTransientPuffs(lat, lng, downwindBearing, qGS, uEff, effectiveReleaseHeight, stability, 'URBAN', 500.0);

  const coneReachM = 2800.0;
  const pRight = projectGeodesic(lat, lng, downwindBearing + 15.0, coneReachM, 0);
  const pApex = projectGeodesic(lat, lng, downwindBearing, coneReachM * 1.05, 0);
  const pLeft = projectGeodesic(lat, lng, downwindBearing - 15.0, coneReachM, 0);

  const boundaryPolygon = [
    { lat, lng },
    { lat: pRight.lat, lng: pRight.lng },
    { lat: pApex.lat, lng: pApex.lng },
    { lat: pLeft.lat, lng: pLeft.lng },
    { lat, lng },
  ];

  const impactedInfrastructure = [
    {
      id: `${ticketId}-INFRA-1`,
      name: 'Primary Health Center & Maternity Wing',
      type: 'HOSPITAL',
      lat: lat + 0.012,
      lng: lng + 0.014,
      distance_meters: 1100,
      eta_minutes: 8,
      estimated_arrival_minutes: 8,
      hazard_level: 'IMMEDIATE_EXPOSURE',
      alert_status: 'DISPERSION_BREACH_IMMUTABLE',
    },
    {
      id: `${ticketId}-INFRA-2`,
      name: 'Government Composite Primary School',
      type: 'SCHOOL',
      lat: lat + 0.018,
      lng: lng + 0.021,
      distance_meters: 1850,
      eta_minutes: 14,
      estimated_arrival_minutes: 14,
      hazard_level: 'ELEVATED_RISK',
      alert_status: 'ELEVATED_RISK',
    },
  ];

  const vernacularAdvisories = VERNACULAR_TEMPLATES[classification] || VERNACULAR_TEMPLATES.OPEN_MUNICIPAL_WASTE_BURNING;

  return res.status(200).json({
    ticket_id: ticketId,
    created_at: new Date().toISOString(),
    status: 'AUDIT_VERIFIED',
    verification: {
      is_valid_environmental_hazard: true,
      source_classification: classification,
      confidence_score: 0.94,
      severity_score: severityScore,
      optical_opacity: +(severityScore * 0.9).toFixed(2),
      estimated_plume_radius_meters: 18.5,
      detected_visual_markers: [
        'Dense particulate pyrolytic column identified',
        'Visible thermal shimmer along ground combustion perimeter',
        'Statutory particulate opacity breach confirmed',
      ],
      rejection_reason: null,
    },
    location: {
      lat,
      lng,
      address_hint: 'Civic Sector Periphery, Geospatially Tagged by Citizen Ingest',
      ward_no: 'Ward 12-CZ',
    },
    coordinates: {
      latitude: lat,
      longitude: lng,
      address_hint: 'Civic Sector Periphery, Geospatially Tagged by Citizen Ingest',
    },
    meteorology: {
      wind_speed_ms: windSpeed,
      wind_direction_deg: 232.0,
      downwind_bearing_deg: downwindBearing,
      atmospheric_stability: `Class ${stability}`,
      ambient_temp_c: 28.5,
    },
    weather_context: {
      wind_bearing_deg: downwindBearing,
      wind_direction: 'NE',
      wind_speed_mps: windSpeed,
      ambient_temp_c: 28.5,
      atmospheric_stability: 'Class D (Neutral)',
    },
    downwind_exposure_cone: {
      bearing_degrees: downwindBearing,
      max_reach_km: 2.8,
      angular_spread_deg: 30.0,
      origin: { lat, lng },
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
        action_id: 'ACTION-SMOG-RAPID',
        label: 'Deploy Ward Smog Cannon Unit',
        type: 'SMOG_GUN',
        response_eta_minutes: 10,
        efficacy_rating: '85% PM Quenching',
      },
    ],
    vernacular_advisories: vernacularAdvisories,
  });
}
