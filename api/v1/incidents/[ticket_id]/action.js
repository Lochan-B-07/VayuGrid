export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { ticket_id } = req.query;
  const body = req.body || {};

  const actionType = body.action_type || body.type || 'DISPATCH_SMOG_GUN';
  const assignedUnit = body.assigned_unit || `UNIT-${actionType.replace('DISPATCH_', '')}-01`;

  return res.status(200).json({
    success: true,
    ticket_id: ticket_id || `VAYU-DEL-2026-101`,
    action_id: body.action_id || 'ACTION-SMOG-01',
    status: 'DISPATCHED',
    dispatch_time: new Date().toISOString(),
    eta_minutes: body.response_eta_minutes || 12,
    asset_callsign: assignedUnit,
    officer_badge_id: body.officer_badge_id || 'ULB-ENF-4412',
    message: `Statutory enforcement asset ${assignedUnit} mobilized. Target arrival in ${body.response_eta_minutes || 12} minutes.`,
  });
}
