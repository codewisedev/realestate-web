const validator = require('app/http/validators/validator');
const { check } = require('express-validator');

class agentResetPasswordValidator extends validator {
	handle() {
		return [
			check('code')
				.isLength({ min: 4 })
				.withMessage('کد وارد شده نا معتبر است'),
			check('password')
				.isLength({ min: 8 })
				.trim()
				.withMessage('رمز عبور نمیتواند کمتر از 8 حرف باشد')
				.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/)
				.withMessage(
					'رمز عبور باید شامل حروف بزرگ (...ABC)، حروف کوچک (...abc) و کاراکتر ها (_-!@&#$) باشد',
				)
				.custom(async (value, { req }) => {
					if (value !== req.body.repeatPassword)
						throw new Error('رمز عبور با تکرار آن برابر نیست');
				}),
		];
	}
}

module.exports = new agentResetPasswordValidator();
