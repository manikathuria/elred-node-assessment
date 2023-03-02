const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.body.token || req.query.token || req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).send({ 
    message: "user is not logged in!",
    success: false,
    data: {} 
  });

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.status(401).send({ 
      message: "user is not logged in!",
      success: false,
      data: {} 
    });
    
    req.user = user;
    next();
  });  
};
