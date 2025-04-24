const db = require('../../config/db');

class Category {
  // Get all categories
  static async getAllCategories() {
    const query = 'SELECT * FROM categorias ORDER BY nombre';
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get category by ID
  static async getCategoryById(id) {
    const query = 'SELECT * FROM categorias WHERE categoria_id = $1';
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Create a new category
  static async createCategory(data) {
    const { nombre, descripcion } = data;
    const query = 'INSERT INTO categorias (nombre, descripcion) VALUES ($1, $2) RETURNING *';
    try {
      const result = await db.query(query, [nombre, descripcion]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update a category
  static async updateCategory(id, data) {
    const { nombre, descripcion } = data;
    const query = 'UPDATE categorias SET nombre = $1, descripcion = $2 WHERE categoria_id = $3 RETURNING *';
    try {
      const result = await db.query(query, [nombre, descripcion, id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete a category
  static async deleteCategory(id) {
    const query = 'DELETE FROM categorias WHERE categoria_id = $1 RETURNING *';
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Category; 