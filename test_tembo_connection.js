const { Client } = require('pg');
require('dotenv').config();

async function testTemboConnection() {
  console.log('=== Tembo.io PostgreSQL Connection Test ===');
  console.log('Testing connection to Tembo.io PostgreSQL database...');
  
  // Extract connection details from the DATABASE_URL for diagnostic purposes
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log('Connection Details:');
    console.log(`- Host: ${url.hostname}`);
    console.log(`- Port: ${url.port}`);
    console.log(`- Database: ${url.pathname.substring(1)}`);
    console.log(`- Username: ${url.username}`);
    console.log(`- SSL Mode: ${url.searchParams.get('sslmode') || 'Not specified'}`);
  } catch (e) {
    console.log('Could not parse DATABASE_URL, please check its format');
  }

  // Create a PostgreSQL client using Client (not Pool) for diagnostic clarity
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    // Set shorter timeout for faster feedback
    connectionTimeoutMillis: 10000, 
    query_timeout: 10000
  });
  
  console.log('\nAttempting to connect...');
  
  try {
    // Connect to the database
    await client.connect();
    console.log('✅ Connection successful!');
    
    // Test a simple query
    console.log('\nTesting query execution...');
    const timeResult = await client.query('SELECT NOW() as time');
    console.log(`✅ Query successful - Database server time: ${timeResult.rows[0].time}`);
    
    // Get database version
    const versionResult = await client.query('SELECT version() as version');
    console.log(`\nDatabase Version: ${versionResult.rows[0].version}`);
    
    // Check if we have privileges to list tables
    try {
      console.log('\nChecking available tables...');
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
      `);
      
      if (tablesResult.rows.length === 0) {
        console.log('No tables found in public schema. Database appears to be empty.');
        console.log('You will need to create the required tables using the SQL script.');
      } else {
        console.log(`Found ${tablesResult.rows.length} tables:`);
        tablesResult.rows.forEach((row, idx) => {
          console.log(`${idx + 1}. ${row.table_name}`);
        });
      }
    } catch (err) {
      console.log('❌ Could not list tables. Limited permissions may be in effect.');
      console.log(`   Error: ${err.message}`);
    }
    
    console.log('\n✅ All connection tests passed.');
  } catch (error) {
    console.log('❌ Connection failed!');
    console.log(`Error: ${error.message}`);
    
    // Provide specific troubleshooting advice
    console.log('\nTroubleshooting suggestions:');
    
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      console.log('1. Network connectivity issue or incorrect host:');
      console.log('   - Check if the host is correct in your DATABASE_URL');
      console.log('   - Ensure your network allows connections to Tembo.io (port 5432)');
      console.log('   - Check if Tembo.io has IP whitelisting enabled and add your IP');
    }
    
    if (error.code === 'ENOTFOUND') {
      console.log('1. DNS resolution failed:');
      console.log('   - The hostname cannot be resolved. Check if the host is correct in your DATABASE_URL');
    }
    
    if (error.message.includes('password authentication failed')) {
      console.log('1. Authentication issue:');
      console.log('   - Username or password in your DATABASE_URL is incorrect');
      console.log('   - Check the credentials provided by Tembo.io dashboard');
    }
    
    if (error.message.includes('certificate')) {
      console.log('1. SSL/TLS issue:');
      console.log('   - Add "?sslmode=require" to your DATABASE_URL');
      console.log('   - We are already setting rejectUnauthorized: false to accept self-signed certificates');
    }
    
    console.log('\nGeneral recommendations:');
    console.log('1. Copy the fresh connection string from Tembo.io dashboard');
    console.log('2. Check if you can connect using psql command: psql "YOUR_CONNECTION_STRING"');
    console.log('3. Verify Tembo.io service status on their status page');
  } finally {
    // Close the client
    try {
      await client.end();
      console.log('Client disconnected.');
    } catch (e) {
      // Ignore errors on closing
    }
  }
}

testTemboConnection().catch(err => {
  console.error('Unhandled error in the test script:', err);
}); 