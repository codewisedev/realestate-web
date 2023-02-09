const validator = require('app/http/validators/validator');
const { check } = require('express-validator');

class adminRegisterValidator extends validator {
	handle() {
		return [
			check('mobile')
				.isLength({ min: 11 })
				.withMessage('شماره موبایل معتبر نمی باشد'),
		];
	}
}

module.exports = new adminRegisterValidator();
