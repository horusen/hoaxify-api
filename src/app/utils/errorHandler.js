// This middleware is used to handle errors in the application.
// It is used in the main app.js file.
module.exports = function (err, req, res, next) {
	const response = { message: err.message };
	if (Object.keys(err.errors).length > 0) {
		response.errors = err.errors;
	}
	res.status(err.code).send(response);
};
