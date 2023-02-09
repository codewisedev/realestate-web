class csrfErrorHandler {
	async handle(err, req, res, next) {
		if (err.code !== 'EBADCSRFTOKEN') return next(err);
		res.status(403).send('Form Tempered With');
	}
}

module.exports = new csrfErrorHandler();
