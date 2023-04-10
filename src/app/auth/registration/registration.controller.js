const userModel = require("../../user/user.model");
const userService = require("../../user/user.service");

async function registerUser(req, res) {
	// User validation
	if (!req.body.username || !req.body.email || !req.body.password) {
		return res.status(400).json({ message: "Please provide all the required fields", validationErrors: ["username", "email", "password"] });
	}

	const user = await userService.create(req.body);
	res.status(201).json({ message: "User created succesfully", data: user });
}

module.exports = {
	registerUser,
};
