const { Pool } = require('pg');
require('dotenv').config();

// Function to test database connection
async function testConnection() {
  console.log('Attempting to connect to the database...');
  console.log(`Connection string: ${maskPassword(process.env.DATABASE_URL)}`);
  
  // Create a connection pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { 
      rejectUnauthorized: false
    }
  });

  try {
    // Try a simple query
    console.log('Testing query execution...');
    const result = await pool.query('SELECT NOW() as current_time');
    console.log('Connection successful!');
    console.log('Current database time:', result.rows[0].current_time);
    
    // Try to query for database info
    try {
      const dbInfo = await pool.query(`
        SELECT current_database() as database, 
               current_user as user,
               version() as version`);
      console.log('\nDatabase Information:');
      console.log('- Database:', dbInfo.rows[0].database);
      console.log('- User:', dbInfo.rows[0].user);
      console.log('- Version:', dbInfo.rows[0].version);
    } catch (e) {
      console.log('Could not retrieve all database information');
    }
    
    // List the first 5 tables if possible
    try {
      const tablesResult = await pool.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        LIMIT 5`);
      
      console.log('\nDatabase Tables (limited to 5):');
      if (tablesResult.rows.length === 0) {
        console.log('No tables found in the public schema.');
      } else {
        tablesResult.rows.forEach(row => {
          console.log('- ' + row.table_name);
        });
      }
    } catch (e) {
      console.log('Could not list tables:', e.message);
    }
    
  } catch (error) {
    console.error('Connection failed:');
    console.error(error.message);
    
    // Provide helpful troubleshooting info
    console.log('\nTroubleshooting Steps:');
    console.log('1. Verify your DATABASE_URL is correct');
    console.log('2. Check if your IP is whitelisted in Tembo.io firewall settings');
    console.log('3. Ensure the database user has correct permissions');
    console.log('4. Verify that your database server is running');
    console.log('5. If using SSL, ensure it\'s properly configured');
    
    // For specific Tembo.io advice
    console.log('\nSpecific to Tembo.io:');
    console.log('- Check your Tembo dashboard for any service interruptions');
    console.log('- Verify the connection string provided in your Tembo dashboard');
    console.log('- Ensure you\'ve added your IP to the allowed connections in Tembo');
  } finally {
    // Close pool
    await pool.end();
    console.log('\nConnection pool closed.');
  }
}

// Utility function to mask password in the connection string for logging
function maskPassword(connectionString) {
  if (!connectionString) return 'No connection string provided';
  
  try {
    const urlObj = new URL(connectionString);
    if (urlObj.password) {
      urlObj.password = '********';
    }
    return urlObj.toString();
  } catch (e) {
    return 'Invalid connection string format';
  }
}

// Run the test
testConnection(); 