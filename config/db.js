const { Pool } = require('pg');
require('dotenv').config();

// Configure the Node.js environment to handle certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Create a pool of connections
let pool;

// Check if a DATABASE_URL is provided (for production/deployment environments)
if (process.env.DATABASE_URL) {
  // Connect using the connection string/URI
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Disable SSL certificate validation for cloud hosting
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  // Connect using individual parameters (for development)
  pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'pos_db',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
  });
}

// Test the connection
pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

// Handle connection errors without crashing
pool.on('error', (err) => {
  console.error('Database connection error:', err.message);
});

// Simple database initialization check
const initDatabase = async () => {
  try {
    await pool.query('SELECT NOW()');
  } catch (err) {
    console.error('Database initialization error:', err.message);
  }
};

// Run initialization
initDatabase();

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
}; 