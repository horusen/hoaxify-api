const request = require("supertest");

const config = require("config");
const app = require("../app");
const User = require("./user.model");
const sequelize = require("../../loader/database");
const { before, after } = require("node:test");

const API_ENDPOINT = `/api/v1/users`;
const apiCall = () => request(app).get(API_ENDPOINT);

describe("User controller", () => {
	beforeAll(async () => {
		await sequelize.sync();
	});

	// beforeEach(async () => {
	// 	// await User.destroy({ truncate: true, force: true });
	// });

	describe("GET /users", () => {
		let response;
		beforeAll(async () => {
			const users = [
				{ username: "Omar", email: "omar@email.com", password: "P4ssword@" },
				{ username: "Jerome", email: "jerome@email.com", password: "P4ssword@" },
				{ username: "Salif", email: "salif@email.com", password: "P4ssword@" },
			];

			await User.bulkCreate(users);
		});

		afterAll(async () => {
			await User.destroy({ truncate: true, force: true });
		});

		beforeEach(async () => {
			response = await apiCall();
		});

		it("Should return a 200 status code", async () => {
			expect(response.status).toBe(200);
		});

		it("Should return a message User fetched succesfully", async () => {
			expect(response.body.message).toBe("Users fetched succesfully");
		});

		it("Should return all users", async () => {
			console.log(response.body.data);
			const data = response.body.data;
			expect(data.length).toBe(3);
		});
	});
});
