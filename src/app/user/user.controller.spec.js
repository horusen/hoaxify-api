const request = require("supertest");

const config = require("config");
const app = require("../app");
const User = require("./user.model");
const sequelize = require("../../loader/database");

const API_ENDPOINT = `/api/v1/users`;
const apiCall = () => request(app).get(API_ENDPOINT);

const createUsers = async (active, inactive) => {
	for (let i = 0; i < active + inactive; i++) {
		await User.create({
			username: `user${i + 1}`,
			email: `user${i + 1}@email.com`,
			password: "password",
			active: i < active,
		});
	}
};

describe("User controller", () => {
	beforeAll(async () => {
		await sequelize.sync();
	});

	beforeEach(async () => {
		await User.destroy({ truncate: true, force: true });
	});

	describe("GET /users", () => {
		let response;

		beforeAll(async () => {});

		afterAll(async () => {
			await User.destroy({ truncate: true, force: true });
		});

		beforeEach(async () => {});

		it("Should return a 200 status code", async () => {
			await createUsers(1, 0);
			response = await apiCall();
			expect(response.status).toBe(200);
		});

		it("Should return a message User fetched succesfully", async () => {
			await createUsers(1, 0);
			response = await apiCall();
			expect(response.body.message).toBe("Users fetched succesfully");
		});

		it("Should not return a password, activation token and active properties", async () => {
			await createUsers(1, 0);
			response = await apiCall();
			console.log(response.body);
			expect(response.body.data[0].password).toBeUndefined();
			expect(response.body.data[0].activationToken).toBeUndefined();
			expect(response.body.data[0].active).toBeUndefined();
		});

		it("Should only return active users", async () => {
			await createUsers(1, 1);
			response = await apiCall();
			expect(response.body.data.length).toBe(1);
		});

		it("Should return 10 users per page", async () => {
			await createUsers(12, 0);
			response = await apiCall();
			expect(response.body.data.length).toBe(10);
			expect(response.body.totalPages).toBe(2);
		});

		it("Should return the second page when the page query param is 2", async () => {
			await createUsers(12, 0);
			response = await apiCall().query({ page: 2 });
			expect(response.body.data.length).toBe(2);
			expect(response.body.totalPages).toBe(2);
		});

		it("Should return 5 users per page when the pageSize query param is 5", async () => {
			await createUsers(12, 0);
			response = await apiCall().query({ pageSize: 5 });
			expect(response.body.data.length).toBe(5);
			expect(response.body.totalPages).toBe(3);
		});

		it("Should return 10 users per page when the pageSize query param is 20", async () => {
			await createUsers(12, 0);
			response = await apiCall().query({ pageSize: 20 });
			expect(response.body.data.length).toBe(10);
		});

		it("Should return 10 users per page when the pageSize query param is -1", async () => {
			await createUsers(12, 0);
			response = await apiCall().query({ pageSize: -1 });
			expect(response.body.data.length).toBe(10);
		});

		it("Should return 10 users per page when the pageSize query param is Nan", async () => {
			await createUsers(12, 0);
			response = await apiCall().query({ pageSize: "any" });
			expect(response.body.data.length).toBe(10);
		});
	});

	describe("GET /users/:id", () => {
		it("Should return a user with a 200 status code", async () => {
			await createUsers(1, 0);
			const user = await User.findOne();
			const response = await request(app).get(`${API_ENDPOINT}/${user.id}`);
			expect(response.status).toBe(200);
			expect(response.body.message).toBe("User fetched succesfully");
			expect(response.body.data).toBeDefined();
			expect(response.body.data.id).toBe(user.id);
		});

		it("Should return a 404 status code if the user does not exist", async () => {
			await createUsers(1, 0);
			const response = await request(app).get(`${API_ENDPOINT}/2098`);
			expect(response.status).toBe(404);
			expect(response.body.message).toBe("User not found");
		});

		it("Should not return a password, activation token properties", async () => {
			await createUsers(1, 0);
			const user = await User.findOne();
			const response = await request(app).get(`${API_ENDPOINT}/${user.id}`);
			expect(response.body.data.password).toBeUndefined();
			expect(response.body.data.activationToken).toBeUndefined();
		});

		it("Should return a 422 status code if the id is not a number", async () => {
			await createUsers(1, 0);
			const response = await request(app).get(`${API_ENDPOINT}/any`);
			expect(response.status).toBe(422);
			expect(response.body.message).toBe("Invalid id");
		});

		it("Should return a 422 status code if the id is less than 1", async () => {
			await createUsers(1, 0);
			const response = await request(app).get(`${API_ENDPOINT}/0`);
			expect(response.status).toBe(422);
			expect(response.body.message).toBe("Invalid id");
		});

		it("Should return 404 status code if the user is inactive", async () => {
			await createUsers(0, 1);
			const user = await User.findOne();
			const response = await request(app).get(`${API_ENDPOINT}/${user.id}`);
			expect(response.status).toBe(404);
		});
	});
});
