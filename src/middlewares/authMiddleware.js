const jwt = require('jsonwebtoken');
const env = require('../config/env');
const prisma = require('../config/prisma');
const AppError = require('../utils/appError');
const HttpStatus = require('../constants/httpStatusCodes');

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Accès non autorisé. Token d’authentification manquant.', HttpStatus.UNAUTHORIZED));
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    if (!admin) {
      return next(new AppError('Le compte administrateur associé à ce token n’existe plus.', HttpStatus.UNAUTHORIZED));
    }

    req.admin = admin;
    next();
  } catch (error) {
    next(error);
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.admin) {
      return next(new AppError('Utilisateur non authentifié.', HttpStatus.UNAUTHORIZED));
    }

    if (!allowedRoles.includes(req.admin.role)) {
      return next(new AppError('Permissions insuffisantes pour effectuer cette action.', HttpStatus.FORBIDDEN));
    }

    next();
  };
}

module.exports = {
  authenticate,
  requireRole
};
