const express = require('express');
const { db } = require('../config/db');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/inquiries - Soumission publique d'un message / devis
router.post('/', (req, res) => {
  const { name, email, phone, company, country, subject, category_slug, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Le nom, l’adresse email et le message sont obligatoires.' });
  }

  // Basic email sanity check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Format d’adresse email invalide.' });
  }

  const result = db.prepare(`
    INSERT INTO inquiries (name, email, phone, company, country, subject, category_slug, message, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')
  `).run(
    name.trim(),
    email.trim().toLowerCase(),
    phone ? phone.trim() : '',
    company ? company.trim() : '',
    country ? country.trim() : '',
    subject ? subject.trim() : 'Demande d’information / Devis',
    category_slug || null,
    message.trim()
  );

  const inquiry = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(result.lastInsertRowid);

  res.status(201).json({
    message: 'Votre demande a été transmise avec succès à notre équipe commerciale.',
    inquiry_id: inquiry.id
  });
});

// GET /api/inquiries (Protected) - Liste des devis et messages
router.get('/', authenticateAdmin, (req, res) => {
  const { status, search, limit = 100 } = req.query;

  let query = 'SELECT * FROM inquiries WHERE 1=1';
  const params = [];

  if (status && status !== 'all') {
    query += ' AND status = ?';
    params.push(status);
  }

  if (search && search.trim()) {
    query += ' AND (name LIKE ? OR email LIKE ? OR company LIKE ? OR subject LIKE ? OR message LIKE ?)';
    const term = `%${search.trim()}%`;
    params.push(term, term, term, term, term);
  }

  query += ' ORDER BY created_at DESC LIMIT ?';
  params.push(Number(limit));

  const inquiries = db.prepare(query).all(...params);
  res.json({
    count: inquiries.length,
    inquiries
  });
});

// GET /api/inquiries/:id (Protected)
router.get('/:id', authenticateAdmin, (req, res) => {
  const inquiry = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(Number(req.params.id));
  if (!inquiry) {
    return res.status(404).json({ error: 'Demande introuvable.' });
  }
  res.json({ inquiry });
});

// PATCH /api/inquiries/:id/status (Protected)
router.patch('/:id/status', authenticateAdmin, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['new', 'in_progress', 'resolved'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Statut invalide. Utilisez: new, in_progress ou resolved.' });
  }

  const existing = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(Number(req.params.id));
  if (!existing) {
    return res.status(404).json({ error: 'Demande introuvable.' });
  }

  db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, Number(req.params.id));
  const updated = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(Number(req.params.id));

  res.json({
    message: 'Statut mis à jour avec succès.',
    inquiry: updated
  });
});

// DELETE /api/inquiries/:id (Protected)
router.delete('/:id', authenticateAdmin, (req, res) => {
  const existing = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(Number(req.params.id));
  if (!existing) {
    return res.status(404).json({ error: 'Demande introuvable.' });
  }

  db.prepare('DELETE FROM inquiries WHERE id = ?').run(Number(req.params.id));
  res.json({ message: 'Demande supprimée avec succès.' });
});

module.exports = router;
