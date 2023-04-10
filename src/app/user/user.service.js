const User = require("./user.model");

const bcrypt = require("bcrypt");

const PASSWORD_SALT_ROUNDS = 10;

const create = async (userData) => {
	const hashedPassword = await _hashPassword(userData.password);
	let user = await User.create({ ...userData, password: hashedPassword });
	return user;
};

async function _hashPassword(password) {
	return bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
}

const getUserByEmail = async (email) => {
	const user = await User.findOne({ where: { email } });
	return user;
};

module.exports = {
	create,
	getUserByEmail,
};
