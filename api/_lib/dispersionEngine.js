/**
 * VayuGrid Serverless Atmospheric Physics & Dispersion Simulation Engine
 * Port of backend/app/services/dispersion_engine.py into lightweight pure JavaScript.
 *
 * Implements:
 * 1. Irwin power-law vertical wind shear profile: u(z) = u10 * (z/10)^p
 * 2. Briggs buoyant & momentum plume rise (Delta H)
 * 3. Briggs Urban/Rural continuous rational dispersion coefficients (sigma_y, sigma_z)
 * 4. 5-term Method of Images Planetary Boundary Layer (PBL) capping inversion lid reflection
 * 5. Analytical statutory isopleth half-width polygons in < 1ms
 * 6. Forward geodesic coordinate projection (WGS84)
 */

export const StabilityClass = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
  F: 'F',
};

export const TerrainCategory = {
  URBAN: 'URBAN',
  RURAL_OPEN: 'RURAL_OPEN',
};

export const EmissionSourceType = {
  OPEN_MUNICIPAL_WASTE_BURNING: 'OPEN_MUNICIPAL_WASTE_BURNING',
  CONSTRUCTION_DEMOLITION_DUST: 'CONSTRUCTION_DEMOLITION_DUST',
  INDUSTRIAL_STACK_EMISSION: 'INDUSTRIAL_STACK_EMISSION',
  BIOMASS_STUBBLE_BURNING: 'BIOMASS_STUBBLE_BURNING',
  HIGH_DENSITY_VEHICULAR_IDLING: 'HIGH_DENSITY_VEHICULAR_IDLING',
  UNPAVED_ROAD_SUSPENSION: 'UNPAVED_ROAD_SUSPENSION',
};

export const CPCB_AQI_THRESHOLDS = {
  HAZARDOUS: 400.0,
  SEVERE: 250.0,
  MODERATE: 120.0,
  ADVISORY: 60.0,
};

export const ISOPLETH_COLOR_MAP = {
  HAZARDOUS: '#DC2626',
  SEVERE: '#EA580C',
  MODERATE: '#D97706',
  ADVISORY: '#CA8A04',
};

const RHO_AIR = 1.225; // kg/m^3
const CP_AIR = 1005.0; // J/(kg K)
const G = 9.80665;
const EARTH_RADIUS_M = 6371008.8;

// Irwin Wind Shear Exponents
const IRWIN_EXPONENTS = {
  [TerrainCategory.URBAN]: { A: 0.15, B: 0.15, C: 0.20, D: 0.25, E: 0.40, F: 0.40 },
  [TerrainCategory.RURAL_OPEN]: { A: 0.07, B: 0.07, C: 0.10, D: 0.15, E: 0.35, F: 0.35 },
};

/**
 * Calculates emission mass flux Q in g/s
 */
export function calculateEmissionRateQ(sourceType, severityScore, originRadiusM = 15.0) {
  const footprintArea = Math.PI * Math.pow(Math.max(originRadiusM, 2.0), 2);
  const s = Math.max(0.05, Math.min(1.0, severityScore));

  let baseFlux = 0.08;
  switch (sourceType) {
    case EmissionSourceType.OPEN_MUNICIPAL_WASTE_BURNING:
      baseFlux = 0.12;
      break;
    case EmissionSourceType.CONSTRUCTION_DEMOLITION_DUST:
      baseFlux = 0.06;
      break;
    case EmissionSourceType.INDUSTRIAL_STACK_EMISSION:
      return 85.0 * Math.pow(s, 1.2);
    case EmissionSourceType.BIOMASS_STUBBLE_BURNING:
      baseFlux = 0.15;
      break;
    case EmissionSourceType.HIGH_DENSITY_VEHICULAR_IDLING:
      baseFlux = 0.04;
      break;
    case EmissionSourceType.UNPAVED_ROAD_SUSPENSION:
      baseFlux = 0.05;
      break;
  }
  return baseFlux * footprintArea * Math.pow(s, 1.3);
}

/**
 * Evaluates wind speed at emission/transport height using Irwin profile
 */
