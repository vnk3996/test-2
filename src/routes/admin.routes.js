const { Router } = require('express');
const { listUsers, updateUserRole } = require('../controllers/admin.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const { updateRoleSchema } = require('../validations/admin.validation');
const { exportOrdersCsv } = require('../controllers/export.controller');
const { salesReport } = require('../controllers/report.controller');

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, authorize('admin'));

router.get('/users', listUsers);
router.put('/users/:id/role', validate(updateRoleSchema), updateUserRole);
router.get('/orders/export', exportOrdersCsv);
router.get('/reports/sales', salesReport);
module.exports = router;
