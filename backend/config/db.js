// config/db.js
// PostgreSQL connection pool using the 'pg' package
const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool (reuses connections for better performance)
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'tasktracker',
  user: process.env.DB_USER || 'kalyan',
  password: process.env.DB_PASSWORD,
});

// Test the connection when the server starts
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to PostgreSQL:', err.message);
  } else {
    console.log('✅ Connected to PostgreSQL database');
    release(); // Release the client back to the pool
  }
});

module.exports = pool;
