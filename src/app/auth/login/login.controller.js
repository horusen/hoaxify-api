const loginService = require("./login.service");
const router = require("express").Router();

router.post("/", login);

async function login(req, res) {
	const { email, password } = req.body;
	const user = await loginService.login(email, password);
	return res.status(200).json({ message: "User logged in succesfully", user });
}

module.exports = router;
