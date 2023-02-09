//TODO: Helpers for pass data to views

const path = require('path');
const autoBind = require('auto-bind');
const moment = require('moment-jalaali');
const textVersion = require('textversionjs');
moment.loadPersian({ usePersianDigits: true });

module.exports = class Helpers {
	constructor(req, res) {
		autoBind(this);
		this.req = req;
		this.res = res;
		this.formData = this.req.flash('formData')[0];
	}

	getObjects() {
		return {
			user: this.req.user,
			req: this.req,
			res: this.res,
			viewPath: this.viewPath,
			auth: this.auth(),
			...this.getGlobalVariables(),
			complete: this.complete,
			date: this.date,
			fund: this.fund,
			htmlToText: this.htmlToText,
			financial: this.financial,
		};
	}

	financial(number) {
		return new Intl.NumberFormat('en-US', {
			currency: 'USD',
			minimumFractionDigits: 0,
		}).format(number);
	}

	viewPath(dir) {
		return path.resolve(config.layout.view_dir + '/' + dir);
	}

	auth() {
		return {
			check: this.req.isAuthenticated(),
			url: this.req.originalUrl,
		};
	}

	getGlobalVariables() {
		return {
			errors: this.req.flash('errors'),
			messages: this.req.flash('messages'),
			warnings: this.req.flash('warnings'),
			infos: this.req.flash('infos'),
		};
	}

	complete(field, defaultValue = '') {
		return this.formData && Object.hasOwnProperty.call(this.formData, field)
			? this.formData[field]
			: defaultValue;
	}

	date(time) {
		return moment(time).locale('fa');
	}

	fund(text) {
		return text.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
	}

	htmlToText(text) {
		return textVersion(text);
	}
};
