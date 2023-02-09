const autoBind = require('auto-bind');

module.exports = class Middleware {
	constructor() {
		autoBind(this);
	}

	alert(req, data) {
		let title = data.title || '',
			text = data.text || '',
			icon = data.icon || 'info',
			button = data.button || null,
			timer = data.timer || 2000;

		req.flash('sweetalert', { title, text, icon, button, timer });
	}

	back(req, res) {
		req.flash('formData', req.body);
		return res.redirect(req.header('Referer') || '/');
	}
};
