const router = require("express").Router();
const pagination = require("../middlewares/pagination");
const use = require("../utils/errorWrapper");
const userService = require("./user.service");

router.get("/", pagination, use(getAll));

async function getAll(req, res) {
	const { page, pageSize } = req.pagination;
	const data = await userService.findAll(pageSize, page);
	return res.status(200).json({ message: "Users fetched succesfully", ...data });
}

module.exports = router;
