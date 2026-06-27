/**
 * Returns an Express middleware that validates req.body against a Joi schema.
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body || {}, {
      abortEarly: false,
      stripUnknown: true,
    });
    console.log(error);
    if (error) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    req.body = value;
    next();
  };
};

module.exports = validate;
