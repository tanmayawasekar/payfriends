const jwt = require('jsonwebtoken');

const jwtRefresh = require('jwt-refresh-token');

const utils = require('../helpers/utils');

module.exports = function (req, res, next) {
  // let currUrl = req.url;

  // if(!filterUrl(JWTexcludedUrls, currUrl)) {
  //   let token = getToken(req.headers);

  //   redisClient.get(token, function (err, reply) {
  //       if (err) {
  //           console.log(err);
  //           return res.sendStatus(500);
  //       }
  //       if (reply) {
  // 		next();
  //       } else {
  //          res.status(401).send('Please login again.');
  //       }
  //     });
  // } else {
  //   next();
  // }

  if (!utils.filterUrl(utils.JWTexcludedUrls, req.url)) {
    next();
  } else {
    next();
  }

};