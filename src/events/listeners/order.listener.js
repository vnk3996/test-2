const appEmitter = require('../emitter');
const logger = require('../../config/logger');

//Order create event
appEmitter.on('order:created', (data) => {
    logger.info({ orderId: data.orderId, userId: data.userId }, 'New order placed');
    // Future: send confirmation email
    // Future: notify warehouse
});

appEmitter.on('order:cancelled', (data) => {
    logger.info({ orderId: data.orderId }, 'Order cancelled');
    // Future: send cancellation email
    // Future: trigger refund
});

// When order status changes
appEmitter.on('order:statusChanged', (data) => {
    logger.info({ orderId: data.orderId, status: data.status }, 'Order status updated');
    // Future: send status update email/SMS to customer
});
