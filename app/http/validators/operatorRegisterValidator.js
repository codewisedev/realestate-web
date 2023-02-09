const validator = require('app/http/validators/validator');
const { check } = require('express-validator');

class adminRegisterValidator extends validator {
	handle() {
		return [
			check('name')
				.isLength({ min: 5 })
				.withMessage('فیلد نام نمیتواند کمتر از 5 کاراکتر باشد'),
			check('email').isEmail().withMessage('فیلد ایمیل معتبر نیست'),
			check('mobile')
				.isLength({ min: 11 })
				.withMessage('شماره موبایل معتبر نمی باشد'),
		];
	}
}

module.exports = new adminRegisterValidator();
