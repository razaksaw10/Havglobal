const AppError = require('../utils/appError');
const HttpStatus = require('../constants/httpStatusCodes');

function validate(schema) {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });

      // Inject parsed and sanitised values back
      if (parsed.body) req.body = parsed.body;
      if (parsed.query) req.query = parsed.query;
      if (parsed.params) req.params = parsed.params;

      next();
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const message = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        return next(new AppError(`Validation échouée : ${message}`, HttpStatus.BAD_REQUEST, error.errors));
      }
      next(new AppError('Données de requête invalides', HttpStatus.BAD_REQUEST));
    }
  };
}

module.exports = validate;
