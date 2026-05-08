const express = require('express')
const cors = require('cors')
require('dotenv').config()

const alertRoutes = require('./routes/alerts')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// All alert routes are prefixed with /api/alerts
app.use('/api/alerts', alertRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Safety System API is running' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
