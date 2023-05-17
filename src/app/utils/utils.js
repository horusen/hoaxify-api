const { validationResult } = require("express-validator");
const i18next = require("i18next");

const getValidationErrors = (req) => {
	const validationErrors = validationResult(req);
	let errors = {};
	if (!validationErrors.isEmpty()) {
		validationErrors.errors.forEach((error) => {
			errors[error.param] = translate(error.msg);
		});
	}

	return errors;
};

const translate = i18next.t;

module.exports = {
	getValidationErrors,
	translate,
};
