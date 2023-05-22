const paginate = ({ pageSize, page }) => {
	pageSize = pageSize || 10;
	page = page || 1;
	const test = { offset: (page - 1) * pageSize, limit: pageSize };
	return test;
};

module.exports = paginate;
