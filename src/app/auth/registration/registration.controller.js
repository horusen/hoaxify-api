const userService = require("../../user/user.service");
const registrationDto = require("./dtos/registration.dto");
const { getValidationErrors } = require("../../utils/utils");
const HttpError = require("../../utils/httpError");

const router = require("express").Router();

const use = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post("/", registrationDto, use(registerUser));

async function registerUser(req, res) {
	const errors = getValidationErrors(req);
	if (Object.keys(errors).length > 0) {
		throw new HttpError("Validation failed", 422, errors);
	}

	const user = await userService.create(req.body);
	return res.status(201).json({ message: "User created succesfully", data: user });
}

module.exports = router;
