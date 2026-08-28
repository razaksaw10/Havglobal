const ApiResponse = require('../utils/apiResponse');
const AppError = require('../utils/appError');
const HttpStatus = require('../constants/httpStatusCodes');

const uploadController = {
  uploadFile(req, res, next) {
    if (!req.file) {
      return next(new AppError('Aucun fichier fourni dans la requête.', HttpStatus.BAD_REQUEST));
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    return ApiResponse.created(
      res,
      {
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype
      },
      'Fichier uploadé avec succès.'
    );
  }
};

module.exports = uploadController;
