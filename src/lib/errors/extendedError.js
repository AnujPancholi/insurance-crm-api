const { getResponseObj } = require("../../utils/responseUtils.js");

const injectResponsefulError = ({ getResponseObj }) => {
  class ExtendedError extends Error {
    constructor(message, code = 500, headers = {}) {
      super(message);
      this.name = "ExtendedError";
      this.responseObj = getResponseObj(
        code,
        {
          message,
        },
        headers
      );
    }
  }

  return ExtendedError;
};

module.exports = injectResponsefulError({
  getResponseObj,
});
