const Joi = require('joi');

const placeOrderSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required().messages({
    'any.required': 'Full name is required',
    'string.empty': 'Full name is required',
  }),
  phone: Joi.string().min(10).max(20).required().messages({
    'any.required': 'Phone number is required',
    'string.empty': 'Phone number is required',
  }),
  addressLine1: Joi.string().max(255).required().messages({
    'any.required': 'Address line 1 is required',
    'string.empty': 'Address line 1 is required',
  }),
  addressLine2: Joi.string().max(255).optional().allow(''),
  city: Joi.string().max(100).required().messages({
    'any.required': 'City is required',
    'string.empty': 'City is required',
  }),
  state: Joi.string().max(100).required().messages({
    'any.required': 'State is required',
    'string.empty': 'State is required',
  }),
  postalCode: Joi.string().max(20).required().messages({
    'any.required': 'Postal code is required',
    'string.empty': 'Postal code is required',
  }),
  country: Joi.string().max(100).optional().default('India'),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one item is required',
      'any.required': 'Items are required',
    }),
});

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid('confirmed', 'shipped', 'delivered', 'cancelled')
    .required()
    .messages({
      'any.only': 'Status must be one of: confirmed, shipped, delivered, cancelled',
      'any.required': 'Status is required',
    }),
});

module.exports = { placeOrderSchema, updateStatusSchema };
