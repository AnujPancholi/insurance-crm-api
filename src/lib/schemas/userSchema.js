const Joi = require('joi');

module.exports = Joi.object({
    "_id": Joi.string().required(),
    "user_type": Joi.string().required(),
    "user_account": Joi.string().required(),
    "email": Joi.string().required(),
    "city": Joi.string(),
    "phone": Joi.string(),
    "address": Joi.string(),
    "state": Joi.string(),
    "zip": Joi.string(),
    "dob": Joi.date(),
 })