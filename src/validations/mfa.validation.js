const Joi = require('joi');

const mfaCodeSchema = Joi.object({
  code: Joi.string().length(6).pattern(/^\d+$/).required().messages({
    'string.length': 'Code must be 6 digits',
    'string.pattern.base': 'Code must contain only numbers',
    'any.required': 'Code is required',
    'string.empty': 'Code is required',
  }),
});

const mfaValidateSchema = Joi.object({
  tempToken: Joi.string().required().messages({
    'any.required': 'Temporary token is required',
    'string.empty': 'Temporary token is required',
  }),
  code: Joi.string().length(6).pattern(/^\d+$/).required().messages({
    'string.length': 'Code must be 6 digits',
    'string.pattern.base': 'Code must contain only numbers',
    'any.required': 'Code is required',
    'string.empty': 'Code is required',
  }),
});

module.exports = { mfaCodeSchema, mfaValidateSchema };
