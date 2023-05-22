const pagination = (req, res, next) => {
	let page = parseInt(req.query.page) || 1;
	let pageSize = parseInt(req.query.pageSize) || 10;

	if (!pageSize || pageSize < 1 || pageSize > 10) pageSize = 10;
	if (!page || page < 1) page = 1;

	req.pagination = { page, pageSize };
	next();
};

module.exports = pagination;
