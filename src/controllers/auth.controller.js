const authService = require('../services/auth.service');

const register = async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({ success: true, ...result });
};

const login = async (req, res) => {
  const result = await authService.login(req.body);
  res.json({ success: true, ...result });
};

const getMe = async (req, res) => {
  const result = await authService.getMe(req.user.id);
  res.json({ success: true, ...result });
};

module.exports = { register, login, getMe };
