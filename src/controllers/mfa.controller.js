const mfaService = require('../services/mfa.service');
const { generateToken } = require('../services/auth.service');
const { verifyToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

const setup = async (req, res) => {
  const result = await mfaService.setUp(req.user.id);
  res.json({ success: true, ...result });
};

const verifySetup = async (req, res) => {
  const result = await mfaService.verifySetup(req.user.id, req.body.code);
  res.json({ success: true, ...result });
};

const validate = async (req, res) => {
  const { tempToken, code } = req.body;

  const decoded = verifyToken(tempToken);

  if (decoded.purpose !== 'mfa') {
    throw AppError.unauthorized('Invalid token purpose');
  }

  // Validate TOTP code
  const user = await mfaService.validateLogin(decoded.id, code);

  // Issue full access token
  const token = generateToken(user);
  res.json({ success: true, token });
};

module.exports = { setup, verifySetup, validate };
