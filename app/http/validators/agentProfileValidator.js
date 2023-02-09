const validator = require('app/http/validators/validator');
const { check } = require('express-validator');
const path = require('path');

class agentProfileValidator extends validator {
	handle() {
		return [
			check('name')
				.isLength({ min: 5 })
				.withMessage('فیلد نام نمیتواند کمتر از 5 کاراکتر باشد'),
			check('email').isEmail().withMessage('فیلد ایمیل معتبر نیست'),
			check('image').custom(async (value, { req }) => {
				if (req.query._method === 'PUT' || value === undefined) return;
				let fileExt = ['.png', '.jpg', '.jpeg'];
				if (!fileExt.includes(path.extname(req.file.originalname)))
					throw new Error(
						'عکس وارد شده نا معتبر است، از پسوند های .png یا .jpg استفاده کنید',
					);
			}),
		];
	}
}

module.exports = new agentProfileValidator();
