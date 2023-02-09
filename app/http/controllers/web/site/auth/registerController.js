const controller = require('app/http/controllers/controller');
const passport = require('passport');

class registerController extends controller {
	showRegisterForm(req, res, next) {
		try {
			const title = 'ثبت نام';
			res.render('site/auth/register', {
				title,
				recaptcha: this.recaptcha.render(),
			});
		} catch (error) {
			next(error);
		}
	}

	async registerProccess(req, res, next) {
		await this.recaptchaValidation(req, res);
		let result = await this.validationData(req);
		if (result) return this.register(req, res, next);
		return this.back(req, res);
	}

	register(req, res, next) {
		passport.authenticate('site.register', {
			successRedirect: '/login',
			failureRedirect: '/register',
			failureFlash: true,
		})(req, res, next);
	}
}

module.exports = new registerController();
