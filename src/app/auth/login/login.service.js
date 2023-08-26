const bcrypt = require("bcrypt");
const userService = require("../../user/user.service");
const HttpError = require("../../utils/httpError");

const login = async (email, password) => {
	const user = await userService.getUserByEmail(email);
	if (!user) {
		throw new HttpError("Invalid email", 422);
	}

	if (!user.active) {
		throw new HttpError("User is not active", 422);
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		throw new HttpError("Invalid password", 422);
	}
	return user;
};

module.exports = {
	login,
};
