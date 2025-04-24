const Product = require('../models/productModel');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAllProducts();
    return res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error getting products:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await Product.getProductById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error getting product:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  try {
    // Basic validation
    if (!req.body.nombre || !req.body.precio_compra || !req.body.precio_venta) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, purchase price, and selling price'
      });
    }
    
    // Generate a code if not provided
    if (!req.body.codigo) {
      req.body.codigo = 'PROD-' + Date.now().toString().slice(-6);
    }
    
    const newProduct = await Product.createProduct(req.body);
    
    return res.status(201).json({
      success: true,
      data: newProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    if (error.code === '23505') { // Unique violation in PostgreSQL
      return res.status(400).json({
        success: false,
        error: 'A product with this code already exists'
      });
    }
    if (error.code === '23503') { // Foreign key constraint error
      return res.status(400).json({
        success: false,
        error: 'Invalid category ID'
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Check if product exists
    const product = await Product.getProductById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    // Basic validation
    if (!req.body.nombre || !req.body.precio_compra || !req.body.precio_venta) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, purchase price, and selling price'
      });
    }
    
    const updatedProduct = await Product.updateProduct(id, {
      codigo: req.body.codigo || product.codigo,
      nombre: req.body.nombre,
      descripcion: req.body.descripcion || product.descripcion,
      precio_compra: req.body.precio_compra,
      precio_venta: req.body.precio_venta,
      categoria_id: req.body.categoria_id || product.categoria_id,
      imagen_url: req.body.imagen_url || product.imagen_url
    });
    
    return res.status(200).json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    if (error.code === '23505') { // Unique violation in PostgreSQL
      return res.status(400).json({
        success: false,
        error: 'A product with this code already exists'
      });
    }
    if (error.code === '23503') { // Foreign key constraint error
      return res.status(400).json({
        success: false,
        error: 'Invalid category ID'
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Check if product exists
    const product = await Product.getProductById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    const deletedProduct = await Product.deleteProduct(id);
    
    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: deletedProduct
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    // Foreign key constraint error (if the product is being used in sales)
    if (error.code === '23503') {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete product because it is being used in sales'
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.categoryId);
    const products = await Product.getProductsByCategory(categoryId);
    
    return res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error getting products by category:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
}; 