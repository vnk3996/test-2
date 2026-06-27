const Joi = require('joi');

const createProductSchema = Joi.object({
    name: Joi.string()
        .trim()
        .required(),

    description: Joi.string()
        .trim()
        .optional()
        .allow(''),

    price: Joi.number()
        .positive()
        .required(),

    stock: Joi.number()
        .integer()
        .min(0)
        .required()
});

module.exports = { createProductSchema };
