const Category = require('../models/categoryModel');

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getAllCategories();
    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Error getting categories:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const category = await Category.getCategoryById(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error getting category:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create a new category
const createCategory = async (req, res) => {
  try {
    // Validate request
    if (!req.body.nombre) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a name for the category'
      });
    }
    
    const newCategory = await Category.createCategory(req.body);
    
    return res.status(201).json({
      success: true,
      data: newCategory
    });
  } catch (error) {
    console.error('Error creating category:', error);
    if (error.code === '23505') { // Unique violation in PostgreSQL
      return res.status(400).json({
        success: false,
        error: 'A category with this name already exists'
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Check if category exists
    const category = await Category.getCategoryById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    // Validate request
    if (!req.body.nombre) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a name for the category'
      });
    }
    
    const updatedCategory = await Category.updateCategory(id, req.body);
    
    return res.status(200).json({
      success: true,
      data: updatedCategory
    });
  } catch (error) {
    console.error('Error updating category:', error);
    if (error.code === '23505') { // Unique violation in PostgreSQL
      return res.status(400).json({
        success: false,
        error: 'A category with this name already exists'
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Check if category exists
    const category = await Category.getCategoryById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    const deletedCategory = await Category.deleteCategory(id);
    
    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: deletedCategory
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    // Foreign key constraint error (if products are using this category)
    if (error.code === '23503') {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete category because it is being used by products'
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
}; 