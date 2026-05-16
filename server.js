const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FOLDER = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_FOLDER, 'products.db');

if (!fs.existsSync(DATA_FOLDER)) {
  fs.mkdirSync(DATA_FOLDER, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Erreur lors de l’ouverture de la base SQLite :', err);
    process.exit(1);
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT,
      specs TEXT NOT NULL DEFAULT '[]'
    )
  `);
});

function sanitizeProductRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    category: row.category,
    name: row.name,
    price: Number(row.price),
    image: row.image || '',
    specs: row.specs ? JSON.parse(row.specs) : []
  };
}

app.use(express.json({ limit: '8mb' }));

const blockedFiles = ['/server.js', '/package.json', '/package-lock.json'];
app.use((req, res, next) => {
  if (blockedFiles.includes(req.path)) {
    return res.status(404).end();
  }
  next();
});

app.get('/api/products', (req, res) => {
  const category = req.query.category;
  let sql = 'SELECT * FROM products';
  const params = [];
  if (category) {
    sql += ' WHERE category = ?';
    params.push(category);
  }
  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Erreur lecture produits :', err);
      return res.status(500).json({ error: 'Impossible de lire les produits.' });
    }
    res.json(rows.map(sanitizeProductRow));
  });
});

app.get('/api/products/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      console.error('Erreur lecture produit :', err);
      return res.status(500).json({ error: 'Impossible de lire le produit.' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Produit non trouvé.' });
    }
    res.json(sanitizeProductRow(row));
  });
});

app.post('/api/products', (req, res) => {
  const { category, name, price, image, specs } = req.body;
  if (!category || !name || price == null) {
    return res.status(400).json({ error: 'category, name et price sont requis.' });
  }

  const specsJson = Array.isArray(specs) ? JSON.stringify(specs) : '[]';
  const stmt = db.prepare('INSERT INTO products (category, name, price, image, specs) VALUES (?, ?, ?, ?, ?)');
  stmt.run(category, name, price, image || '', specsJson, function (err) {
    if (err) {
      console.error('Erreur création produit :', err);
      return res.status(500).json({ error: 'Impossible de créer le produit.' });
    }
    db.get('SELECT * FROM products WHERE id = ?', [this.lastID], (selectErr, row) => {
      if (selectErr) {
        console.error('Erreur lecture produit créé :', selectErr);
        return res.status(500).json({ error: 'Impossible de récupérer le produit créé.' });
      }
      res.status(201).json(sanitizeProductRow(row));
    });
  });
});

app.put('/api/products/:id', (req, res) => {
  const { category, name, price, image, specs } = req.body;
  if (!category || !name || price == null) {
    return res.status(400).json({ error: 'category, name et price sont requis.' });
  }
  const specsJson = Array.isArray(specs) ? JSON.stringify(specs) : '[]';

  db.run(
    'UPDATE products SET category = ?, name = ?, price = ?, image = ?, specs = ? WHERE id = ?',
    [category, name, price, image || '', specsJson, req.params.id],
    function (err) {
      if (err) {
        console.error('Erreur mise à jour produit :', err);
        return res.status(500).json({ error: 'Impossible de mettre à jour le produit.' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Produit non trouvé.' });
      }
      db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (selectErr, row) => {
        if (selectErr) {
          console.error('Erreur lecture produit mis à jour :', selectErr);
          return res.status(500).json({ error: 'Impossible de récupérer le produit mis à jour.' });
        }
        res.json(sanitizeProductRow(row));
      });
    }
  );
});

app.delete('/api/products/:id', (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function (err) {
    if (err) {
      console.error('Erreur suppression produit :', err);
      return res.status(500).json({ error: 'Impossible de supprimer le produit.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Produit non trouvé.' });
    }
    res.status(204).end();
  });
});

app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
