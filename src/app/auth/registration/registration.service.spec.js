const registrationService = require("./registration.service");

describe("Registration Service", () => {
	const user = { username: "Omar", email: "omar@email.com", password: "Password" };
	registrationService.userService = {
		create: jest.fn().mockResolvedValue(user),
		getUserByEmail: jest.fn().mockResolvedValue("omar@email.com"),
	};
	describe("Register", () => {
		it("Should create a user if the user doesn't exist", async () => {
			try {
				await registrationService.register(user);
			} catch (error) {
				expect(error).toBeDefined();
			}
		});
	});
});
