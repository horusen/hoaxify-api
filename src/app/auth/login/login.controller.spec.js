const request = require("supertest");
const app = require("../../app");

const userService = require("../../user/user.service");

let mockUsers = [];
let mockTestUsers = [];
const API_URL = "/api/v1/auth/login";

const apiCall = (email, password) => request(app).post(API_URL).send({ email, password });

const createUsers = async (active, inactive = 0) => {
	for (let i = 0; i < active + inactive; i++) {
		mockTestUsers.push({
			username: `user${i + 1}`,
			email: `user${i + 1}@gmail.com`,
			password: `userPassword${i + 1}`,
		});
		userService.create({
			username: `user${i + 1}`,
			email: `user${i + 1}@gmail.com`,
			password: `userPassword${i + 1}`,
			active: i < active,
		});
	}
};

describe("Login controller", () => {
	it("Should return a user, a success message and a 200 status code when credentials are correct", async () => {
		await createUsers(1);
		const _user = await mockTestUsers[0];
		const response = await apiCall(_user.email, _user.password);
		expect(response.status).toBe(200);
		expect(response.message).toBe("User logged in succesfully");
		expect(response.body.data.username).toBe(_user.username);
		expect(response.body.data.email).toBe(_user.email);
	});

	it("Should return an error message and a 422 status code when the email is not registered", async () => {
		await createUsers(0, 1);
		const _user = { ...mockTestUsers[0], email: "invalid@email.com" };
		const response = await apiCall(_user.email, _user.password);
		expect(response.status).toBe(422);
		expect(response.body.message).toBe("Invalid email");
	});

	it("Should return an error message and a 422 status code when the password is incorrect", async () => {
		await createUsers(1);
		const _user = await mockTestUsers[0];
		const response = await apiCall(_user.email, "wrongPassword");
		expect(response.status).toBe(422);
		expect(response.body.message).toBe("Invalid password");
	});

	it("Should return an error message and a 422 status code when the user is not active", async () => {
		await createUsers(0, 1);
		const _user = await mockTestUsers[0];
		const response = await apiCall(_user.email, _user.password);
		expect(response.status).toBe(422);
		expect(response.body.message).toBe("User is not active");
	});
});
