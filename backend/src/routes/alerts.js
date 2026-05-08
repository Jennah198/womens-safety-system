const express = require('express')
const router = express.Router()
const pool = require('../db/pool')

// POST /api/alerts — simulation/device sends an emergency alert
router.post('/', async (req, res) => {
  const { user_id, latitude, longitude } = req.body

  // Basic validation — SE thinking: never trust incoming data
  if (!user_id || !latitude || !longitude) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const result = await pool.query(
      `INSERT INTO alerts (user_id, latitude, longitude)
       VALUES ($1, $2, $3) RETURNING *`,
      [user_id, latitude, longitude],
    )

    // After creating alert, auto-generate a risk log
    const alert = result.rows[0]
    const riskScore = calculateRisk(latitude, longitude)
    const riskLevel =
      riskScore >= 70 ? 'high' : riskScore >= 40 ? 'medium' : 'low'

    await pool.query(
      `INSERT INTO risk_logs (alert_id, risk_level, risk_score, analysis_notes)
       VALUES ($1, $2, $3, $4)`,
      [alert.id, riskLevel, riskScore, `Auto-analyzed at trigger time`],
    )

    res.status(201).json({ success: true, alert })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/alerts — dashboard fetches all alerts
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, u.name as user_name, u.phone,
              r.risk_level, r.risk_score
       FROM alerts a
       JOIN users u ON a.user_id = u.id
       LEFT JOIN risk_logs r ON r.alert_id = a.id
       ORDER BY a.triggered_at DESC`,
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// PATCH /api/alerts/:id/resolve — mark alert as resolved
router.patch('/:id/resolve', async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE alerts SET status='resolved', resolved_at=NOW()
       WHERE id=$1 RETURNING *`,
      [req.params.id],
    )
    res.json({ success: true, alert: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Simple risk scoring logic — time of day + randomness simulating location risk
function calculateRisk(lat, lng) {
  const hour = new Date().getHours()
  const nightTime = hour >= 21 || hour <= 5
  const base = Math.floor(Math.random() * 40) + 30
  return nightTime ? Math.min(base + 30, 100) : base
}

module.exports = router
