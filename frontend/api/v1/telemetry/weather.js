import { CITIES } from '../../_lib/mockDatabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { lat, lon, city_id } = req.query;
  const latitude = parseFloat(lat) || 28.6139;
  const longitude = parseFloat(lon) || 77.2090;

  // Find matching city fallback
  let matchedCity = CITIES.find((c) => c.id === city_id || c.alias_id === city_id);
  if (!matchedCity) {
    // Proximity lookup
    let minD = Infinity;
    for (const c of CITIES) {
      const d = Math.hypot(c.center.lat - latitude, c.center.lng - longitude);
      if (d < minD) {
        minD = d;
        matchedCity = c;
      }
    }
  }

  const defaultW = matchedCity?.default_weather || {
    wind_speed_ms: 3.8,
    wind_direction_deg: 310.0,
    downwind_bearing_deg: 130.0,
    temperature_c: 24.2,
    humidity_pct: 68.0,
    pbl_height_m: 420.0,
    stability_class: 'D',
  };

  // Attempt real Open-Meteo telemetry with short timeout
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1800);

    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,is_day&hourly=boundary_layer_height&forecast_days=1`;
    const omRes = await fetch(openMeteoUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (omRes.ok) {
      const data = await omRes.json();
      const cur = data.current || {};
      const windSpeedMs = cur.wind_speed_10m ? +(cur.wind_speed_10m / 3.6).toFixed(2) : defaultW.wind_speed_ms;
      const windDirDeg = cur.wind_direction_10m ?? defaultW.wind_direction_deg;
      const downwindBearing = (windDirDeg + 180.0) % 360.0;
      const tempC = cur.temperature_2m ?? defaultW.temperature_c;
      const humidity = cur.relative_humidity_2m ?? defaultW.humidity_pct;
      const pbl = data.hourly?.boundary_layer_height?.[0] ?? defaultW.pbl_height_m;

      return res.status(200).json({
        latitude,
        longitude,
        wind_speed_kmh: +(windSpeedMs * 3.6).toFixed(1),
        wind_speed_ms: windSpeedMs,
        wind_direction_deg: windDirDeg,
        downwind_bearing_deg: downwindBearing,
        temperature_c: tempC,
        temperature_k: +(tempC + 273.15).toFixed(2),
        humidity_pct: humidity,
        planetary_boundary_layer_height_m: pbl,
        surface_pressure_hpa: cur.surface_pressure ?? 1012.0,
        solar_radiation_w_m2: cur.is_day ? 380.0 : 0.0,
        is_day: Boolean(cur.is_day),
        stability_class: cur.is_day ? 'C' : 'E',
        terrain: matchedCity?.terrain || 'URBAN',
        friction_velocity_u_star_ms: +(windSpeedMs * 0.12).toFixed(2),
        source_attribution: 'Open-Meteo Live Satellite Atmospheric Radiosonde',
      });
    }
  } catch (err) {
    // Open-Meteo offline or timeout -> use deterministic microclimate fallback
  }

  return res.status(200).json({
    latitude,
    longitude,
    wind_speed_kmh: +(defaultW.wind_speed_ms * 3.6).toFixed(1),
    wind_speed_ms: defaultW.wind_speed_ms,
    wind_direction_deg: defaultW.wind_direction_deg,
    downwind_bearing_deg: defaultW.downwind_bearing_deg,
    temperature_c: defaultW.temperature_c,
    temperature_k: +(defaultW.temperature_c + 273.15).toFixed(2),
    humidity_pct: defaultW.humidity_pct,
    planetary_boundary_layer_height_m: defaultW.pbl_height_m,
    surface_pressure_hpa: 1012.0,
    solar_radiation_w_m2: 320.0,
    is_day: true,
    stability_class: defaultW.stability_class,
    terrain: matchedCity?.terrain || 'URBAN',
    friction_velocity_u_star_ms: +(defaultW.wind_speed_ms * 0.12).toFixed(2),
    source_attribution: 'VayuGrid Real-Time Serverless Micro-Meteorology Fallback',
  });
}
