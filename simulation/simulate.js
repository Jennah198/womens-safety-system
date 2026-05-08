const axios = require('axios')

const API_URL = 'http://localhost:5000/api/alerts'

const users = [
  { id: 1, name: 'Sara Ahmed' },
  { id: 2, name: 'Meron Tadesse' },
  { id: 3, name: 'Hana Girma' },
  { id: 4, name: 'Tigist Bekele' },
  { id: 5, name: 'Selam Haile' },
]

const locations = [
  { lat: 9.03, lng: 38.74, area: 'Bole' },
  { lat: 9.0105, lng: 38.7612, area: 'Kirkos' },
  { lat: 9.0478, lng: 38.7342, area: 'Lideta' },
  { lat: 8.9806, lng: 38.7578, area: 'Nifas Silk' },
  { lat: 9.02, lng: 38.8, area: 'Yeka' },
  { lat: 9.005, lng: 38.765, area: 'Akaki' },
  { lat: 9.055, lng: 38.76, area: 'Kolfe' },
]

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

async function triggerAlert() {
  const user = randomItem(users)
  const location = randomItem(locations)

  const payload = {
    user_id: user.id,
    latitude: location.lat + (Math.random() * 0.01 - 0.005),
    longitude: location.lng + (Math.random() * 0.01 - 0.005),
  }

  try {
    const res = await axios.post(API_URL, payload)
    console.log(`🚨 Alert from ${user.name} in ${location.area}`)
    console.log(
      `   ID: ${res.data.alert.id} | Location: ${payload.latitude.toFixed(4)}, ${payload.longitude.toFixed(4)}`,
    )
    console.log('---')
  } catch (err) {
    console.error('❌ Failed:', err.message)
  }
}

async function runSimulation() {
  console.log('🚨 Simulation running — random user alerts every 8 seconds')
  console.log('   Press Ctrl+C to stop\n')
  triggerAlert()
  setInterval(triggerAlert, 8000)
}

const mode = process.argv[2]
if (mode === 'once') {
  triggerAlert()
} else {
  runSimulation()
}
