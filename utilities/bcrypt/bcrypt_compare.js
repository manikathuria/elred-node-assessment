const bcrypt = require('bcrypt');


module.exports = (data, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(data, hash, function(err, res) {
      resolve(res)
    });
  })
}
