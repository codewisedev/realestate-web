const validator = require('app/http/validators/validator');
const { check } = require('express-validator');

class adminLoginValidator extends validator {
	handle() {
		return [
			check('email').isEmail().withMessage('فیلد ایمیل معتبر نیست'),
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

module.exports = new adminLoginValidator();
