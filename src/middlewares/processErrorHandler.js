const logger = require('../config/logger');


function registerProcessErrorHandlers(server) {
  process.on('unhandledRejection', (reason) => {
    logger.fatal(reason, 'Unhandled Rejection');
    gracefulShutdown(server, 'unhandledRejection');
  });

  process.on('uncaughtException', (err) => {
    logger.fatal(err, 'Uncaught Exception');
    gracefulShutdown(server, 'uncaughtException');
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    gracefulShutdown(server, 'SIGTERM');
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT received. Shutting down gracefully...');
    gracefulShutdown(server, 'SIGINT');
  });
}

function gracefulShutdown(server, signal) {
  logger.info(`Graceful shutdown initiated by: ${signal}`);

  if (server) {
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(1);
    });

    setTimeout(() => {
      logger.error('Forced shutdown — server did not close in time');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(1);
  }
}

module.exports = { registerProcessErrorHandlers };
