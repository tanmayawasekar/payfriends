const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports.encrypt = plainText => bcrypt.hash(plainText, saltRounds);

module.exports.comparePassword = (plainText, hash) => bcrypt.compare(plainText,hash);