import { SENSITIVE_RECEPTORS } from '../../_lib/mockDatabase.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { city_id } = req.query;
  const filtered = city_id ? SENSITIVE_RECEPTORS.filter((r) => r.city_id === city_id) : SENSITIVE_RECEPTORS;

  return res.status(200).json(filtered);
}
