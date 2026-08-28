const rateLimit = require('express-rate-limit');

// Limiteur général pour l'API
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: {
    success: false,
    error: 'Trop de requêtes effectuées. Veuillez patienter quelques instants avant de réessayer.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Limiteur strict pour la connexion admin
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: 'Nombreuses tentatives de connexion échouées. Accès temporairement bloqué pendant 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Limiteur pour l'envoi de devis / contact
const inquiryLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: 'Trop de messages envoyés. Veuillez réessayer dans quelques minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  globalLimiter,
  authLimiter,
  inquiryLimiter
};
