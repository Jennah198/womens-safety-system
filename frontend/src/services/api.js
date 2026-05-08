import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
})

export const getAlerts = () => API.get('/alerts')
export const resolveAlert = (id) => API.patch(`/alerts/${id}/resolve`)
