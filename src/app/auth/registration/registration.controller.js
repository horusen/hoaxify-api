const userService = require("../../user/user.service");
const registrationDto = require("./dtos/registration.dto");
const { getValidationErrors, translate } = require("../../utils/utils");
const HttpError = require("../../utils/httpError");
const use = require("../../utils/errorWrapper");

const router = require("express").Router();

router.post("/", registrationDto(), use(registerUser));
router.get("/activation/:token", use(activateUser));

async function registerUser(req, res) {
	const errors = getValidationErrors(req);
	if (Object.keys(errors).length > 0) {
		throw new HttpError(translate("errorMessage.error"), 422, errors);
	}

	const user = await userService.create(req.body);
	return res.status(201).json({ message: "User created succesfully", data: user });
}

async function activateUser(req, res) {
	const user = await userService.activate(req.params.token);
	return res.status(200).json({ message: "User activated succesfully", data: user });
}

module.exports = router;
