module.exports = {
  nullResponseObj: {
    code: 500,
    headers: {},
    data: {
      success: false,
      data: null,
      error: null,
    },
  },
  getResponseObj: (code = 500, data = {}, headers = {}) => {
    const isSuccessful = code < 400;
    return {
      code: code,
      headers: headers,
      data: {
        success: isSuccessful,
        data: isSuccessful ? data : null,
        error: isSuccessful ? null : data,
      },
    };
  },
};
