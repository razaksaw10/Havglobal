const express = require('express');
const categoryController = require('../../controllers/categoryController');
const { authenticate, requireRole } = require('../../middlewares/authMiddleware');
const validate = require('../../middlewares/validateMiddleware');
const Roles = require('../../constants/roles');
const { createCategorySchema } = require('../../validations/categoryValidation');

const router = express.Router();

// GET /api/v1/categories
router.get('/', categoryController.getAllCategories);

// GET /api/v1/categories/:slug
router.get('/:slug', categoryController.getCategoryBySlug);

// POST /api/v1/categories (Protected Super Admin)
router.post(
  '/',
  authenticate,
  requireRole(Roles.SUPER_ADMIN),
  validate(createCategorySchema),
  categoryController.createCategory
);

module.exports = router;
