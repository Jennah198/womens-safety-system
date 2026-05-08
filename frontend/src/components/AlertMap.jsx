import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix leaflet's default icon bug in React
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

function AlertMap({ alerts }) {
  // Only show active alerts on map
  const activeAlerts = alerts.filter((a) => a.status === 'active')

  // Default center: Addis Ababa
  const center =
    activeAlerts.length > 0
      ? [
          parseFloat(activeAlerts[0].latitude),
          parseFloat(activeAlerts[0].longitude),
        ]
      : [9.03, 38.74]

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '400px', width: '100%', borderRadius: '10px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="OpenStreetMap"
      />
      {activeAlerts.map((alert) => (
        <Marker
          key={alert.id}
          position={[parseFloat(alert.latitude), parseFloat(alert.longitude)]}
        >
          <Popup>
            <strong>{alert.user_name}</strong>
            <br />
            Risk: {alert.risk_level}
            <br />
            Score: {alert.risk_score}/100
            <br />
            {new Date(alert.triggered_at).toLocaleString()}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default AlertMap
