#!/bin/bash

# Variables
API_URL="http://localhost:3000/api"
CONTENT_TYPE="Content-Type: application/json"

echo "===== POS API Testing Script ====="
echo ""

# Test root endpoint
echo "Testing root endpoint..."
curl -s $API_URL/..
echo -e "\n"

# Test Categories
echo "===== Categories Tests ====="

# Create category
echo "Creating test category..."
CATEGORY_RESPONSE=$(curl -s -X POST -H "$CONTENT_TYPE" -d '{"nombre": "Electrónicos", "descripcion": "Dispositivos electrónicos y accesorios"}' $API_URL/categories)
echo $CATEGORY_RESPONSE
echo -e "\n"

# Get the category ID from the response (this is a simple extraction, may need adjustments)
CATEGORY_ID=$(echo $CATEGORY_RESPONSE | grep -o '"categoria_id":[0-9]*' | cut -d':' -f2)

# Get all categories
echo "Getting all categories..."
curl -s $API_URL/categories
echo -e "\n"

# Get category by ID
echo "Getting category by ID $CATEGORY_ID..."
curl -s $API_URL/categories/$CATEGORY_ID
echo -e "\n"

# Update category
echo "Updating category..."
curl -s -X PUT -H "$CONTENT_TYPE" -d '{"nombre": "Electrónicos Actualizados", "descripcion": "Categoría actualizada de dispositivos electrónicos"}' $API_URL/categories/$CATEGORY_ID
echo -e "\n"

# Test Products
echo "===== Products Tests ====="

# Create product
echo "Creating test product..."
PRODUCT_RESPONSE=$(curl -s -X POST -H "$CONTENT_TYPE" -d "{\"codigo\": \"ELEC-001\", \"nombre\": \"Smartphone Galaxy S21\", \"descripcion\": \"Smartphone de última generación\", \"precio_compra\": 500.00, \"precio_venta\": 750.00, \"categoria_id\": $CATEGORY_ID, \"imagen_url\": \"https://example.com/images/galaxy-s21.jpg\"}" $API_URL/products)
echo $PRODUCT_RESPONSE
echo -e "\n"

# Get the product ID from the response
PRODUCT_ID=$(echo $PRODUCT_RESPONSE | grep -o '"producto_id":[0-9]*' | cut -d':' -f2)

# Get all products
echo "Getting all products..."
curl -s $API_URL/products
echo -e "\n"

# Get product by ID
echo "Getting product by ID $PRODUCT_ID..."
curl -s $API_URL/products/$PRODUCT_ID
echo -e "\n"

# Get products by category
echo "Getting products by category ID $CATEGORY_ID..."
curl -s $API_URL/products/category/$CATEGORY_ID
echo -e "\n"

# Update product
echo "Updating product..."
curl -s -X PUT -H "$CONTENT_TYPE" -d "{\"codigo\": \"ELEC-001\", \"nombre\": \"Smartphone Galaxy S21 Ultra\", \"descripcion\": \"Versión mejorada del smartphone\", \"precio_compra\": 600.00, \"precio_venta\": 900.00, \"categoria_id\": $CATEGORY_ID, \"imagen_url\": \"https://example.com/images/galaxy-s21-ultra.jpg\"}" $API_URL/products/$PRODUCT_ID
echo -e "\n"

echo "===== API Testing Completed ====="

# Uncomment these lines if you want to test deletion as well
# echo "Deleting product..."
# curl -s -X DELETE $API_URL/products/$PRODUCT_ID
# echo -e "\n"

# echo "Deleting category..."
# curl -s -X DELETE $API_URL/categories/$CATEGORY_ID
# echo -e "\n" 