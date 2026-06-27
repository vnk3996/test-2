const User = require('../models/user.model');
const AppError = require('../utils/AppError');
const { verifyToken } = require('../utils/jwt');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw AppError.unauthorized('Access token is missing');
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  // Reject temp tokens (e.g., MFA temp tokens) — they are not access tokens
  if (decoded.purpose) {
    throw AppError.unauthorized('Invalid access token');
  }

  const user = await User.findByPk(decoded.id, {
    attributes: { exclude: ['password', 'mfaSecret'] },
  });

  if (!user) {
    throw AppError.unauthorized('User no longer exists');
  }

  req.user = user;
  next();
};

module.exports = authenticate;
