import React from 'react'

const riskConfig = {
  high: { color: '#ef4444', bg: '#fef2f2', label: 'HIGH' },
  medium: { color: '#f59e0b', bg: '#fffbeb', label: 'MEDIUM' },
  low: { color: '#22c55e', bg: '#f0fdf4', label: 'LOW' },
}

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

function AlertCard({ alert, onResolve }) {
  const risk = riskConfig[alert.risk_level] || riskConfig.low
  const isResolved = alert.status === 'resolved'

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e8eaf0',
        borderLeft: `4px solid ${isResolved ? '#d1d5db' : risk.color}`,
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '10px',
        opacity: isResolved ? 0.65 : 1,
        transition: 'all 0.2s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        {/* Left — user info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: isResolved ? '#e5e7eb' : risk.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 700,
              color: isResolved ? '#9ca3af' : risk.color,
            }}
          >
            {alert.user_name?.charAt(0)}
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '15px', margin: 0 }}>
              {alert.user_name}
            </p>
            <p
              style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0' }}
            >
              {alert.phone}
            </p>
          </div>
        </div>

        {/* Right — risk badge + time */}
        <div style={{ textAlign: 'right' }}>
          <span
            style={{
              background: isResolved ? '#f3f4f6' : risk.bg,
              color: isResolved ? '#6b7280' : risk.color,
              border: `1px solid ${isResolved ? '#e5e7eb' : risk.color}22`,
              padding: '3px 10px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.5px',
            }}
          >
            {isResolved ? 'RESOLVED' : `${risk.label} RISK`}
          </span>
          <p style={{ fontSize: '11px', color: '#9ca3af', margin: '4px 0 0' }}>
            {timeAgo(alert.triggered_at)}
          </p>
        </div>
      </div>

      {/* Location + score row */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginTop: '12px',
          padding: '10px 12px',
          background: '#f9fafb',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#4b5563',
        }}
      >
        <span>
          📍 {parseFloat(alert.latitude).toFixed(4)},{' '}
          {parseFloat(alert.longitude).toFixed(4)}
        </span>
        <span>
          ⚡ Score: <strong>{alert.risk_score}/100</strong>
        </span>
        <span>🕐 {new Date(alert.triggered_at).toLocaleTimeString()}</span>
      </div>

      {/* Resolve button */}
      {!isResolved && (
        <button
          onClick={() => onResolve(alert.id)}
          style={{
            marginTop: '12px',
            background: 'transparent',
            color: '#22c55e',
            border: '1px solid #22c55e',
            padding: '6px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            transition: 'all 0.15s',
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#22c55e'
            e.target.style.color = '#fff'
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'transparent'
            e.target.style.color = '#22c55e'
          }}
        >
          ✓ Mark Resolved
        </button>
      )}
    </div>
  )
}

export default AlertCard
