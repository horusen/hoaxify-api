const request = require("supertest");
const app = require("../../app");
const User = require("../../user/user.model");
const sequelize = require("../../../loader/database");
const nodemailerStub = require("nodemailer-stub");
const emailService = require("../../utils/email-service");
const smtpServer = require("smtp-server").SMTPServer;

const user = { username: "Omar", email: "omar@email.com", password: "P4ssword@" };
const URL = "/api/v1/users";
let lastMail, server;

beforeAll(async () => {
	server = new smtpServer({
		authOptional: true,
		onData(stream, session, callback) {
			let emailBody;
			stream.on("data", (data) => {
				emailBody = data.toString();
			});
			stream.on("end", () => {
				lastMail = emailBody;
				callback();
			});
		},
	});

	server.listen(587, "0.0.0.0");

	await sequelize.sync();
});

beforeEach(async () => {
	await User.destroy({ truncate: true, force: true });
});

afterAll(async () => {
	await server.close();
});

describe("Registration controller", () => {
	const apiCall = (userp = user) => request(app).post(URL).send(userp);
	const errorMessage = {
		error: "Validation failed",
		email: {
			required: "Email is required",
			invalid: "Please enter a valid email address",
			inUse: "Email is already in use",
		},
		username: {
			required: "Username is required",
		},
		password: {
			required: "Password is required",
			length: "Please enter a password with 6 or more characters",
			invalid: "Password must contain at least one uppercase, one lowercase, one number and one special character",
		},
	};
	let result;

	beforeEach(async () => {
		if (!expect.getState().currentTestName.includes("<<skip-beforeEach>>")) result = await apiCall();
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
		${"username"} | ${undefined}    | ${errorMessage.username.required}
		${"email"}    | ${undefined}    | ${errorMessage.email.required}
		${"password"} | ${undefined}    | ${errorMessage.password.required}
		${"email"}    | ${"email"}      | ${errorMessage.email.invalid}
		${"email"}    | ${"email.com"}  | ${errorMessage.email.invalid}
		${"email"}    | ${"email@.com"} | ${errorMessage.email.invalid}
		${"email"}    | ${"@email.com"} | ${errorMessage.email.invalid}
		${"password"} | ${"passw"}      | ${errorMessage.password.length}
		${"password"} | ${"password"}   | ${errorMessage.password.invalid}
		${"password"} | ${"PASSWORD"}   | ${errorMessage.password.invalid}
		${"password"} | ${"Password1"}  | ${errorMessage.password.invalid}
	`("Should return a validation failed when $field is $value", async ({ field, value, message }) => {
		const userp = { ...user, [field]: value };
		const result = await apiCall(userp);
		expect(result.body.message).toBe(errorMessage.error);
		expect(result.statusCode).toBe(422);
		expect(result.body.errors[field]).toBe(message);
	});

	it("Should return an error message with a 422 status code if the email is already been used", async () => {
		await apiCall();
		const result = await apiCall();
		expect(result.statusCode).toBe(422);
		expect(result.body.message).toBe("Validation failed");
		expect(result.body.errors.email).toBe("Email is already in use");
	});

	it("Should create a new user with a default inactive status", async () => {
		const user = await User.findOne({ where: { email: result.body.data.email } });
		expect(user.active).toBe(false);
	});

	it("Should create the user with an activation token", async () => {
		const user = await User.findOne({ where: { email: result.body.data.email } });
		expect(user.activationToken).toBeTruthy();
	});

	// it("Sends an account activation token to the user email", async () => {
	// 	console.log(lastMail);
	// 	const userDB = await User.findOne({ where: { email: user.email } }).catch((err) => console.log(err));
	// 	expect(lastMail).toContain(userDB.email);
	// 	expect(lastMail.content).toContain(userDB.activationToken);
	// });

	it("Should return a 502 status code if the email service is not working <<skip-beforeEach>>", async () => {
		const mock = jest.spyOn(emailService, "sendActivationEmail").mockRejectedValue(new Error("Failed to send email"));
		const result = await apiCall();
		expect(result.statusCode).toBe(502);
		expect(result.body.message).toBe("Error sending activation email");
		mock.mockRestore();
	});

	it("Should not save the user in the DB if the email fails <<skip-beforeEach>>", async () => {
		const mock = jest.spyOn(emailService, "sendActivationEmail").mockRejectedValue(new Error("Failed to send email"));
		await apiCall();
		const users = await User.findAll();
		expect(users.length).toBe(0);
		mock.mockRestore();
	});

	describe("Should activate the user account", () => {
		const PREFIX_ACCOUNT_ACTIVATION_URL = "/api/v1/users/activation";
		let users;
		beforeEach(async () => {
			if (!expect.getState().currentTestName.includes("<<skip-beforeEach-activation-token>>")) {
				users = await User.findAll();
				await request(app).get(`${PREFIX_ACCOUNT_ACTIVATION_URL}/${users[0].activationToken}`);
				users = await User.findAll();
			}
		});

		it("Should activate the user account", async () => {
			expect(users[0].active).toBe(true);
		});

		it("Should delete user's token after activation ", async () => {
			expect(users.activationToken).toBeFalsy();
		});

		it("Should return a 400 status code if the token is invalid <<skip-beforeEach-activation-token>>", async () => {
			users = await User.findAll();
			const result = await request(app).get(`${PREFIX_ACCOUNT_ACTIVATION_URL}/invalidToken`);
			users = await User.findAll();
			expect(result.statusCode).toBe(400);
			expect(users[0].active).toBe(false);
			expect(result.body.message).toBe("Invalid activation token");
		});
	});
});

// describe("Internationation", () => {
// 	const apiCall = (userp = user) => request(app).post(URL).set("Accept-Language", "fr").send(userp);
// 	let errorMessage = {
// 		error: "Erreur de validation",
// 		email: {
// 			required: "Email est requis",
// 			invalid: "Veuillez saisir une adresse email valide",
// 			inUse: "Email est déjà utilisé",
// 		},
// 		username: {
// 			required: "Nom d'utilisateur est requis",
// 		},
// 		password: {
// 			required: "Mot de passe est requis",
// 			short: "Veuillez saisir un mot de passe avec 6 caractères ou plus",
// 			invalid: "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial",
// 		},
// 	};
// 	it.each`
// 		field         | value           | message
// 		${"username"} | ${undefined}    | ${errorMessage.username.required}
// 		${"email"}    | ${undefined}    | ${errorMessage.email.required}
// 		${"password"} | ${undefined}    | ${errorMessage.password.required}
// 		${"email"}    | ${"email"}      | ${errorMessage.email.invalid}
// 		${"email"}    | ${"email.com"}  | ${errorMessage.email.invalid}
// 		${"email"}    | ${"email@.com"} | ${errorMessage.email.invalid}
// 		${"email"}    | ${"@email.com"} | ${errorMessage.email.invalid}
// 		${"password"} | ${"passw"}      | ${errorMessage.password.length}
// 		${"password"} | ${"password"}   | ${errorMessage.password.invalid}
// 		${"password"} | ${"PASSWORD"}   | ${errorMessage.password.invalid}
// 		${"password"} | ${"Password1"}  | ${errorMessage.password.invalid}
// 	`("Should return a validation failed when $field is $value", async ({ field, value, message }) => {
// 		const userp = { ...user, [field]: value };
// 		const result = await apiCall(userp);
// 		expect(result.body.message).toBe(errorMessage.error);
// 		expect(result.statusCode).toBe(422);
// 		log(result.body.errors);
// 		expect(result.body.errors[field]).toBe(message);
// 	});
// });
