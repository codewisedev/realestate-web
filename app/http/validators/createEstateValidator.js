const validator = require('app/http/validators/validator');
const { check } = require('express-validator');

class createEstateValidator extends validator {
	handle() {
		return [
			check('mobile')
				.isLength({ min: 11 })
				.withMessage('شماره موبایل معتبر نمی باشد'),
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
		];
	}
}

module.exports = new createEstateValidator();
