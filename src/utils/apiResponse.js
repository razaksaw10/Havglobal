const HttpStatus = require('../constants/httpStatusCodes');

const ApiResponse = {
  success(res, data = {}, message = 'Opération réussie', statusCode = HttpStatus.OK) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  },

  created(res, data = {}, message = 'Ressource créée avec succès') {
    return res.status(HttpStatus.CREATED).json({
      success: true,
      message,
      data
    });
  },

  paginated(res, data = [], pagination = {}, message = 'Données récupérées avec succès') {
    return res.status(HttpStatus.OK).json({
      success: true,
      message,
      data,
      pagination: {
        total: pagination.total || data.length,
        page: pagination.page || 1,
        limit: pagination.limit || data.length,
        totalPages: pagination.totalPages || 1,
        hasMore: pagination.hasMore || false
      }
    });
  },

  error(res, message = 'Une erreur est survenue', statusCode = HttpStatus.INTERNAL_SERVER_ERROR, details = null) {
    return res.status(statusCode).json({
      success: false,
      error: message,
      details: process.env.NODE_ENV === 'development' ? details : undefined
    });
  }
};

module.exports = ApiResponse;
