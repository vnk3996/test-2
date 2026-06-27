const AppError = require('../utils/AppError');

/**
 * Returns a middleware that checks if req.user.role is in the allowed roles.
 * Usage: authorize('admin', 'manager')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw AppError.unauthorized('Not authenticated');
    }
    if (!roles.includes(req.user.role)) {
      throw AppError.forbidden('You do not have permission to perform this action');
    }
    next();
  };
};

module.exports = authorize;
