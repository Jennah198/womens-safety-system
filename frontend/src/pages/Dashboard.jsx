import React, { useState, useEffect } from 'react'
import { getAlerts, resolveAlert } from '../services/api'
import AlertCard from '../components/AlertCard'
import AlertMap from '../components/AlertMap'

function StatCard({ label, value, color }) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e8eaf0',
        borderRadius: '14px',
        padding: '20px 24px',
        flex: 1,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: '12px',
          color: '#6b7280',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </p>
      <h2
        style={{
          margin: '6px 0 0',
          fontSize: '32px',
          fontWeight: 700,
          color: color || '#1a1a2e',
        }}
      >
        {value}
      </h2>
    </div>
  )
}

function Dashboard() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [pulse, setPulse] = useState(false)

  const fetchAlerts = async () => {
    try {
      const res = await getAlerts()
      setAlerts(res.data)
      setLastUpdated(new Date().toLocaleTimeString())
      setPulse(true)
      setTimeout(() => setPulse(false), 600)
    } catch (err) {
      console.error('Failed to fetch alerts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleResolve = async (id) => {
    await resolveAlert(id)
    fetchAlerts()
  }

  const filtered = alerts.filter((a) => {
    if (filter === 'active') return a.status === 'active'
    if (filter === 'high')
      return a.risk_level === 'high' && a.status === 'active'
    if (filter === 'resolved') return a.status === 'resolved'
    return true
  })

  const activeCount = alerts.filter((a) => a.status === 'active').length
  const highCount = alerts.filter(
    (a) => a.risk_level === 'high' && a.status === 'active',
  ).length
  const resolvedCount = alerts.filter((a) => a.status === 'resolved').length

  const tabStyle = (name) => ({
    padding: '7px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    background: filter === name ? '#1a1a2e' : 'transparent',
    color: filter === name ? '#ffffff' : '#6b7280',
    transition: 'all 0.15s',
  })

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* Top navbar */}
      <div
        style={{
          background: '#1a1a2e',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '60px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>🛡️</span>
          <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '16px' }}>
            SafeWatch
          </span>
          <span
            style={{ color: '#6b7280', fontSize: '13px', marginLeft: '8px' }}
          >
            Emergency Response System
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: pulse ? '#22c55e' : '#16a34a',
              transition: 'all 0.3s',
            }}
          />
          <span style={{ color: '#9ca3af', fontSize: '12px' }}>
            Live · {lastUpdated}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div
        style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 24px' }}
      >
        {/* Page title */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>
            Alert Dashboard
          </h1>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: '4px 0 0' }}>
            Real-time emergency monitoring · Auto-refreshes every 5 seconds
          </p>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <StatCard label="Total Alerts" value={alerts.length} />
          <StatCard label="Active" value={activeCount} color="#f59e0b" />
          <StatCard label="High Risk" value={highCount} color="#ef4444" />
          <StatCard label="Resolved" value={resolvedCount} color="#22c55e" />
        </div>

        {/* Map section */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e8eaf0',
            borderRadius: '14px',
            padding: '20px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px',
            }}
          >
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>
                Live Location Map
              </h2>
              <p
                style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  margin: '2px 0 0',
                }}
              >
                Showing {activeCount} active alert{activeCount !== 1 ? 's' : ''}
              </p>
            </div>
            <span
              style={{
                background: '#fef2f2',
                color: '#ef4444',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              🔴 LIVE
            </span>
          </div>
          <AlertMap alerts={alerts} />
        </div>

        {/* Alert feed */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e8eaf0',
            borderRadius: '14px',
            padding: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <h2 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>
              Alert Feed
            </h2>
            <div
              style={{
                display: 'flex',
                gap: '4px',
                background: '#f3f4f6',
                padding: '4px',
                borderRadius: '10px',
              }}
            >
              {['all', 'active', 'high', 'resolved'].map((f) => (
                <button
                  key={f}
                  style={tabStyle(f)}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <p
              style={{
                color: '#9ca3af',
                textAlign: 'center',
                padding: '40px 0',
              }}
            >
              Loading alerts...
            </p>
          )}
          {!loading && filtered.length === 0 && (
            <p
              style={{
                color: '#9ca3af',
                textAlign: 'center',
                padding: '40px 0',
              }}
            >
              No alerts in this category
            </p>
          )}
          {filtered.map((alert) => (
            <AlertCard key={alert.id} alert={alert} onResolve={handleResolve} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
