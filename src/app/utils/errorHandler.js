// This middleware is used to handle errors in the application.
// It is used in the main app.js file.
module.exports = function (err, req, res, next) {
	if (Object.keys(err).length === 0) {
		console.log(err);
		err = { message: "Internal server error", code: 500 };
	}

	const response = { message: err.message };

	const errors = err?.errors || {};

	if (Object.keys(errors).length > 0) {
		response.errors = err.errors;
	}
	res.status(err.code).send(response);
};
