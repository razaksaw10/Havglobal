const express = require('express');
const inquiryController = require('../../controllers/inquiryController');
const { authenticate } = require('../../middlewares/authMiddleware');
const validate = require('../../middlewares/validateMiddleware');
const { inquiryLimiter } = require('../../middlewares/rateLimiter');
const {
  createInquirySchema,
  updateInquiryStatusSchema,
  getInquiriesQuerySchema
} = require('../../validations/inquiryValidation');

const router = express.Router();

// POST /api/v1/inquiries - Soumission publique de demande de devis
router.post('/', inquiryLimiter, validate(createInquirySchema), inquiryController.createInquiry);

// GET /api/v1/inquiries/export/csv (Protected) - Export CSV
router.get('/export/csv', authenticate, inquiryController.exportCsv);

// GET /api/v1/inquiries (Protected) - Liste des devis reçus
router.get('/', authenticate, validate(getInquiriesQuerySchema), inquiryController.getInquiries);

// GET /api/v1/inquiries/:id (Protected)
router.get('/:id', authenticate, inquiryController.getInquiryById);

// PATCH /api/v1/inquiries/:id/status (Protected)
router.patch('/:id/status', authenticate, validate(updateInquiryStatusSchema), inquiryController.updateInquiryStatus);

// DELETE /api/v1/inquiries/:id (Protected)
router.delete('/:id', authenticate, inquiryController.deleteInquiry);

module.exports = router;
