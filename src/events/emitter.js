const { EventEmitter } = require('events');
const logger = require('../config/logger');
const appEmitter = new EventEmitter();

// Catch any 'error' events so they don't crash the app
appEmitter.on('error', (err) => {
    logger.error(err, 'EventEmitter error');
});

module.exports = appEmitter;
