const { Pool } = require('pg');
require('dotenv').config();

// Create a pool of connections
let pool;

// Configure the Node.js environment to handle certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Check if a DATABASE_URL is provided (for production/deployment environments)
if (process.env.DATABASE_URL) {
  // For Tembo.io and similar services with self-signed certificates
  
  // Connect using the connection string/URI
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Disable SSL certificate validation for Tembo.io
    ssl: {
      rejectUnauthorized: false
    }
  });
  console.log('Connecting to PostgreSQL using URI with SSL config');
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
  console.error('Database connection error:', err.message);
  // We do not exit the process on error to prevent app crashes
  // process.exit(-1);
});

// Check database tables on startup
const checkDbTables = async () => {
  try {
    console.log('Checking database tables...');
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    if (result.rows.length === 0) {
      console.log('Warning: No tables found in the database. You might need to run the SQL script.');
    } else {
      console.log(`Found ${result.rows.length} tables in the database.`);
      const tableNames = result.rows.map(row => row.table_name).join(', ');
      console.log(`Tables: ${tableNames}`);
    }
  } catch (err) {
    console.error('Error checking database tables:', err.message);
  }
};

// Attempt to connect and check database structure
const initDatabase = async () => {
  try {
    // Basic connection test
    const res = await pool.query('SELECT NOW()');
    console.log('Database connection successful:', res.rows[0].now);
    
    // Check tables
    await checkDbTables();
  } catch (err) {
    console.error('Database initialization error:', err.message);
    console.log('\nTroubleshooting steps:');
    console.log('1. Check if your database credentials are correct in .env file');
    console.log('2. For Tembo.io connections:');
    console.log('   - Ensure your IP is whitelisted in Tembo.io firewall settings');
    console.log('   - Check if you can connect using another client like psql or pgAdmin');
    console.log('   - Verify the connection URL provided by Tembo.io dashboard');
    console.log('3. Try creating the database tables using the SQL script in db/db.sql');
  }
};

// Run initialization
initDatabase();

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
}; 