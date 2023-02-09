const validator = require('app/http/validators/validator');
const { check } = require('express-validator');

class adminResetPasswordValidator extends validator {
	handle() {
		return [
			check('email').isEmail().withMessage('فیلد ایمیل معتبر نیست'),
			check('token').not().isEmpty().withMessage('فیلد توکن الزامی است'),
			check('password')
				.isLength({ min: 8 })
				.trim()
				.withMessage('رمز عبور نمیتواند کمتر از 8 حرف باشد')
				.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/)
				.withMessage(
					'رمز عبور باید شامل حروف بزرگ (...ABC)، حروف کوچک (...abc) و کاراکتر ها (_-!@&#$) باشد'
				)
				.custom(async (value, { req }) => {
					if (value !== req.body.repeatPassword)
						throw new Error('رمز عبور با تکرار آن برابر نیست');
				}),
		];
	}
}

module.exports = new adminResetPasswordValidator();