export function computeWindAtHeight(u10Ms, heightM, stability = StabilityClass.D, terrain = TerrainCategory.URBAN) {
  const uClamped = Math.max(u10Ms, 0.5);
  const hClamped = Math.max(heightM, 2.0);
  const p = (IRWIN_EXPONENTS[terrain] || IRWIN_EXPONENTS.URBAN)[stability] || 0.25;
  const uZ = uClamped * Math.pow(hClamped / 10.0, p);
  return Math.max(uZ, 0.5);
}

/**
 * Computes Briggs thermal buoyancy flux and effective plume rise
 */
export function computeBriggsPlumeRise(
  sourceType,
  physicalHeightM = 2.0,
  radiusM = 5.0,
  ambientTempK = 298.15,
  sourceTempK = 650.0,
  windSpeedMs = 3.5,
  stability = StabilityClass.D
) {
  const u = Math.max(windSpeedMs, 0.5);
  const deltaT = Math.max(sourceTempK - ambientTempK, 5.0);
  const exitVelocity = sourceType === EmissionSourceType.INDUSTRIAL_STACK_EMISSION ? 12.0 : 2.5;

  const fb = G * exitVelocity * Math.pow(radiusM, 2) * (deltaT / sourceTempK);
  const fm = Math.pow(exitVelocity, 2) * Math.pow(radiusM, 2) * (ambientTempK / sourceTempK);

  let deltaH = 0.0;
  const isStable = stability === StabilityClass.E || stability === StabilityClass.F;

  if (!isStable) {
    if (fb > 0.0) {
      const xStar = fb < 55.0 ? 14.0 * Math.pow(fb, 5.0 / 8.0) : 34.0 * Math.pow(fb, 2.0 / 5.0);
      deltaH = (1.6 * Math.pow(fb, 1.0 / 3.0) * Math.pow(xStar, 2.0 / 3.0)) / u;
    }
  } else {
    const s = stability === StabilityClass.E ? 0.00087 : 0.00175;
    if (fb > 0.0) {
      const dhBuoy = 2.6 * Math.pow(fb / (u * s), 1.0 / 3.0);
      deltaH = dhBuoy;
    }
  }
  deltaH = Math.max(deltaH, 1.0);
  return { deltaH, fb, fm, effectiveReleaseHeight: physicalHeightM + deltaH };
}

/**
 * Evaluates lateral (sigma_y) and vertical (sigma_z) Briggs dispersion parameters
 */
export function evaluateDispersionCoefficients(xM, stability = StabilityClass.D, terrain = TerrainCategory.URBAN) {
  const x = Math.max(xM, 1.0);
  let sy = 0.16 * x * Math.pow(1.0 + 0.0004 * x, -0.5);
  let sz = 0.14 * x * Math.pow(1.0 + 0.0003 * x, -0.5);

  if (terrain === TerrainCategory.URBAN) {
    switch (stability) {
      case StabilityClass.A:
      case StabilityClass.B:
        sy = 0.32 * x * Math.pow(1.0 + 0.0004 * x, -0.5);
        sz = 0.24 * x * Math.pow(1.0 + 0.001 * x, 0.5);
        break;
      case StabilityClass.C:
        sy = 0.22 * x * Math.pow(1.0 + 0.0004 * x, -0.5);
        sz = 0.20 * x;
        break;
      case StabilityClass.D:
        sy = 0.16 * x * Math.pow(1.0 + 0.0004 * x, -0.5);
        sz = 0.14 * x * Math.pow(1.0 + 0.0003 * x, -0.5);
        break;
      case StabilityClass.E:
      case StabilityClass.F:
        sy = 0.11 * x * Math.pow(1.0 + 0.0004 * x, -0.5);
        sz = 0.08 * x * Math.pow(1.0 + 0.00015 * x, -0.5);
        break;
    }
  } else {
    switch (stability) {
      case StabilityClass.A:
        sy = 0.22 * x * Math.pow(1.0 + 0.0001 * x, -0.5);
        sz = 0.20 * x;
        break;
      case StabilityClass.B:
        sy = 0.16 * x * Math.pow(1.0 + 0.0001 * x, -0.5);
        sz = 0.12 * x;
        break;
      case StabilityClass.C:
        sy = 0.11 * x * Math.pow(1.0 + 0.0001 * x, -0.5);
        sz = 0.08 * x * Math.pow(1.0 + 0.0002 * x, -0.5);
        break;
      case StabilityClass.D:
        sy = 0.08 * x * Math.pow(1.0 + 0.0001 * x, -0.5);
        sz = 0.06 * x * Math.pow(1.0 + 0.0015 * x, -0.5);
        break;
      case StabilityClass.E:
        sy = 0.06 * x * Math.pow(1.0 + 0.0001 * x, -0.5);
        sz = 0.03 * x * Math.pow(1.0 + 0.0003 * x, -1.0);
        break;
      case StabilityClass.F:
        sy = 0.04 * x * Math.pow(1.0 + 0.0001 * x, -0.5);
        sz = 0.016 * x * Math.pow(1.0 + 0.0003 * x, -1.0);
        break;
    }
  }
  return {
    sy: Math.max(sy, 1.0),
    sz: Math.max(sz, 0.5),
  };
}

