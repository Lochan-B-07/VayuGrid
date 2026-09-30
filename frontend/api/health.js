/**
 * ============================================================================
 * VayuGrid Serverless Health & Operational Status Probe
 * ============================================================================
 *
 * @file health.js
 * @module api/health
 * @description
 * Lightweight health check endpoint verifying the readiness and operational state
 * of the VayuGrid Serverless Atmospheric Engine on Vercel Edge/Serverless.
 *
 * PROBLEM STATEMENT & ARCHITECTURAL ROLE:
 * Used by external monitors and frontend status indicators to ensure the zero-cost
 * edge dispersion simulation microservice is live, responsive, and ready to ingest
 * citizen audits and compute statutory pollution mitigation cones.
 */

export default function handler(req, res) {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: 'healthy',
    service: 'VayuGrid Serverless Atmospheric Engine',
    version: '1.0.0',
    mode: 'zero-gcp-credit-edge-simulation',
    environment: 'production-serverless',
    timestamp: new Date().toISOString(),
    uptime_seconds: process.uptime ? Math.floor(process.uptime()) : 0,
    features: [
      'Irwin-Power-Law-Shear',
      'Briggs-Buoyant-Plume-Rise',
      'PBL-Lid-Reflection-Method-Of-Images',
      'CPCB-Statutory-Isopleths',
      'Open-Meteo-Live-Radiosonde-Feeds',
      '6-Language-Vernacular-Advisories',
    ],
  });
}
