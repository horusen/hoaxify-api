const router = require("express").Router();
const authController = require("./app/auth/registration/registration.controller");
const userController = require("./app/user/user.controller");

router.use("/auth", authController);
router.use("/users", userController);

module.exports = router;
