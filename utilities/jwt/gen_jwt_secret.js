const crypto = require('crypto');
const hash = crypto.createHash('sha256');

hash.update(process.argv[2]);
console.log(hash.digest('hex'));
