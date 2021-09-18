const logger = require("pino")();
const { SERVICE_NAME } = require("../config.js");

module.exports = (opts) => {
  delete opts.service;
  opts = {
    service: SERVICE_NAME,
    ...opts,
  };

  return logger.child({
    service: opts.SERVICE_NAME,
    tag: opts.tag || null,
  });
};
