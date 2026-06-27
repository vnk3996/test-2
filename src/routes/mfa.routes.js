const { Router } = require('express');
const { setup, verifySetup, validate } = require('../controllers/mfa.controller');
const authenticate = require('../middlewares/authenticate');
const validateMiddleware = require('../middlewares/validate');
const { mfaCodeSchema, mfaValidateSchema } = require('../validations/mfa.validation');

const router = Router();

// Requires logged-in user
router.post('/mfa/setup', authenticate, setup);
router.post('/mfa/verify-setup', authenticate, validateMiddleware(mfaCodeSchema), verifySetup);

// No auth — uses tempToken from login response
router.post('/mfa/validate', validateMiddleware(mfaValidateSchema), validate);


module.exports = router;
