const agentSchema = require("./agentSchema.js");
const policiesSchema = require("./policiesSchema.js");
const policyCarrierSchema = require("./policyCarrierSchema.js");
const policyCategorySchema = require("./policyCategorySchema.js");
const userAccountSchema = require("./userAccountSchema.js");
const userSchema = require("./userSchema.js");

module.exports = {
  agents: agentSchema,
  policy_carriers: policyCarrierSchema,
  policy_categories: policyCategorySchema,
  user_accounts: userAccountSchema,
  users: userSchema,
  policies: policiesSchema,
};
