const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.isOperational ? err.message : 'Internal server error',
  });
};

module.exports = errorHandler;
