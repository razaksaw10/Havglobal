const productService = require('../services/productService');
const ApiResponse = require('../utils/apiResponse');

const productController = {
  async getProducts(req, res, next) {
    try {
      const result = await productService.getProducts(req.query);
      return ApiResponse.paginated(
        res,
        result.products,
        result.pagination,
        'Liste des produits récupérée avec succès.'
      );
    } catch (error) {
      next(error);
    }
  },

  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      return ApiResponse.success(res, { product }, 'Détail du produit récupéré.');
    } catch (error) {
      next(error);
    }
  },

  async createProduct(req, res, next) {
    try {
      const product = await productService.createProduct(req.body, req.admin?.id);
      return ApiResponse.created(res, { product }, 'Produit ajouté avec succès.');
    } catch (error) {
      next(error);
    }
  },

  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.updateProduct(id, req.body, req.admin?.id);
      return ApiResponse.success(res, { product }, 'Produit mis à jour avec succès.');
    } catch (error) {
      next(error);
    }
  },

  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      await productService.deleteProduct(id, req.admin?.id);
      return ApiResponse.success(res, {}, 'Produit supprimé avec succès.');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = productController;
