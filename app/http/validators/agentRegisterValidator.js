const validator = require('app/http/validators/validator');
const { check } = require('express-validator');
const path = require('path');

class agentRegisterValidator extends validator {
	handle() {
		return [
			check('name')
				.not()
				.isEmpty()
				.withMessage('فیلد نام مدیر نمی تواند خالی بماند'),
			check('title')
				.not()
				.isEmpty()
				.withMessage('فیلد عنوان نمی تواند خالی بماند'),
			check('address')
				.not()
				.isEmpty()
				.withMessage('فیلد آدرس نمی تواند خالی بماند'),
			check('logo').custom(async (value, { req }) => {
				if (req.query._method === 'PUT' || value === undefined) return;
				let fileExt = ['.png', '.jpg', '.jpeg'];
				if (!fileExt.includes(path.extname(req.files.logo[0].originalname)))
					throw new Error(
						'عکس وارد شده نا معتبر است، از پسوند های .png یا .jpg استفاده کنید',
					);
			}),
			check('profile').custom(async (value, { req }) => {
				if (req.query._method === 'PUT' || value === undefined) return;
				let fileExt = ['.png', '.jpg', '.jpeg'];
				if (!fileExt.includes(path.extname(req.files.profile[0].originalname)))
					throw new Error(
						'عکس وارد شده نا معتبر است، از پسوند های .png یا .jpg استفاده کنید',
					);
			}),
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

module.exports = new agentRegisterValidator();
