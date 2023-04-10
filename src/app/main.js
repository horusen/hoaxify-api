const sequelize = require("../config/database");
const app = require("./app");
const dotenv = require("dotenv");

app.listen(3000, async () => {
	dotenv.config({ debug: process.env.DEBUG });

	try {
		await sequelize.authenticate();
		console.log("Database connected succesfully");
	} catch (err) {
		console.error("Unable to connect to the database:", error);
	}
});
