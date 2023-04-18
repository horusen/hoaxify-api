class HttpError extends Error {
	constructor(message, statusCode, errors = {}) {
		super(message);
		this.code = statusCode;
		this.errors = errors;
	}
}

module.exports = HttpError;
