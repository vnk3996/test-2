const { Router } = require('express');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const upload = require('../middlewares/upload');
const { create, list, getById, remove } = require('../controllers/product.controller');
const { uploadImages, deleteImage } = require('../controllers/productImage.controller');
const { createProductSchema } = require('../validations/product.validation');

const router = Router();

// Public routes
router.get('/', list);
router.get('/:id', getById);

// Protected routes (admin + manager)
router.post('/', authenticate, authorize('admin', 'manager'), validate(createProductSchema), create);
router.delete('/:id', authenticate, authorize('admin'), remove);

// Image routes (admin + manager)
router.post('/:id/images', authenticate, authorize('admin', 'manager'), upload.array('images', 5), uploadImages);
router.delete('/:id/images/:imageId', authenticate, authorize('admin', 'manager'), deleteImage);

module.exports = router;
