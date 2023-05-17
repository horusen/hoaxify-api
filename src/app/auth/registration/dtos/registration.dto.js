const { check } = require("express-validator");
const userService = require("../../../user/user.service");

const registrationDto = () => {
	return [
		check("username", "errorMessage.username.required").notEmpty(),
		check("email")
			.notEmpty()
			.withMessage("errorMessage.email.required")
			.bail()
			.isEmail()
			.withMessage("errorMessage.email.invalid")
			.bail()
			.custom(async (email) => {
				const user = await userService.getUserByEmail(email);
				if (user) {
					throw new Error("errorMessage.email.inUse");
				}
			}),
		check("password")
			.notEmpty()
			.withMessage("errorMessage.password.required")
			.bail()
			.isLength({ min: 6, max: 20 })
			.withMessage("errorMessage.password.length")
			.bail()
			.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
			.withMessage("errorMessage.password.invalid"),
	];
};

module.exports = registrationDto;
