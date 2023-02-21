const jwt = require('jsonwebtoken');

module.exports = (entity) => {
  return jwt.sign(entity, process.env.JWT_SECRET);
};
