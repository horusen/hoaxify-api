const { log } = require("console");
const { check } = require("express-validator");
const userService = require("../../../user/user.service");

const registrationDto = [
	check("username", "Username is required").notEmpty(),
	check("email")
		.notEmpty()
		.withMessage("Email is required")
		.bail()
		.isEmail()
		.withMessage("Please enter a valid email address")
		.bail()
		.custom(async (email) => {
			const user = await userService.getUserByEmail(email);
			if (user) {
				throw new Error("Email is already in use");
			}
		}),
	check("password")
		.notEmpty()
		.withMessage("Password is required")
		.bail()
		.isLength({ min: 6, max: 20 })
		.withMessage("Please enter a password with 6 or more characters")
		.bail()
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
		.withMessage("Password must contain at least one uppercase, one lowercase, one number and one special character"),
];

// regex to check Password must contain at least one uppercase, one lowercase, one number and one special character
// /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
module.exports = registrationDto;
