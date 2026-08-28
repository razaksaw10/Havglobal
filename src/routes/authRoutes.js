const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../config/db');
const { authenticateAdmin, generateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }

  const admin = db.prepare('SELECT * FROM admins WHERE LOWER(email) = LOWER(?)').get(email.trim());
  if (!admin) {
    return res.status(401).json({ error: 'Identifiants de connexion invalides.' });
  }

  const isMatch = bcrypt.compareSync(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Identifiants de connexion invalides.' });
  }

  const token = generateToken(admin);
  res.json({
    message: 'Connexion réussie',
    token,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    }
  });
});

// GET /api/auth/me (Protected)
router.get('/me', authenticateAdmin, (req, res) => {
  const admin = db.prepare('SELECT id, email, name, role, created_at FROM admins WHERE id = ?').get(req.admin.id);
  if (!admin) {
    return res.status(404).json({ error: 'Administrateur non trouvé.' });
  }
  res.json({ admin });
});

// PUT /api/auth/password (Protected)
router.put('/password', authenticateAdmin, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' });
  }

  const admin = db.prepare('SELECT * FROM admins WHERE id = ?').get(req.admin.id);
  if (!admin || !bcrypt.compareSync(currentPassword, admin.password)) {
    return res.status(400).json({ error: 'Le mot de passe actuel est incorrect.' });
  }

  const hashedNew = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE admins SET password = ? WHERE id = ?').run(hashedNew, req.admin.id);

  res.json({ message: 'Mot de passe mis à jour avec succès.' });
});

module.exports = router;
