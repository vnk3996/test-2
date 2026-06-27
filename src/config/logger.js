const pino = require('pino');

const isProduction = process.env.NODE_ENV === 'production';

const transport = isProduction
  ? {
      target: 'pino/file',
      options: {
        destination: process.env.LOG_PATH || './logs/app.log',
        mkdir: true,
      },
    }
  : {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    };

const logger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  transport,
});

module.exports = logger;
