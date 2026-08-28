const express = require('express');
const { db } = require('../config/db');

const router = express.Router();

// GET /api/categories - Liste de toutes les catégories avec le nombre de produits associés
router.get('/', (req, res) => {
  const categories = db.prepare(`
    SELECT c.*, COUNT(p.id) AS product_count
    FROM categories c
    LEFT JOIN products p ON p.category_slug = c.slug
    GROUP BY c.id
    ORDER BY c.order_index ASC, c.name ASC
  `).all();

  res.json({ categories });
});

// GET /api/categories/:slug
router.get('/:slug', (req, res) => {
  const category = db.prepare('SELECT * FROM categories WHERE slug = ?').get(req.params.slug);
  if (!category) {
    return res.status(404).json({ error: 'Catégorie introuvable.' });
  }

  const products = db.prepare(`
    SELECT * FROM products WHERE category_slug = ? ORDER BY created_at DESC
  `).all();

  res.json({
    category,
    products: products.map(p => ({
      ...p,
      specs: JSON.parse(p.specs_json || '[]')
    }))
  });
});

module.exports = router;
