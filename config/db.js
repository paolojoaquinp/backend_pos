const { Pool } = require('pg');
require('dotenv').config();

// Create a pool of connections
let pool;

// Check if a DATABASE_URL is provided (for production/deployment environments)
if (process.env.DATABASE_URL) {
  // Connect using the connection string/URI
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
  console.log('Connecting to PostgreSQL using URI');
} else {
  // Connect using individual parameters (for development)
  pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'pos_db',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
  });
  console.log('Connecting to PostgreSQL using individual parameters');
}

// Test the connection
pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
}; 