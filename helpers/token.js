const jwt = require('jsonwebtoken');

module.exports.getToken = function (headers) {
  if (headers && headers.authorization) {
    var authorization = headers.authorization;
    var part = authorization.split(' ');

    if (part.length === 2) {
      return part[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports.JWTexcludedUrls = function () {
  return [
    /^\/api\/login/,
    /^\/api\/register/
  ];
};