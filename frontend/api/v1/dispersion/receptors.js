/**
 * ============================================================================
 * VayuGrid Sensitive Receptors Registry Handler
 * ============================================================================
 *
 * @file receptors.js
 * @module api/v1/dispersion/receptors
 * @description
 * Returns geocoded sensitive human infrastructure (schools, pediatric/maternity
 * hospitals, transit hubs, informal settlements) across monitored cities.
 *
 * ROLE IN POLLUTION REDUCTION:
 * Enables the ULB Command Desk and citizen apps to perform spatial intersections
 * with active dispersion plumes, generating advance warning arrival timers and
 * prioritizing air-purification resources for high-density vulnerable populations.
 */

import { SENSITIVE_RECEPTORS } from '../../_lib/mockDatabase.js';

export default function handler(req, res) {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { city_id } = req.query;
  const normCityId = city_id === 'delhi_ncr' ? 'delhi' : city_id;
  const filtered = normCityId ? SENSITIVE_RECEPTORS.filter((r) => r.city_id === normCityId) : SENSITIVE_RECEPTORS;

  return res.status(200).json(filtered);
}
