const validator = require('./validator');
const { check } = require('express-validator');
const Permission = require('app/models/permission');

class permissionValidator extends validator {
	handle() {
		return [
			check('label')
				.not()
				.isEmpty()
				.withMessage('فیلد برچسب نمی تواند خالی بماند')
				.custom(async (value, { req }) => {
					if (req.query._method === 'PUT') {
						let permission = await Permission.findById(req.params.id);
						if (permission.label === value) return;
					}
					let permission = await Permission.findOne({ label: value });
					if (permission) {
						throw new Error(
							'چنین اجازه دسترسی با این برچسب قبلا ساخته شده است',
						);
					}
				}),

			check('desc')
				.not()
				.isEmpty()
				.withMessage('فیلد توضیح نمیتواند خالی بماند'),
		];
	}
}

module.exports = new permissionValidator();
