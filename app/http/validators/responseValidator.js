const validator = require('./validator');
const { check } = require('express-validator');

class responseValidator extends validator {
	handle() {
		return [
			check('response')
				.notEmpty()
				.withMessage('فیلد پاسخ نمی تواند خالی بماند'),
		];
	}
}

module.exports = new responseValidator();
