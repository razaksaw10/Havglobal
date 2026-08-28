const express = require('express');
const authController = require('../../controllers/authController');
const { authenticate } = require('../../middlewares/authMiddleware');
const validate = require('../../middlewares/validateMiddleware');
const { authLimiter } = require('../../middlewares/rateLimiter');
const { loginSchema, changePasswordSchema } = require('../../validations/authValidation');

const router = express.Router();

// POST /api/v1/auth/login
router.post('/login', authLimiter, validate(loginSchema), authController.login);

// GET /api/v1/auth/me (Protected)
router.get('/me', authenticate, authController.getMe);

// PUT /api/v1/auth/password (Protected)
router.put('/password', authenticate, validate(changePasswordSchema), authController.changePassword);

module.exports = router;
