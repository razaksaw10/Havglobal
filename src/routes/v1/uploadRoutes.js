const express = require('express');
const uploadController = require('../../controllers/uploadController');
const { authenticate } = require('../../middlewares/authMiddleware');
const upload = require('../../middlewares/uploadMiddleware');

const router = express.Router();

// POST /api/v1/upload (Protected) - Upload d'image ou document
router.post('/', authenticate, upload.single('file'), uploadController.uploadFile);

module.exports = router;
