const express = require('express');
const statsController = require('../../controllers/statsController');
const { authenticate } = require('../../middlewares/authMiddleware');

const router = express.Router();

// GET /api/v1/stats/dashboard (Protected)
router.get('/dashboard', authenticate, statsController.getDashboard);

module.exports = router;
