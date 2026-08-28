const categoryService = require('../services/categoryService');
const ApiResponse = require('../utils/apiResponse');

const categoryController = {
  async getAllCategories(req, res, next) {
    try {
      const categories = await categoryService.getAllCategories();
      return ApiResponse.success(res, { categories, count: categories.length }, 'Catégories récupérées avec succès.');
    } catch (error) {
      next(error);
    }
  },

  async getCategoryBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const category = await categoryService.getCategoryBySlug(slug);
      return ApiResponse.success(res, { category }, 'Détail de la catégorie récupéré.');
    } catch (error) {
      next(error);
    }
  },

  async createCategory(req, res, next) {
    try {
      const category = await categoryService.createCategory(req.body);
      return ApiResponse.created(res, { category }, 'Catégorie créée avec succès.');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = categoryController;