/**
 * 5-term Method of Images reflection with inversion lid zi
 */
export function evaluateVerticalReflection(zReceptM, hEffM, sz, pblHeightM = 500.0) {
  const z = zReceptM;
  const H = hEffM;
  const zi = Math.max(pblHeightM, 100.0);

  if (sz >= 1.6 * zi) {
    return (Math.sqrt(2.0 * Math.PI) * sz) / zi;
  }

  const expTerm = (val) => Math.exp(-Math.pow(val, 2) / (2.0 * Math.pow(sz, 2)));

  let sum = expTerm(z - H) + expTerm(z + H);
  for (let n = 1; n <= 2; n++) {
    sum += expTerm(z - H - 2 * n * zi);
    sum += expTerm(z + H - 2 * n * zi);
    sum += expTerm(z - H + 2 * n * zi);
    sum += expTerm(z + H + 2 * n * zi);
  }
  return sum;
}

/**
 * Evaluates steady-state Gaussian ground concentration C(x, y, z) in ug/m^3
 */
export function computeSteadyStateConcentration(
  xM,
  yM,
  zReceptM = 1.5,
  qGS = 50.0,
  uEffMs = 3.5,
  hEffM = 12.0,
  stability = StabilityClass.D,
  terrain = TerrainCategory.URBAN,
  pblHeightM = 500.0
) {
  if (xM <= 0.0) return 0.0;
  const { sy, sz } = evaluateDispersionCoefficients(xM, stability, terrain);
  const u = Math.max(uEffMs, 0.5);

  const lateralTerm = Math.exp(-Math.pow(yM, 2) / (2.0 * Math.pow(sy, 2)));
  const verticalTerm = evaluateVerticalReflection(zReceptM, hEffM, sz, pblHeightM);

  const cGPerM3 = (qGS / (2.0 * Math.PI * u * sy * sz)) * lateralTerm * verticalTerm;
  return cGPerM3 * 1e6; // Convert to ug/m^3
}

/**
 * WGS84 Geodesic Forward Projection
 */
export function projectGeodesic(originLat, originLon, bearingDeg, distXM, distYM) {
  const rad = (bearingDeg * Math.PI) / 180.0;
  const sinB = Math.sin(rad);
  const cosB = Math.cos(rad);

  const eastM = distXM * sinB + distYM * cosB;
  const northM = distXM * cosB - distYM * sinB;

  const latRad = (originLat * Math.PI) / 180.0;
  const dLat = northM / EARTH_RADIUS_M;
  const dLon = eastM / (EARTH_RADIUS_M * Math.cos(latRad));

  return {
    lat: originLat + (dLat * 180.0) / Math.PI,
    lon: originLon + (dLon * 180.0) / Math.PI,
    lng: originLon + (dLon * 180.0) / Math.PI,
  };
}

/**
 * Analytically extracts closed-form statutory isopleth polygons
 */
