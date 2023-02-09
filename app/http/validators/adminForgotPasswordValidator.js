const validator = require('app/http/validators/validator');
const { check } = require('express-validator');

class adminForgotPasswordValidator extends validator {
	handle() {
		return [check('email').isEmail().withMessage('فیلد ایمیل معتبر نیست')];
	}
}

module.exports = new adminForgotPasswordValidator();
