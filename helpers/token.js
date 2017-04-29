// import redisClient from './../config/redis';
// import jwt from 'jsonwebtoken';
// import { filterUrl } from './../helpers/filterUrl';
// import { JWTexcludedUrls } from './../helpers/JWTexcludedUrls';

const jwt = require('jsonwebtoken');

module.exports.getToken = function (headers) {
  if (headers && headers.authorization) {
    var authorization = headers.authorization;
    var part = authorization.split(' ');

    if (part.length == 2) {
      var token = part[1];

      return part[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports.verifyToken = function (req, res, next) {

};

module.exports.getNewToken = function (user) {
  return jwt.sign(user, process.jwt.key);
};


module.exports.JWTexcludedUrls = function () {
  return [
    '/api/login'
  ];
};