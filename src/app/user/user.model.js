const Sequelize = require("sequelize");
const sequelize = require("../../loader/database");

module.exports = sequelize.define(
	"user",
	{
		username: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		email: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: "User",
		paranoid: true,
	}
);
