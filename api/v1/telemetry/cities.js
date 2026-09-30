import { CITIES } from '../../_lib/mockDatabase.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
