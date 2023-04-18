const router = require("express").Router();
const authController = require("./app/auth/registration/registration.controller");

router.use("/users", authController);

module.exports = router;