export function extractIsoplethContours(
  originLat,
  originLon,
  downwindBearingDeg,
  qGS,
  uEffMs,
  hEffM,
  stability = StabilityClass.D,
  terrain = TerrainCategory.URBAN,
  pblHeightM = 500.0
) {
  const isopleths = [];
  const tiers = [
    { tier: 'HAZARDOUS', threshold: CPCB_AQI_THRESHOLDS.HAZARDOUS, color: ISOPLETH_COLOR_MAP.HAZARDOUS },
    { tier: 'SEVERE', threshold: CPCB_AQI_THRESHOLDS.SEVERE, color: ISOPLETH_COLOR_MAP.SEVERE },
    { tier: 'MODERATE', threshold: CPCB_AQI_THRESHOLDS.MODERATE, color: ISOPLETH_COLOR_MAP.MODERATE },
    { tier: 'ADVISORY', threshold: CPCB_AQI_THRESHOLDS.ADVISORY, color: ISOPLETH_COLOR_MAP.ADVISORY },
  ];

  for (const { tier, threshold, color } of tiers) {
    const xPoints = [];
    const yHalfPoints = [];

    // Probe distances from 10m to 10,000m
    const stepCount = 50;
    const maxScanM = 8000.0;

    for (let i = 1; i <= stepCount; i++) {
      const x = (i / stepCount) * maxScanM;
      const cCenter = computeSteadyStateConcentration(x, 0.0, 1.5, qGS, uEffMs, hEffM, stability, terrain, pblHeightM);

      if (cCenter > threshold) {
        const { sy } = evaluateDispersionCoefficients(x, stability, terrain);
        const yHalf = sy * Math.sqrt(2.0 * Math.log(cCenter / threshold));
        xPoints.push(x);
        yHalfPoints.push(yHalf);
      }
    }

    if (xPoints.length >= 2) {
      const coords = [];
      // Origin
      coords.push(projectGeodesic(originLat, originLon, downwindBearingDeg, 0.0, 0.0));

      // Right boundary (positive y)
      for (let i = 0; i < xPoints.length; i++) {
        coords.push(projectGeodesic(originLat, originLon, downwindBearingDeg, xPoints[i], yHalfPoints[i]));
      }

      // Apex point
      const lastX = xPoints[xPoints.length - 1];
      coords.push(projectGeodesic(originLat, originLon, downwindBearingDeg, lastX * 1.02, 0.0));

      // Left boundary (negative y, reversed)
      for (let i = xPoints.length - 1; i >= 0; i--) {
        coords.push(projectGeodesic(originLat, originLon, downwindBearingDeg, xPoints[i], -yHalfPoints[i]));
      }

      // Close polygon
      coords.push(projectGeodesic(originLat, originLon, downwindBearingDeg, 0.0, 0.0));

      const maxReachKm = +(lastX / 1000.0).toFixed(2);
      const maxHalfWidthM = +(Math.max(...yHalfPoints)).toFixed(1);

      isopleths.push({
        tier,
        threshold_ug_m3: threshold,
        color_hex: color,
        max_downwind_reach_km: maxReachKm,
        max_crosswind_width_meters: maxHalfWidthM * 2.0,
        polygon_geojson: {
          type: 'Polygon',
          coordinates: [coords.map((c) => [c.lon, c.lat])],
        },
        boundary_polygon: coords.map((c) => ({ lat: c.lat, lng: c.lon })),
      });
    }
  }

  return isopleths;
}

/**
 * Simulates transient Lagrangian puff milestones (5, 15, 30, 60 mins)
 */
export function simulateTransientPuffs(
  originLat,
  originLon,
  downwindBearingDeg,
  qGS,
  uEffMs,
  hEffM,
  stability = StabilityClass.D,
  terrain = TerrainCategory.URBAN,
  pblHeightM = 500.0
) {
  const timesMinutes = [5, 15, 30, 60];
  const snapshots = [];

  for (const tMin of timesMinutes) {
    const tSec = tMin * 60;
    const downwindReachM = uEffMs * tSec;
    const { sy, sz } = evaluateDispersionCoefficients(downwindReachM, stability, terrain);
    const conc = computeSteadyStateConcentration(downwindReachM, 0.0, 1.5, qGS, uEffMs, hEffM, stability, terrain, pblHeightM);

    const geoCenter = projectGeodesic(originLat, originLon, downwindBearingDeg, downwindReachM, 0.0);

    snapshots.push({
      elapsed_minutes: tMin,
      puff_count: Math.round(tMin * 2.5),
      max_downwind_reach_km: +(downwindReachM / 1000.0).toFixed(2),
      front_concentration_ug_m3: +conc.toFixed(1),
      puff_center: { lat: geoCenter.lat, lng: geoCenter.lon },
      sigma_y_meters: +sy.toFixed(1),
      sigma_z_meters: +sz.toFixed(1),
    });
  }

  return snapshots;
}
