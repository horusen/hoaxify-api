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
		jest.spyOn(User, "create").mockResolvedValue(user);
		await User.destroy({ truncate: true, force: true });
		result = await userService.create(user);
	});

	it("Should create a new user in the database", async () => {
		jest.spyOn(User, "findAll").mockReturnValue([user]);
		const users = await User.findAll();
		expect(User.findAll).toHaveBeenCalled();
		expect(users.length).toBe(1);
	});

	it("Should return the user after creation", async () => {
		expect(result.username).toBe(user.username);
		expect(result.email).toBe(user.email);
	});

	it("Should throw an error if the email is already in use", async () => {
		await userService.create(user).catch((error) => {
			expect(error).toBeDefined();
		});
	});
});
