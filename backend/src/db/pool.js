const { Pool } = require('pg')
require('dotenv').config()

// Pool = a set of reusable database connections
// More efficient than opening a new connection every request
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

// Test the connection when server starts
pool.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message)
  } else {
    console.log('Connected to PostgreSQL successfully')
  }
})

module.exports = pool
