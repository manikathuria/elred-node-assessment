const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = (data) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(data, saltRounds, function(err, hash) {
      resolve(hash)
    });
  })
}