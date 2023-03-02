const express = require("express");
const router = express.Router();
const controllers = require("./controller")
const isAuthenticated = require("../../utilities/jwt/is_authenticated")

router.post('/create', isAuthenticated, controllers.create);
router.get('/read', isAuthenticated, controllers.read);
router.patch('/update', isAuthenticated, controllers.update);
router.delete('/delete', isAuthenticated, controllers.delete);
router.post('/sort', isAuthenticated, controllers.sort);

module.exports = router;