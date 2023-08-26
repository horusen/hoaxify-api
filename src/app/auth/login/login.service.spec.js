const app = require("../../app");
const bcrypt = require("bcrypt");
const loginService = require("./login.service");

let mockUsers = [];
let mockTestUsers = [];

jest.mock("../../user/user.service.js", () => {
	const mockFindByEmail = jest.fn((email) => {
		const user = mockUsers.find((user) => user.email == email);
		if (!user) return Promise.resolve(null);
		return Promise.resolve(user);
	});

	return { getUserByEmail: mockFindByEmail };
});

jest.mock("bcrypt", () => {
	const mockHash = jest.fn((password, salt) => Promise.resolve(`bcrypt-${password}`));
	const mockCompare = jest.fn((password, hashedPassword) => {
		return Promise.resolve(hashedPassword == `bcrypt-${password}`);
	});

	return { hash: mockHash, compare: mockCompare };
});

describe("Login service", () => {
	beforeEach(() => {
		mockUsers = [];
		mockTestUsers = [];
	});

	const createUsers = async (active, inactive = 0) => {
		for (let i = 0; i < active + inactive; i++) {
			mockTestUsers.push({
				username: `user${i + 1}`,
				email: `user${i + 1}@gmail.com`,
				password: `userPassword${i + 1}`,
			});
			mockUsers.push({
				username: `user${i + 1}`,
				email: `user${i + 1}@gmail.com`,
				password: await bcrypt.hash(`userPassword${i + 1}`, 10),
				active: i < active,
			});
		}
	};
	it("Should return a user when credentials are correct", async () => {
		await createUsers(1, 0);
		const _user = await mockTestUsers[0];
		const user = await loginService.login(_user.email, _user.password);
		expect(user).toBeDefined();
	});

	it("Should throw an error when the email is not registered", async () => {
		await createUsers(0, 1);
		const _user = { ...mockTestUsers[0], email: "inexistingemail@email.com" };
		expect(loginService.login(_user.email, _user.password)).rejects.toThrow("Invalid email");
	});

	it("Should throw an error when the password is incorrect", async () => {
		await createUsers(1, 0);
		const _user = await mockTestUsers[0];
		expect(loginService.login(_user.email, "wrongPassword")).rejects.toThrow("Invalid password");
	});

	it("Should return a 422 error with the message user is not active when the user is not active", async () => {
		await createUsers(0, 1);
		const _user = await mockTestUsers[0];
		expect(loginService.login(_user.email, _user.password)).rejects.toThrow("User is not active");
	});
});
