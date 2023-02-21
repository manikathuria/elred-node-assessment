const jwt = require('jsonwebtoken');

module.exports = (resetLink ) => {
  jwt.verify(resetLink, resetPassword, (err, decodedToken) => {
    if (err) return res.status(401).send({ error: "Link is not valid" });

})
};
