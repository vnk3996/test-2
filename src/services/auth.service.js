const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const AppError = require('../utils/AppError');
const { signAccessToken, signTempToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

const register = async ({ name, email, password } = {}) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw AppError.conflict('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user);

  return {
    token,
    user: sanitizeUser(user),
  };
};

const login = async ({ email, password } = {}) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw AppError.unauthorized('Invalid email or password');
  }

  // If MFA is enabled, return temp token instead of full access token
  if (user.mfaEnabled) {
    const tempToken = signTempToken({ id: user.id, purpose: 'mfa' });
    return { mfaRequired: true, tempToken };
  }

  const token = generateToken(user);
  return { token, user: sanitizeUser(user) };
};

const getMe = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password', 'mfaSecret'] },
  });

  if (!user) {
    throw AppError.notFound('User not found');
  }

  return { user };
};

function generateToken(user) {
  return signAccessToken({ id: user.id, role: user.role });
}

function sanitizeUser(user) {
  const { password, mfaSecret, ...userData } = user.toJSON();
  return userData;
}

module.exports = { register, login, getMe, generateToken };
