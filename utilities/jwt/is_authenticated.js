const jwt = require("jsonwebtoken");
const user_repo = require("../../db_services/userRepo")
module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).send({ error: "user is not logged in!" });;

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.status(401).send({ error: "user is not logged in!" });
    req.user = user;
    next();
  });  
};
