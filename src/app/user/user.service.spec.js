const userService = require("./user.service");
const User = require("./user.model");
const emailService = require("../utils/email-service");
const bcrypt = require("bcrypt");
const HttpError = require("../utils/httpError");
const { before } = require("node:test");
const exp = require("constants");

let mockUsers = [];
let mockPerPage = 10;
let mockPage = 1;

// User model mock
jest.mock("./user.model", () => {
	const mockCreate = jest.fn((user) => {
		if (user.username == "rejectedUser") {
			return Promise.reject({ name: "SequelizeUniqueConstraintError" });
		}
		mockUsers.push({ ...user, id: mockUsers.length + 1 });
		return Promise.resolve(user);
	});

	const mockFindAll = jest.fn(() =>
		Promise.resolve(
			mockUsers.filter((user) => user.active).map((user) => ({ ...user, password: undefined, active: undefined, activationToken: undefined }))
		)
	);

	const mockFindAndCountAll = jest.fn(() => {
		const users = mockUsers
			.filter((user) => user.active)
			.map((user) => ({ ...user, password: undefined, active: undefined, activationToken: undefined }))
			.slice((mockPage - 1) * mockPerPage, mockPage * mockPerPage);

		return Promise.resolve({ count: mockUsers.length, rows: users });
	});

	const mockSequelize = {
		transaction: jest.fn(() => {
			return {
				commit: jest.fn(() => Promise.resolve()),
				rollback: jest.fn(() => Promise.resolve()),
			};
		}),
	};

	return {
		create: mockCreate,
		findAll: mockFindAll,
		findAndCountAll: mockFindAndCountAll,
		sequelize: mockSequelize,
	};
});

// Email service mock
jest.mock("../utils/email-service", () => {
	const mockSendActivationEmail = jest.fn((user) => {
		if (user.name == "userWithFailedEmail") {
			return Promise.reject();
		}
		return Promise.resolve();
	});
	return { sendActivationEmail: mockSendActivationEmail };
});

describe("User service", () => {
	beforeEach(() => {
		mockUsers = [];
	});

	describe("Create User", () => {
		const user = {
			username: "Omar",
			email: "omar@example.com",
			password: "Password",
			active: true,
		};
		let result;

		beforeEach(async () => {
			jest.spyOn(bcrypt, "hash").mockResolvedValue("HashedPassword");
			result = await userService.create(user);
		});

		it("Should create a new user in the database", async () => {
			const users = await User.findAll();
			expect(User.create).toHaveBeenCalledWith(expect.objectContaining({ ...user, password: "HashedPassword" }), {
				transaction: expect.anything(),
			});
			expect(users.length).toBe(1);
			expect(users[0]).toMatchObject({ ...user, password: undefined, active: undefined });
		});

		it("Should send an activation email", () => {
			expect(emailService.sendActivationEmail).toHaveBeenCalledWith(expect.objectContaining(result));
		});

		it("Should throw an error if the email service fails with 502 status code and 'Error sending activation email' message", async () => {
			await userService.create({ ...user, username: "userWithFailedEmail" }).catch((error) => {
				expect(error).toBeDefined();
				expect(error.message).toBe("Error sending activation email");
				expect(error.status).toBe(502);
			});
		});

		it("Should return the user after creation", () => {
			expect(result.username).toBe(user.username);
			expect(result.email).toBe(user.email);
		});

		// it("Should commit the transaction", () => {
		// 	expect(User.sequelize.transaction().commit).toHaveBeenCalled();
		// });

		it("Should throw an error if the email is already in use", async () => {
			await userService.create({ ...user, username: "rejectedUser" }).catch((error) => {
				expect(error).toBeDefined();
				expect(error.message).toBe("Validation failed");
			});
		});

		it("Should throw an error if the email service fails", async () => {
			await userService.create({ ...user, username: "userWithFailedEmail" }).catch((error) => {
				expect(error).toBeDefined();
				expect(error.message).toBe("Error sending activation email");
			});
		});
	});

	describe("Get all users", () => {
		let exceptedParams = {
			attributes: { exclude: ["password", "activationToken", "active"] },
			where: { active: true },
		};
		beforeEach(() => {
			mockUsers = [];
			mockPerPage = 10;
			mockPage = 1;
		});

		createUsers = async (active, inactive = 0) => {
			for (let i = 0; i < active + inactive; i++) {
				await User.create({
					username: `user${i + 1}`,
					email: `user${i + 1}@gmail.com`,
					password: "Password",
					active: i < active,
				});
			}
		};

		it("Should return only active users", async () => {
			await createUsers(1, 1);
			const result = await userService.findAll();
			expect(User.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({ where: { active: true } }));
			expect(result.data.length).toBe(1);
			expect(result.data[0]).toMatchObject({ ...mockUsers[0], password: undefined, active: undefined });
		});

		it("Should not display the password, activation token, an active properties", async () => {
			await createUsers(1, 0);
			const result = await userService.findAll();
			expect(User.findAndCountAll).toHaveBeenCalledWith(
				expect.objectContaining({ attributes: { exclude: ["password", "activationToken", "active"] } })
			);
			expect(result.data[0].password).toBeUndefined();
			expect(result.data[0].active).toBeUndefined();
			expect(result.data[0].activationToken).toBeUndefined();
		});

		it("Should return 10 users by default", async () => {
			await createUsers(12);
			const result = await userService.findAll();
			expect(User.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({ offset: 0, limit: 10 }));
			expect(result.data.length).toBe(10);
		});

		it("Should return only 2 users on the second page if there are 12 active users users", async () => {
			await createUsers(12);
			mockPage = 2;
			const result = await userService.findAll(10, 2);
			expect(User.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({ offset: 10, limit: 10 }));
			expect(result.data.length).toBe(2);
		});

		it("Should return 5 users if the user request for five user per page", async () => {
			await createUsers(12);
			mockPerPage = 5;
			const result = await userService.findAll(5, 1);
			expect(User.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({ offset: 0, limit: 5 }));
			expect(result.data.length).toBe(5);
		});
	});
});
