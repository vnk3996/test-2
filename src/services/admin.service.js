const User = require('../models/user.model');
const AppError = require('../utils/AppError');

const VALID_ROLES = ['admin', 'manager', 'customer'];

const listUsers = async () => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    order: [['createdAt', 'DESC']],
  });
  return users;
};

const updateUserRole = async (userId, newRole) => {
  if (!VALID_ROLES.includes(newRole)) {
    throw AppError.badRequest(`Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`);
  }

  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] },
  });

  if (!user) {
    throw AppError.notFound('User not found');
  }

  user.role = newRole;
  await user.save();

  return user;
};

module.exports = { listUsers, updateUserRole };
