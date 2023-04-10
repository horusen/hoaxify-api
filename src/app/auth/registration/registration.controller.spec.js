const request = require("supertest");
const app = require("../../app");
const User = require("../../user/user.model");
const sequelize = require("../../../loader/database");

const user = { username: "Omar", email: "omar@email.com", password: "Password" };

beforeAll(async () => {
	await sequelize.sync();
});

beforeEach(async () => {
	await User.destroy({ truncate: true, force: true });
});

describe("Registration controller", () => {
	const URL = "/api/v1/users";
	const apiCall = (userp = user) => request(app).post(URL).send(userp);
	let result;

	beforeEach(async () => {
		result = await apiCall();
	});

	it("Should return 201 when the signup request is valid", async () => {
		expect(result.statusCode).toBe(201);
	});

	it("Should have a sucess message when the signup request is valid", async () => {
		expect(result.body.message).toBe("User created succesfully");
	});

	it("Should save the user in the database", async () => {
		const users = await User.findAll();
		expect(users.length).toBe(1);
	});

	it("Should return 400 if any params is missing", async () => {
		const users = [
			{ ...user, username: undefined },
			{ ...user, email: undefined },
			{ ...user, password: undefined },
		];

		for (let i = 0; i < users.length; i++) {
			const result = await apiCall(users[i]);
			expect(result.statusCode).toBe(400);
			expect(result.body.message).toBe("Please provide all the required fields");
		}
	});

	it("Should return a validationErrors array if any params is missing", async () => {
		const users = [
			{ ...user, username: undefined },
			{ ...user, email: undefined },
			{ ...user, password: undefined },
		];

		for (let i = 0; i < users.length; i++) {
			const result = await apiCall(users[i]);
			expect(result.statusCode).toBe(400);
			expect(result.body.validationErrors).toBeDefined();
		}
	});

	// it("Should return validation error if the email is invalid", async () => {
	// 	const result = await apiCall({ ...user, email: "omar" });
	// 	expect(result.statusCode).toBe(400);
	// 	expect(result.body.message).toBe("Please provide a valid email");
	// });

	// it("Should return validation error if the password is invalid", async () => {
	// 	const result = await apiCall({ ...user, password: "" });
	// 	expect(result.statusCode).toBe(400);
	// 	expect(result.body.message).toBe("Please provide a valid password");
	// });

	// it("Should return validation error if the username is invalid", async () => {
	// 	const result = await apiCall({ ...user, username: "" });
	// 	expect(result.statusCode).toBe(400);
	// 	expect(result.body.message).toBe("Please provide a valid username");
	// });
});
