const Sequelize = require("sequelize");
const sequelize = require("../../loader/database");

module.exports = sequelize.define(
	"user",
	{
		username: {
			type: Sequelize.STRING,
		},
		email: {
			type: Sequelize.STRING,
		},
		password: {
			type: Sequelize.STRING,
		},
	},
	{
		sequelize,
		modelName: "User",
		paranoid: true,
	}
);
