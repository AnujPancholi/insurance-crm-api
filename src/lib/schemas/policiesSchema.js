const Joi = require("joi");

module.exports = Joi.object({
  _id: Joi.string().required(),
  agent: Joi.string().required(),
  user_name: Joi.string().required(),
  policy_mode: Joi.string(),
  producer: Joi.string(),
  premium_amount: Joi.number().required(),
  policy_type: Joi.string(),
  policy_carrier: Joi.string().required(),
  policy_category: Joi.string().required(),
  policy_start_date: Joi.date(),
  policy_end_date: Joi.date(),
});
