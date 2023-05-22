const router = require("express").Router();
const use = require("../utils/errorWrapper");
const userService = require("./user.service");

router.get("/", use(getAll));

async function getAll(req, res) {
	const page = parseInt(req.query.page) || 1;
	const perPage = parseInt(req.query.perPage) || 10;
	const data = await userService.findAll(perPage, page);
	return res.status(200).json({ message: "Users fetched succesfully", ...data, page, perPage });
}

module.exports = router;
