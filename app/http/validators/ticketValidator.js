const validator = require('./validator');
const { check } = require('express-validator');

class ticketValidator extends validator {
	handle() {
		return [
			check('title')
				.isLength({ min: 5 })
				.withMessage('فیلد عنوان نمی تواند کمتر از 5 حرف باشد'),
			check('content').notEmpty().withMessage('متن نمیتواند خالی باشد'),
		];
	}
}

module.exports = new ticketValidator();
