require('dotenv/config');
const app = require('./src/app');
const sequelize = require('./src/config/db');
const redisClient = require('./src/config/redis');
const logger = require('./src/config/logger');
const { registerProcessErrorHandlers } = require('./src/middlewares/processErrorHandler');
require('./src/queues/processors/emailProcessor');
const PORT = process.env.PORT || 3005;

const server = app.listen(PORT, async () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  try {
    await redisClient.connect();
    logger.info('Connected to Redis');
    await sequelize.authenticate();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error(error, 'Connection error');
  }
});

// Register global error handlers for unhandled rejections, uncaught exceptions, signals
registerProcessErrorHandlers(server);
