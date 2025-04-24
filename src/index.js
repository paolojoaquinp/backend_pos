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
    // Check if tables exist
    const tablesResult = await db.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('categorias', 'productos', 'usuarios', 'roles', 'usuario_roles', 'ventas', 'detalle_ventas')
    `);
    
    const existingTables = tablesResult.rows.map(row => row.table_name);
    console.log('Existing tables:', existingTables.join(', ') || 'None');
    
    // If not all tables exist, try to create them
    const requiredTables = ['categorias', 'productos', 'usuarios', 'roles', 'usuario_roles', 'ventas', 'detalle_ventas'];
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));
    
    if (missingTables.length > 0) {
      console.log('Missing tables:', missingTables.join(', '));
      console.log('Attempting to create database tables...');
      
      // Read the SQL script
      const sqlScript = fs.readFileSync(path.join(__dirname, '../db/db.sql'), 'utf8');
      
      // Execute the SQL script
      await db.query(sqlScript);
      console.log('Database tables created successfully');
    } else {
      console.log('All required database tables exist');
    }
  } catch (error) {
    console.error('Error initializing database tables:', error.message);
    console.log('Please check your database configuration and try again');
  }
};

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    time: new Date(), 
    env: process.env.NODE_ENV,
    database: process.env.DATABASE_URL ? 'Using connection URI' : 'Using individual parameters'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to POS API' });
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Initialize database tables
  await initializeDatabaseTables();
});

module.exports = app;
