const request = require("supertest");
const app = require("../../app");
const User = require("../../user/user.model");
const sequelize = require("../../../loader/database");
const { log } = require("console");

const user = { username: "Omar", email: "omar@email.com", password: "P4ssword@" };

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
		expect(result.body.message).toBe("User created succesfully");
	});

	it("Should save the user in the database", async () => {
		const users = await User.findAll();
		expect(users.length).toBe(1);
	});

	it.each`
		field         | value           | message
		${"username"} | ${undefined}    | ${"Username is required"}
		${"email"}    | ${undefined}    | ${"Email is required"}
		${"password"} | ${undefined}    | ${"Password is required"}
		${"email"}    | ${"email"}      | ${"Please enter a valid email address"}
		${"email"}    | ${"email.com"}  | ${"Please enter a valid email address"}
		${"email"}    | ${"email@.com"} | ${"Please enter a valid email address"}
		${"email"}    | ${"@email.com"} | ${"Please enter a valid email address"}
		${"password"} | ${"passw"}      | ${"Please enter a password with 6 or more characters"}
		${"password"} | ${"password"}   | ${"Password must contain at least one uppercase, one lowercase, one number and one special character"}
		${"password"} | ${"PASSWORD"}   | ${"Password must contain at least one uppercase, one lowercase, one number and one special character"}
		${"password"} | ${"Password1"}  | ${"Password must contain at least one uppercase, one lowercase, one number and one special character"}
	`("Should return a validation failed when $field is $value", async ({ field, value, message }) => {
		const userp = { ...user, [field]: value };
		const result = await apiCall(userp);
		expect(result.body.message).toBe("Validation failed");
		expect(result.statusCode).toBe(422);
		log(result.body.errors);
		expect(result.body.errors[field]).toBe(message);
	});

	it("Should return an error message with a 422 status code if the email is already been used", async () => {
		await apiCall();
		const result = await apiCall();
		expect(result.statusCode).toBe(422);
		expect(result.body.message).toBe("Validation failed");
		expect(result.body.errors.email).toBe("Email is already in use");
	});

	// it.each([
	// 	["username", "Username is required"],
	// 	["email", "Please include a valid email"],
	// 	["password", "Please enter a password with 6 or more characters"],
	// ])("Should return a validation failed when %s is missing", async (field, message) => {
	// 	const userp = { ...user, [field]: undefined };
	// 	const result = await apiCall(userp);
	// 	expect(result.body.message).toBe("Validation failed");
	// 	expect(result.statusCode).toBe(422);
	// 	expect(result.body.errors).toContainEqual({ field, message });
	// });

	// it("Should return a validation failed when the email is not well formed", async () => {
	// 	const emails = ["email@email", "email.com", "email@.com", "email@.com."];
	// 	for (let email in emails) {
	// 		expect((await apiCall({ ...user, email })).body.errors).toContainEqual({ field: "email", message: "Please include a valid email" });
	// 	}
	// });

	// it("Should return a validation failed when the password is less than 6 characters", async () => {
	// 	const userp = { ...user, password: "passw" };
	// 	const result = await apiCall(userp);
	// 	expect(result.body.errors).toContainEqual({ field: "password", message: "Please enter a password with 6 or more characters" });
	// });
});
