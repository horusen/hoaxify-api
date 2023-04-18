const HttpError = require("../utils/httpError");
const User = require("./user.model");

const bcrypt = require("bcrypt");

const PASSWORD_SALT_ROUNDS = 10;

const create = async (userData) => {
	const hashedPassword = await _hashPassword(userData.password);
	let user;
	try {
		user = await User.create({
			...userData,
			password: hashedPassword,
		});
	} catch (error) {
		if (error.name == "SequelizeUniqueConstraintError") {
			throw new HttpError("Validation failed", 422, { email: "Email is already in use" });
		}
	}
	return user;
};

async function _hashPassword(password) {
	return bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
}

const getUserByEmail = async (email) => {
	return await User.findOne({ where: { email } });
};

module.exports = {
	create,
	getUserByEmail,
};
