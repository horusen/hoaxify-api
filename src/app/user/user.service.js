const HttpError = require("../utils/httpError");
const User = require("./user.model");

const bcrypt = require("bcrypt");

const crypto = require("crypto");

const emailService = require("../utils/email-service");

const PASSWORD_SALT_ROUNDS = 10;

const generateToken = (length) => {
	return crypto.randomBytes(length).toString("hex").substring(0, length);
};

const create = async (userData) => {
	const { username, email, password } = userData;
	const hashedPassword = await _hashPassword(password);
	const transaction = await User.sequelize.transaction();

	let user = await User.create(
		{
			username,
			email,
			activationToken: generateToken(16),
			password: hashedPassword,
		},
		{ transaction }
	).catch((error) => {
		if (error.name == "SequelizeUniqueConstraintError") {
			throw new HttpError("Validation failed", 422, { email: "Email is already in use" });
		}
	});

	await emailService.sendActivationEmail(user).catch(async (error) => {
		await transaction.rollback();
		throw new HttpError("Error sending activation email", 502, { error });
	});

	await transaction.commit();

	return user;
};

async function _hashPassword(password) {
	return bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
}

const getUserByEmail = async (email) => {
	return await User.findOne({ where: { email } });
};

const getAll = async () => {
	return await User.findAll();
};

const activate = async (activationToken) => {
	const user = await User.findOne({ where: { activationToken } });
	if (!user) {
		throw new HttpError("Invalid activation token", 400);
	}
	user.active = true;
	user.activationToken = null;
	await user.save();
	return user;
};

module.exports = {
	create,
	getUserByEmail,
	activate,
	getAll,
};
