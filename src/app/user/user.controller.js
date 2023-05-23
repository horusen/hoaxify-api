const router = require("express").Router();
const pagination = require("../middlewares/pagination");
const use = require("../utils/errorWrapper");
const userService = require("./user.service");
const HttpError = require("../utils/httpError");

router.get("/", pagination, use(getAll));
router.get(
	"/:id",
	(req, res, next) => {
		const userId = req.params.id;
		console.log(userId);
		if (!parseInt(userId) || parseInt(userId) < 0) {
			throw new HttpError("Invalid id", 422);
		}
		next();
	},
	use(getById)
);

async function getAll(req, res) {
	const { page, pageSize } = req.pagination;
	const data = await userService.findAll(pageSize, page);
	return res.status(200).json({ message: "Users fetched succesfully", ...data });
}

async function getById(req, res) {
	const { id } = req.params;
	const user = await userService.findById(id);
	return res.status(200).json({ message: "User fetched succesfully", data: user });
}

module.exports = router;
