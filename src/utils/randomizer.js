const crypto = require("crypto");

const getRandomHexStr = () => crypto.randomBytes(16).toString("hex");

module.exports = {
  getRandomHexStr,
};
