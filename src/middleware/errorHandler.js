function errorHandler(err, req, res, next) {
  console.error('[Error Handler]', err);

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  res.status(statusCode).json({
    error: err.message || 'Une erreur interne est survenue sur le serveur.',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

function notFoundHandler(req, res, next) {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: `Route API introuvable : ${req.method} ${req.path}` });
  }
  next();
}

module.exports = {
  errorHandler,
  notFoundHandler
};
