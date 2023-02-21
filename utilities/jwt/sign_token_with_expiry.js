const jwt = require('jsonwebtoken');

module.exports = (entity , expiryTime) => {
  return jwt.sign(entity, process.env.JWT_SECRET, {expiresIn: expiryTime});
};
