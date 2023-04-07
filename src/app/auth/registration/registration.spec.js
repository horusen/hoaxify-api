const request = require("supertest");
const app = require("../../app");

describe("Registration controller", () => {
	it("Should return 200 when the signup request is valid", async () => {
		const r = await request(app).post("/api/1.0/users").send({
			username: "user1",
			email: "user1@email.com",
			password: "P4sswOrd",
		});

		expect(r.statusCode).toBe(200);
	});

	it("Should have a sucess message when the signup request is valid", async () => {
		const r = await request(app).post("/api/1.0/users").send({
			username: "user1",
			email: "user1@email.com",
			password: "P4sswOrd",
		});

		expect(r.body.message).toBe("User created succesfully");
	});
});
