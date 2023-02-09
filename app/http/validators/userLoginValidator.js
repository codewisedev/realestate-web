const validator = require('app/http/validators/validator');
const { check } = require('express-validator');

class adminRegisterValidator extends validator {
	handle() {
		return [
			check('mobile')
				.isLength({ min: 11 })
				.withMessage('شماره موبایل معتبر نمی باشد'),
			check('password')
				.isLength({ min: 8 })
				.trim()
				.withMessage('رمز عبور نمیتواند کمتر از 8 حرف باشد')
				.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/)
				.withMessage(
					'رمز عبور باید شامل حروف بزرگ (...ABC)، حروف کوچک (...abc) و کاراکتر ها (_-!@&#$) باشد',
				),
		];
	}
}

module.exports = new adminRegisterValidator();
