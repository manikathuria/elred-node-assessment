const jwt = require('jsonwebtoken');

module.exports = (entity, expiryTime = "5m") => { // by default 5 mins expiry time
  return jwt.sign(entity, process.env.JWT_SECRET, {expiresIn: expiryTime});
};
