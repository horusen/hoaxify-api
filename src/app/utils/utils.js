const { validationResult } = require("express-validator");

const getValidationErrors = (req) => {
	const validationErrors = validationResult(req);
	let errors = {};
	if (!validationErrors.isEmpty()) {
		validationErrors.errors.forEach((error) => {
			errors[error.param] = error.msg;
		});
	}

	return errors;
};

module.exports = {
	getValidationErrors,
};
