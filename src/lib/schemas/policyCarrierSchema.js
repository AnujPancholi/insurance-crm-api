const Joi = require("joi");

module.exports = Joi.object({
  _id: Joi.string().required(),
});
