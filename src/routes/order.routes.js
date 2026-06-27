const { Router } = require('express');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const {
    placeOrder,
    getMyOrders,
    getMyOrderById,
    cancelOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
} = require('../controllers/order.controller');
const { placeOrderSchema, updateStatusSchema } = require('../validations/order.validation');

const router = Router();

// Customer routes
router.post('/', authenticate, authorize('customer'), validate(placeOrderSchema), placeOrder);
router.get('/my', authenticate, authorize('customer'), getMyOrders);
router.get('/my/:id', authenticate, authorize('customer'), getMyOrderById);
router.post('/:id/cancel', authenticate, authorize('customer'), cancelOrder);

// Admin/Manager routes
router.get('/', authenticate, authorize('admin', 'manager'), getAllOrders);
router.get('/:id', authenticate, authorize('admin', 'manager'), getOrderById);
router.put('/:id/status', authenticate, authorize('admin', 'manager'), validate(updateStatusSchema), updateOrderStatus);

module.exports = router;
