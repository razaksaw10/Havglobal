const express = require('express');
const authRoutes = require('./authRoutes');
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const inquiryRoutes = require('./inquiryRoutes');
const statsRoutes = require('./statsRoutes');
const uploadRoutes = require('./uploadRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/stats', statsRoutes);
router.use('/upload', uploadRoutes);

// Health check v1
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    api: 'HAVA Global Trade REST API v1 (Prisma Architecture)',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
