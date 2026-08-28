const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./config/env');
const morganMiddleware = require('./middlewares/morganMiddleware');
const { globalLimiter } = require('./middlewares/rateLimiter');
const { errorHandler, notFoundHandler } = require('./middlewares/errorMiddleware');
const v1Router = require('./routes/v1');

const app = express();

// 1. Sécurité HTTP avec Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "blob:", "https://images.unsplash.com", "https://*.unsplash.com", "http:", "https:"],
      connectSrc: ["'self'"]
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. CORS & Body Parsers
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 3. Request Logging avec Morgan
app.use(morganMiddleware);

// 4. Rate Limiting global sur les endpoints d'API
app.use('/api', globalLimiter);

// 5. Distribution des fichiers statiques
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/file', express.static(path.join(__dirname, '..', 'file')));
app.use('/uploads', express.static(path.resolve(process.cwd(), env.UPLOAD_DIR)));

// 6. Routes API
// API v1 principale
app.use('/api/v1', v1Router);
// Rétrocompatibilité transparente pour /api/* (mappé sur v1)
app.use('/api', v1Router);

// 7. Route Health Check racine
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'HAVA Global Trade Enterprise API',
    environment: env.NODE_ENV,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 8. Routes HTML conviviales
app.get('/catalogue', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'catalogue.html')));
app.get('/catalogue-textile', (req, res) => res.redirect('/catalogue.html?category=textile'));
app.get('/catalogue-mobilier', (req, res) => res.redirect('/catalogue.html?category=mobilier'));
app.get('/catalogue-sante', (req, res) => res.redirect('/catalogue.html?category=sante'));
app.get('/catalogue-alimentaire', (req, res) => res.redirect('/catalogue.html?category=alimentaire'));
app.get('/services', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'services.html')));
app.get('/engagements', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'engagements.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'contact.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'admin.html')));

// 9. Gestion des erreurs 404 sur l'API
app.use('/api', notFoundHandler);

// 10. Fallback pour les routes frontend non trouvées
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// 11. Gestionnaire d'erreurs centralisé
app.use(errorHandler);

module.exports = app;
