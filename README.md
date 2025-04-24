# POS Backend Application

A backend REST API for a Point of Sale (POS) system built with Express.js and PostgreSQL.

## Features

- CRUD operations for products and categories
- RESTful API endpoints
- PostgreSQL database integration

## Database Schema

The database consists of several tables including:
- Products
- Categories
- Users
- Roles
- Sales
- Sales Details

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- PostgreSQL

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   # Database Configuration (individual parameters)
   DB_USER=your_db_user
   DB_HOST=localhost
   DB_NAME=pos_db
   DB_PASSWORD=your_password
   DB_PORT=5432
   
   # Alternative: Database Connection URI
   # Uncomment and set this to use a connection string instead of individual parameters
   # DATABASE_URL=postgresql://username:password@hostname:port/database_name
   
   # Server Configuration
   PORT=3000
   
   # Environment
   NODE_ENV=development
   ```

   **Using PostgreSQL URI**: 
   - If you're connecting to a remote PostgreSQL instance or prefer using a connection URI, set the `DATABASE_URL` variable in the `.env` file.
   - The URI format is: `postgresql://username:password@hostname:port/database_name`
   - When `DATABASE_URL` is set, it takes precedence over the individual connection parameters.
   - For production environments, set `NODE_ENV=production` to enable SSL.

4. Set up your PostgreSQL database:
   - Create a new database named `pos_db`
   - Run the SQL script in `db/db.sql` to create the tables

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a product by ID
- `GET /api/products/category/:categoryId` - Get products by category
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get a category by ID
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

## Testing the API

### Using Postman

1. Import the `postman_collection.json` file into Postman
2. The collection includes folders for:
   - Categories CRUD operations
   - Products CRUD operations
   - Test data insertion

### Using cURL

Run the included bash script to test the API endpoints:

```bash
chmod +x test_api.sh
./test_api.sh
```

This script will:
- Create a test category
- List all categories
- Get a specific category
- Update the category
- Create a test product
- List all products
- Get a specific product
- Get products by category
- Update the product

## Deployment

When deploying to production:

1. Set the `DATABASE_URL` environment variable with your PostgreSQL connection string
2. Set `NODE_ENV=production` to enable SSL for the database connection
3. Ensure your database has all the required tables created using the SQL script

## License

This project is licensed under the MIT License - see the LICENSE file for details. 