const validator = require('./validator');
const { check } = require('express-validator');

class changePasswordValidator extends validator {
	handle() {
		return [
			check('oldPassword', 'newPassword', 'repeatPassword')
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

module.exports = new changePasswordValidator();
