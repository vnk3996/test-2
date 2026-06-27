const { Router } = require('express');
const { getHome } = require('../controllers/home.controller');
const authRoutes = require('./auth.routes');
const mfaRoutes = require('./mfa.routes');
const adminRoutes = require('./admin.routes');
const productRoutes = require('./product.routes');
const orderRoutes = require('./order.routes');

const router = Router();

router.get('/', getHome);

// Auth routes
router.use('/auth', authRoutes);
router.use('/auth', mfaRoutes);

// Admin routes
router.use('/admin', adminRoutes);

//Product routes
router.use('/products', productRoutes);

// Order routes
router.use('/orders', orderRoutes);

module.exports = router;
