const Joi = require('joi');

const updateRoleSchema = Joi.object({
  role: Joi.string().valid('admin', 'manager', 'customer').required().messages({
    'any.only': 'Role must be one of: admin, manager, customer',
    'any.required': 'Role is required',
  }),
});

module.exports = { updateRoleSchema };
