const express = require('express');
const { db } = require('../config/db');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

function parseProduct(p) {
  if (!p) return null;
  let specs = [];
  try {
    specs = typeof p.specs_json === 'string' ? JSON.parse(p.specs_json || '[]') : p.specs_json;
  } catch (e) {
    specs = [];
  }
  return {
    ...p,
    specs,
    is_featured: Boolean(p.is_featured)
  };
}

// GET /api/products - Liste des produits avec filtres & recherche
router.get('/', (req, res) => {
  const { category, search, featured, limit, sort } = req.query;

  let query = `
    SELECT p.*, c.name AS category_name, c.icon AS category_icon
    FROM products p
    LEFT JOIN categories c ON c.slug = p.category_slug
    WHERE 1=1
  `;
  const params = [];

  if (category && category !== 'all') {
    query += ' AND p.category_slug = ?';
    params.push(category);
  }

  if (search && search.trim()) {
    query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
    const term = `%${search.trim()}%`;
    params.push(term, term);
  }

  if (featured === 'true' || featured === '1') {
    query += ' AND p.is_featured = 1';
  }

  // Tri
  if (sort === 'price_asc') {
    query += ' ORDER BY p.price ASC';
  } else if (sort === 'price_desc') {
    query += ' ORDER BY p.price DESC';
  } else if (sort === 'name_asc') {
    query += ' ORDER BY p.name ASC';
  } else {
    query += ' ORDER BY p.is_featured DESC, p.created_at DESC';
  }

  if (limit && Number(limit) > 0) {
    query += ' LIMIT ?';
    params.push(Number(limit));
  }

  const products = db.prepare(query).all(...params);
  res.json({
    count: products.length,
    products: products.map(parseProduct)
  });
});

// GET /api/products/:id - Détail d'un produit
router.get('/:id', (req, res) => {
  const product = db.prepare(`
    SELECT p.*, c.name AS category_name, c.icon AS category_icon
    FROM products p
    LEFT JOIN categories c ON c.slug = p.category_slug
    WHERE p.id = ?
  `).get(Number(req.params.id));

  if (!product) {
    return res.status(404).json({ error: 'Produit non trouvé.' });
  }

  res.json({ product: parseProduct(product) });
});

// POST /api/products (Protected)
router.post('/', authenticateAdmin, (req, res) => {
  const { name, category_slug, description, price, currency, min_order_qty, specs, image_url, stock, is_featured } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Le nom du produit est requis.' });
  }

  const defaultImg = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&fit=crop';
  const finalImg = (image_url && image_url.trim()) ? image_url.trim() : defaultImg;
  const finalCategory = category_slug || 'textile';

  const specsJson = Array.isArray(specs) ? JSON.stringify(specs) : (typeof specs === 'string' ? specs : '[]');

  const result = db.prepare(`
    INSERT INTO products (name, category_slug, description, price, currency, min_order_qty, specs_json, image_url, stock, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    name.trim(),
    finalCategory,
    description || '',
    Number(price) || 0,
    currency || 'EUR',
    Number(min_order_qty) || 1,
    specsJson,
    finalImg,
    Number(stock) || 100,
    is_featured ? 1 : 0
  );

  const created = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({
    message: 'Produit ajouté avec succès.',
    product: parseProduct(created)
  });
});

// PUT /api/products/:id (Protected)
router.put('/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(id));
  if (!existing) {
    return res.status(404).json({ error: 'Produit introuvable.' });
  }

  const { name, category_slug, description, price, currency, min_order_qty, specs, image_url, stock, is_featured } = req.body;

  const specsJson = Array.isArray(specs) ? JSON.stringify(specs) : (typeof specs === 'string' ? specs : existing.specs_json);

  db.prepare(`
    UPDATE products
    SET name = ?, category_slug = ?, description = ?, price = ?, currency = ?, min_order_qty = ?, specs_json = ?, image_url = ?, stock = ?, is_featured = ?, updated_at = (datetime('now'))
    WHERE id = ?
  `).run(
    name !== undefined ? name.trim() : existing.name,
    category_slug !== undefined ? category_slug : existing.category_slug,
    description !== undefined ? description : existing.description,
    price !== undefined ? Number(price) : existing.price,
    currency !== undefined ? currency : existing.currency,
    min_order_qty !== undefined ? Number(min_order_qty) : existing.min_order_qty,
    specsJson,
    image_url !== undefined ? image_url.trim() : existing.image_url,
    stock !== undefined ? Number(stock) : existing.stock,
    is_featured !== undefined ? (is_featured ? 1 : 0) : existing.is_featured,
    Number(id)
  );

  const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(id));
  res.json({
    message: 'Produit mis à jour avec succès.',
    product: parseProduct(updated)
  });
});

// DELETE /api/products/:id (Protected)
router.delete('/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(id));
  if (!existing) {
    return res.status(404).json({ error: 'Produit introuvable.' });
  }

  db.prepare('DELETE FROM products WHERE id = ?').run(Number(id));
  res.json({ message: 'Produit supprimé avec succès.' });
});

module.exports = router;
