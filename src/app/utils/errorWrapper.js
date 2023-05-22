// This is a middleware that wraps the controller functions in a try/catch block
// and passes any errors to the next middleware (errorHandler)
const use = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = use;
