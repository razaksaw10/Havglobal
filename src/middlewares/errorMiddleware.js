const AppError = require('../utils/appError');
const HttpStatus = require('../constants/httpStatusCodes');
const logger = require('../config/logger');
const env = require('../config/env');

function notFoundHandler(req, res, next) {
  next(new AppError(`Route introuvable : ${req.method} ${req.originalUrl}`, HttpStatus.NOT_FOUND));
}

function errorHandler(err, req, res, next) {
  let error = { ...err };
  error.message = err.message || 'Une erreur interne est survenue sur le serveur.';
  error.statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

  // Log error
  logger.error(`[${req.method}] ${req.originalUrl} - ${error.statusCode} : ${error.message}`, {
    stack: err.stack
  });

  // Handle Prisma Specific Errors
  if (err.code === 'P2002') {
    const fields = err.meta?.target ? ` (${err.meta.target})` : '';
    error = new AppError(`Une entrée avec cette valeur existe déjà${fields}.`, HttpStatus.CONFLICT);
  } else if (err.code === 'P2025') {
    error = new AppError('Enregistrement introuvable dans la base de données.', HttpStatus.NOT_FOUND);
  } else if (err.code === 'P2003') {
    error = new AppError('Violation de contrainte de clé étrangère.', HttpStatus.BAD_REQUEST);
  }

  // Handle Multer Errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error = new AppError(`Le fichier est trop volumineux. Taille maximale : ${(env.MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)} Mo.`, HttpStatus.BAD_REQUEST);
    } else {
      error = new AppError(`Erreur d'upload : ${err.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  // Handle JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Session invalide. Veuillez vous reconnecter.', HttpStatus.UNAUTHORIZED);
  } else if (err.name === 'TokenExpiredError') {
    error = new AppError('Votre session a expiré. Veuillez vous reconnecter.', HttpStatus.UNAUTHORIZED);
  }

  res.status(error.statusCode).json({
    success: false,
    error: error.message,
    details: !env.isProduction ? (err.details || err.stack) : undefined
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
