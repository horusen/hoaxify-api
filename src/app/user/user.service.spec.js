const userService = require("./user.service");
const User = require("./user.model");
const sequelize = require("../../loader/database");

beforeAll(async () => {
	await sequelize.sync();
});

describe("Create User", () => {
	const user = { username: "Omar", email: "omar@email.com", password: "Password" };
	let result;

	beforeEach(async () => {
		await User.destroy({ truncate: true, force: true });
		result = await userService.create(user);
	});

	it("Should create a new user in the database", async () => {
		const users = await User.findAll();
		expect(users.length).toBe(1);
	});

	it("Should return the user after creation", async () => {
		expect(result.username).toBe(user.username);
		expect(result.email).toBe(user.email);
	});
});
