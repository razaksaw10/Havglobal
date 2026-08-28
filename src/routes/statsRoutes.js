const express = require('express');
const { db } = require('../config/db');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/stats/dashboard (Protected) - Statistiques et indicateurs clés
router.get('/dashboard', authenticateAdmin, (req, res) => {
  const totalProducts = db.prepare('SELECT COUNT(*) AS count FROM products').get().count;
  const totalCategories = db.prepare('SELECT COUNT(*) AS count FROM categories').get().count;
  const totalInquiries = db.prepare('SELECT COUNT(*) AS count FROM inquiries').get().count;
  const newInquiries = db.prepare("SELECT COUNT(*) AS count FROM inquiries WHERE status = 'new'").get().count;
  const inProgressInquiries = db.prepare("SELECT COUNT(*) AS count FROM inquiries WHERE status = 'in_progress'").get().count;
  const resolvedInquiries = db.prepare("SELECT COUNT(*) AS count FROM inquiries WHERE status = 'resolved'").get().count;

  const categoryDistribution = db.prepare(`
    SELECT c.name, c.slug, c.icon, COUNT(p.id) AS count
    FROM categories c
    LEFT JOIN products p ON p.category_slug = c.slug
    GROUP BY c.id
    ORDER BY count DESC
  `).all();

  const recentInquiries = db.prepare(`
    SELECT id, name, email, company, subject, status, created_at
    FROM inquiries
    ORDER BY created_at DESC
    LIMIT 5
  `).all();

  const recentProducts = db.prepare(`
    SELECT id, name, category_slug, price, currency, stock, is_featured, created_at
    FROM products
    ORDER BY created_at DESC
    LIMIT 5
  `).all();

  res.json({
    kpis: {
      totalProducts,
      totalCategories,
      totalInquiries,
      newInquiries,
      inProgressInquiries,
      resolvedInquiries
    },
    categoryDistribution,
    recentInquiries,
    recentProducts
  });
});

module.exports = router;
