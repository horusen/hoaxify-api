const router = require("express").Router();
const use = require("../utils/errorWrapper");
const userService = require("./user.service");

router.get("/", use(getAll));

async function getAll(req, res) {
	const page = req.query.page || 1;
	const data = await userService.findAll(10, page);
	return res.status(200).json({ message: "Users fetched succesfully", ...data, page, perPage: 10 });
}

module.exports = router;
