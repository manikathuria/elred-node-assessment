const express = require("express");
const router = express.Router();
const controllers = require("./controller")

router.post("/signin", controllers.login);
router.post("/signup", controllers.register);
router.post('/verifyOtp',controllers.verifyOtp);
router.post('/resendOtp',controllers.resendOtp);


module.exports = router;