const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const taskRouter = require('./task');

/**
   * @openapi
   * /health:
   *  get:
   *     tags:
   *     - Health
   *     description: Responds if the app is up and running
   *     responses:
   *       200:
   *         description: App is up and running
*/
router.get("/health", (req, res) => {
    const data = {
      uptime: process.uptime(),
      message: "Ok",
      date: new Date(),
    };
    res.status(200).send(data);
});

router.use('/user', userRouter);
router.use('/task', taskRouter);

module.exports = router;