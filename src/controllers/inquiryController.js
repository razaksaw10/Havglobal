const inquiryService = require('../services/inquiryService');
const ApiResponse = require('../utils/apiResponse');

const inquiryController = {
  async createInquiry(req, res, next) {
    try {
      const inquiry = await inquiryService.createInquiry(req.body);
      return ApiResponse.created(
        res,
        { inquiry_id: inquiry.id, inquiry },
        'Votre demande a été transmise avec succès à notre équipe commerciale.'
      );
    } catch (error) {
      next(error);
    }
  },

  async getInquiries(req, res, next) {
    try {
      const result = await inquiryService.getInquiries(req.query);
      return ApiResponse.paginated(
        res,
        result.inquiries,
        result.pagination,
        'Demandes de devis récupérées avec succès.'
      );
    } catch (error) {
      next(error);
    }
  },

  async getInquiryById(req, res, next) {
    try {
      const { id } = req.params;
      const inquiry = await inquiryService.getInquiryById(id);
      return ApiResponse.success(res, { inquiry }, 'Détail de la demande récupéré.');
    } catch (error) {
      next(error);
    }
  },

  async updateInquiryStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      const inquiry = await inquiryService.updateInquiryStatus(id, status, notes, req.admin?.id);
      return ApiResponse.success(res, { inquiry }, 'Statut de la demande mis à jour avec succès.');
    } catch (error) {
      next(error);
    }
  },

  async deleteInquiry(req, res, next) {
    try {
      const { id } = req.params;
      await inquiryService.deleteInquiry(id, req.admin?.id);
      return ApiResponse.success(res, {}, 'Demande supprimée avec succès.');
    } catch (error) {
      next(error);
    }
  },

  async exportCsv(req, res, next) {
    try {
      const csv = await inquiryService.exportToCsv();
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename=hava_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
      return res.status(200).send('\uFEFF' + csv); // BOM pour compatibilité Excel
    } catch (error) {
      next(error);
    }
  }
};

module.exports = inquiryController;
