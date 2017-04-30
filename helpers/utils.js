module.exports = {
  /**
   * @param {boolean, Object/Array, Object, Error} param0
   */
  sendResponseIfTrue({
    condition,
    valueToSend,
    responseObject,
    errMessage,
  }) {
    if (condition) {
      responseObject.send(valueToSend);
    } else {
      throw new Error(errMessage);
    }
  },

  checkIfDataExists(data, errMessage, next) {
    let flagThrowError;
    if (data) {
      switch (data.constructor) {
        case Object:
          flagThrowError = Object.keys(data).length ? false : true;
          break;
        case Array:
          flagThrowError = data.length ? false : true;
          break;
        default:
          break;
      }
      if (flagThrowError) {
        throw new Error(errMessage);
      } else {
        return data;
      }
    } else {
      throw new Error(errMessage);
    }
  },

  getErrorStatus(statusMessage) {
    console.log("statusMessage", statusMessage);
    let status;
    switch (statusMessage) {
      case 'Invalid Credentials':
        status = 401;
        break;
      case 'Bad Request':
        status = 400;
        break;
      default:
        status = 500;
        break;
    }
    return status;
  },

  checkIfRequiredFieldsExists({
    objectToCheckIn,
    requiredFields,
    errMessage,
    ignoreFields,
  }) {

    let flagThrowError = requiredFields.some((field) => !objectToCheckIn[field] && ignoreFields.indexOf(field) === -1)

    if (flagThrowError) {
      throw new Error(errMessage);
    } else {
      return Promise.resolve(true);
    }

  },

  filterUrl(excludedUrls, requestedUrl) {
    for (let i in excludedUrls) {
      if (excludedUrls[i] instanceof RegExp && excludedUrls[i].test(requestedUrl)) {
        return true;
      } else if (typeof excludedUrls[i] === 'string' && excludedUrls[i] === requestedUrl) {
        return true;
      }
    }
    return false;
  },

  JWTexcludedUrls() {
    return [
      '/api/login'
    ];
  }
};