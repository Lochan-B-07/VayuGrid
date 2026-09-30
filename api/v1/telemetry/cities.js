/**
 * ============================================================================
 * VayuGrid Telemetry Cities Handler
 * ============================================================================
 *
 * @file cities.js
 * @module api/v1/telemetry/cities
 * @description
 * Returns the statutory monitoring cities with official CPCB station counts,
 * real-time AQI classifications, and regional pollution archetypes.
 *
 * PROBLEM STATEMENT & NCAP ALIGNMENT:
 * Under the National Clean Air Programme (NCAP), Indian cities represent distinct
 * meteorological and emission challenges:
 * - Delhi-NCR: Polycentric megacity + post-harvest biomass stubble + winter inversion trapping.
 * - Bengaluru: Peninsular ridge + tech corridor vehicular emissions & unpaved dust.
 * - Kanpur: Gangetic river basin + severe thermal inversion & tannery clusters.
 * - Mumbai: Coastal land-sea breeze oscillation + urban canyon trapping.
 * - Punjab Agrarian Belt: Agricultural crop residue open-field pyrolysis.
 */

import { CITIES } from '../../_lib/mockDatabase.js';

export default function handler(req, res) {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Format city objects with backward-compatible identifiers
  const payload = CITIES.map((c) => ({
    id: c.alias_id || c.id,
    name: c.name,
    state: c.state,
    archetype: c.archetype,
    center: c.center,
    zoom: c.zoom,
    current_aqi: c.current_aqi,
    category: c.category,
    primary_pollutant: c.primary_pollutant,
    cpcb_stations_count: c.cpcb_stations_count,
    active_incidents: c.active_incidents,
  }));

  return res.status(200).json(payload);
}
