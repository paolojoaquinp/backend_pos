const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import database configuration
const db = require('../config/db');

// Import routes
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Check database and initialize tables if needed
const initializeDatabaseTables = async () => {
  try {
    // Verify connection
    await db.query('SELECT 1');
    
    // Check if tables exist
    const tablesResult = await db.query(`
      SELECT COUNT(*) as table_count
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('categorias', 'productos')
    `);
    
    const tableCount = parseInt(tablesResult.rows[0].table_count);
    
    // If tables don't exist, create them
    if (tableCount < 2) {
      try {
        // Read the SQL script
        const sqlScript = fs.readFileSync(path.join(__dirname, '../db/db.sql'), 'utf8');
        
        // Execute the SQL script
        await db.query(sqlScript);
        console.log('Database initialized successfully');
      } catch (initError) {
        console.error('Database initialization failed:', initError.message);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error.message);
    return false;
  }
};

// Middleware to handle database-related errors
app.use((req, res, next) => {
  if (req.path === '/health') {
    // Skip database check for health endpoint
    return next();
  }
  
  db.query('SELECT 1')
    .then(() => next())
    .catch(err => {
      console.error('Database error during request:', err.message);
      res.status(503).json({ 
        success: false, 
        error: 'Database service unavailable' 
      });
    });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  db.query('SELECT 1')
    .then(() => {
      res.json({ 
        status: 'ok',
        database: 'connected', 
        time: new Date().toISOString()
      });
    })
    .catch(err => {
      res.json({ 
        status: 'warning',
        database: 'disconnected',
        error: err.message,
        time: new Date().toISOString()
      });
    });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to POS API' });
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Initialize database tables silently
  const dbInitialized = await initializeDatabaseTables();
  if (!dbInitialized) {
    console.log('Server running without database. Some features may not work.');
  }
});

module.exports = app;
