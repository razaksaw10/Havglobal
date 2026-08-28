const authService = require('../services/authService');
const ApiResponse = require('../utils/apiResponse');
const HttpStatus = require('../constants/httpStatusCodes');

const authController = {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
      const result = await authService.login(email, password, ip);
      return ApiResponse.success(res, result, 'Connexion réussie avec succès.');
    } catch (error) {
      next(error);
    }
  },

  async getMe(req, res, next) {
    try {
      const admin = await authService.getMe(req.admin.id);
      return ApiResponse.success(res, { admin }, 'Profil administrateur récupéré.');
    } catch (error) {
      next(error);
    }
  },

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      await authService.changePassword(req.admin.id, currentPassword, newPassword);
      return ApiResponse.success(res, {}, 'Mot de passe mis à jour avec succès.');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
