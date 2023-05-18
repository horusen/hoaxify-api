const router = require("express").Router();
const use = require("../utils/errorWrapper");
const userService = require("./user.service");

router.get("/", use(getAll));

async function getAll(req, res) {
	const users = await userService.findAll();
	return res.status(200).json({ message: "Users fetched succesfully", data: users });
}

module.exports = router;
