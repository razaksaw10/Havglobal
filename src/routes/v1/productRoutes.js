const express = require('express');
const productController = require('../../controllers/productController');
const { authenticate } = require('../../middlewares/authMiddleware');
const validate = require('../../middlewares/validateMiddleware');
const {
  createProductSchema,
  updateProductSchema,
  getProductsQuerySchema
} = require('../../validations/productValidation');

const router = express.Router();

// GET /api/v1/products - Liste avec pagination, recherche, filtres
router.get('/', validate(getProductsQuerySchema), productController.getProducts);

// GET /api/v1/products/:id - Détail
router.get('/:id', productController.getProductById);

// POST /api/v1/products - Ajout (Protégé)
router.post('/', authenticate, validate(createProductSchema), productController.createProduct);

// PUT /api/v1/products/:id - Mise à jour (Protégé)
router.put('/:id', authenticate, validate(updateProductSchema), productController.updateProduct);

// DELETE /api/v1/products/:id - Suppression (Protégé)
router.delete('/:id', authenticate, productController.deleteProduct);

module.exports = router;
