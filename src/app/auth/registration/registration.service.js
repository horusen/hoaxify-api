const userService = require("../../user/user.service");
const HttpError = require("../../utils/httpError");

const register = async (userData) => {
	// Check if user already exists
	const _user = await userService.getUserByEmail(userData.email);
	if (_user) throw new Error("User already exists");

	const user = await userService.create(userData).catch((err) => {
		throw new HttpError(500, "Internal server error");
	});
	return user;
};

module.exports = {
	register,
};
