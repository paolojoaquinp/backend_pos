const db = require('../../config/db');

class Product {
  // Get all products
  static async getAllProducts() {
    const query = `
      SELECT p.*, c.nombre as categoria_nombre 
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.categoria_id
      ORDER BY p.nombre
    `;
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get product by ID
  static async getProductById(id) {
    const query = `
      SELECT p.*, c.nombre as categoria_nombre 
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.categoria_id
      WHERE p.producto_id = $1
    `;
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Create a new product
  static async createProduct(data) {
    const { 
      codigo, 
      nombre, 
      descripcion, 
      precio_compra, 
      precio_venta, 
      categoria_id, 
      imagen_url 
    } = data;
    
    const query = `
      INSERT INTO productos 
        (codigo, nombre, descripcion, precio_compra, precio_venta, categoria_id, imagen_url) 
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
    `;
    
    try {
      const result = await db.query(query, [
        codigo, 
        nombre, 
        descripcion, 
        precio_compra, 
        precio_venta, 
        categoria_id, 
        imagen_url
      ]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update a product
  static async updateProduct(id, data) {
    const { 
      codigo, 
      nombre, 
      descripcion, 
      precio_compra, 
      precio_venta, 
      categoria_id, 
      imagen_url 
    } = data;
    
    const query = `
      UPDATE productos 
      SET 
        codigo = $1, 
        nombre = $2, 
        descripcion = $3, 
        precio_compra = $4, 
        precio_venta = $5, 
        categoria_id = $6, 
        imagen_url = $7 
      WHERE producto_id = $8 
      RETURNING *
    `;
    
    try {
      const result = await db.query(query, [
        codigo, 
        nombre, 
        descripcion, 
        precio_compra, 
        precio_venta, 
        categoria_id, 
        imagen_url, 
        id
      ]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete a product
  static async deleteProduct(id) {
    const query = 'DELETE FROM productos WHERE producto_id = $1 RETURNING *';
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get products by category
  static async getProductsByCategory(categoryId) {
    const query = `
      SELECT p.*, c.nombre as categoria_nombre 
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.categoria_id
      WHERE p.categoria_id = $1
      ORDER BY p.nombre
    `;
    try {
      const result = await db.query(query, [categoryId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Product; 