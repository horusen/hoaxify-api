const sequelize = require("../loader/database");
const app = require("./app");
const dotenv = require("dotenv");

app.listen(3000, async () => {
	dotenv.config({ debug: process.env.DEBUG });

	try {
		await sequelize.sync({ alter: true });
		console.log("Database connected succesfully");
	} catch (err) {
		console.error("Unable to connect to the database:", err);
	}
});
