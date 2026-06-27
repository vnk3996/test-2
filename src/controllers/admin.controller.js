const adminService = require('../services/admin.service');

const listUsers = async (req, res) => {
  const users = await adminService.listUsers();
  res.json({ success: true, users });
};

const updateUserRole = async (req, res) => {
  const user = await adminService.updateUserRole(req.params.id, req.body.role);
  res.json({ success: true, message: 'Role updated successfully', user });
};

module.exports = { listUsers, updateUserRole };
