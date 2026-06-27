const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'any.required': 'Name is required'
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),

  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
      'any.required': 'Password is required'
    })
});

const loginSchema = Joi.object({
  email: Joi.string().required().messages({
    'string.empty': 'Invalid email or password',
    'string.email': 'Invalid email or password',
    'any.required': 'Invalid email or password',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Invalid email or password',
    'any.required': 'Invalid email or password',
  }),
});

module.exports = { registerSchema, loginSchema };
