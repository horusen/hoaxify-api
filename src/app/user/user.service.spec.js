const userService = require("./user.service");
const User = require("./user.model");
const bcrypt = require("bcrypt");

const users = [
	{
		id: 1,
		username: "ExistingUser",
		email: "existing@example.com",
		password: "ExistingPassword",
	},
];

jest.mock("./user.model", () => {
	const mockCreate = jest.fn((user) => {
		users.push({ ...user, id: users.length + 1 });
		return Promise.resolve(user);
	});

	const mockFindAll = jest.fn(() => Promise.resolve(users));

	const mockSequelize = {
		transaction: jest.fn(() => Promise.resolve({ commit: jest.fn() })),
	};

	return {
		create: mockCreate,
		findAll: mockFindAll,
		sequelize: mockSequelize,
	};
});

describe("Create User", () => {
	const user = {
		username: "Omar",
		email: "omar@example.com",
		password: "Password",
	};
	let result;

	beforeEach(async () => {
		jest.spyOn(bcrypt, "hash").mockResolvedValue("HashedPassword");
		result = await userService.create(user);
	});

	it("Should create a new user in the database", async () => {
		const users = await User.findAll();
		expect(users.length).toBe(2);
		expect(users[1]).toMatchObject({ ...user, password: "HashedPassword" });
	});

	it("Should return the user after creation", () => {
		expect(result.username).toBe(user.username);
		expect(result.email).toBe(user.email);
	});

	it("Should throw an error if the email is already in use", async () => {
		jest.spyOn(User, "create").mockRejectedValue({
			name: "SequelizeUniqueConstraintError",
		});
		await userService.create(user).catch((error) => {
			expect(error).toBeDefined();
			expect(error.message).toBe("Validation failed");
		});
	});
});
