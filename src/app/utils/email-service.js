const nodemailer = require("nodemailer");
const nodemailerStub = require("nodemailer-stub");

const config = require("config");
const emailConfig = config.get("EMAIL");

const sendActivationEmail = async (user) => {
	const transport = nodemailer.createTransport({
		...emailConfig,
	});

	transport.verify().then(console.log).catch(console.error);
	await transport.sendMail({
		from: config.get("EMAIL").USERNAME,
		to: user.email,
		subject: "Account activation",
		html: `
			<h2>Congratulation for signing up!</h2>
			<p>Hi ${user.username}</p>
			<p>Please click below to activate you account</p>
			<p><a href="${config.get("CLIENT_URL")}/users/activation/${user.activationToken}">Activate</a></p>	
		`,
	});

	transport.close();
};

module.exports = { sendActivationEmail };
