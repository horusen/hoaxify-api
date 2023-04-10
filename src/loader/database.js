const Sequelize = require("sequelize");
const config = require("config");

const sequelize = new Sequelize(config.get("DATABASE").NAME, config.get("DATABASE").USERNAME, config.get("DATABASE").PASSWORD, {
	dialect: config.get("DATABASE").DIALECT,
	storage: config.get("DATABASE").STORAGE,
	logging: config.get("DATABASE").LOGGING,
});
module.exports = sequelize;
