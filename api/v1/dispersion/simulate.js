import {
  calculateEmissionRateQ,
  computeBriggsPlumeRise,
  computeWindAtHeight,
  extractIsoplethContours,
  simulateTransientPuffs,
  computeSteadyStateConcentration,
} from '../../_lib/dispersionEngine.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const body = req.body || {};
  const lat = parseFloat(body.origin_lat) || 28.6139;
  const lng = parseFloat(body.origin_lon) || 77.2090;
  const sourceType = body.source_type || 'OPEN_MUNICIPAL_WASTE_BURNING';
  const severityScore = parseFloat(body.severity_score) || 0.85;
  const windSpeed = parseFloat(body.wind_speed_ms) || 3.8;
  const windDir = parseFloat(body.wind_direction_deg) || 310.0;
  const downwindBearing = (windDir + 180.0) % 360.0;
  const stability = body.stability_class || 'D';
  const terrain = body.terrain || 'URBAN';
  const pblHeight = parseFloat(body.planetary_boundary_layer_height_m) || 450.0;

  const qGS = calculateEmissionRateQ(sourceType, severityScore, 18.0);
  const { deltaH, effectiveReleaseHeight } = computeBriggsPlumeRise(
    sourceType,
    sourceType === 'INDUSTRIAL_STACK_EMISSION' ? 25.0 : 2.0,
    6.0,
    300.0,
    650.0,
    windSpeed,
    stability
  );
  const uEff = computeWindAtHeight(windSpeed, effectiveReleaseHeight, stability, terrain);

  const isopleths = extractIsoplethContours(lat, lng, downwindBearing, qGS, uEff, effectiveReleaseHeight, stability, terrain, pblHeight);
  const snapshots = simulateTransientPuffs(lat, lng, downwindBearing, qGS, uEff, effectiveReleaseHeight, stability, terrain, pblHeight);

  // Peak ground concentration
  const peakConc = computeSteadyStateConcentration(100.0, 0.0, 1.5, qGS, uEff, effectiveReleaseHeight, stability, terrain, pblHeight);

  return res.status(200).json({
    simulation_id: `SIM-${Date.now()}`,
    status: 'COMPLETED',
    timestamp: new Date().toISOString(),
    source: {
      type: sourceType,
      severity_score: severityScore,
      emission_rate_q_g_per_sec: +qGS.toFixed(2),
      origin_coordinates: { latitude: lat, longitude: lng },
    },
    meteorology_applied: {
      wind_speed_ms: windSpeed,
      downwind_bearing_deg: downwindBearing,
      stability_class: stability,
      effective_wind_speed_ms: +uEff.toFixed(2),
      pbl_height_m: pblHeight,
    },
    plume_dynamics: {
      plume_rise_dh_m: +deltaH.toFixed(2),
      effective_release_height_m: +effectiveReleaseHeight.toFixed(2),
      peak_ground_concentration_ug_m3: +peakConc.toFixed(1),
    },
    isopleth_contours: isopleths,
    time_series_snapshots: snapshots,
  });
}
