const statsService = require('../services/statsService');
const ApiResponse = require('../utils/apiResponse');

const statsController = {
  async getDashboard(req, res, next) {
    try {
      const stats = await statsService.getDashboardStats();
      return ApiResponse.success(res, stats, 'Statistiques du tableau de bord récupérées.');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = statsController;
