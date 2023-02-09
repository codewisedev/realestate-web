const controller = require('app/http/controllers/controller');

class resetPasswordController extends controller {
	showResetPassword(req, res, next) {
		try {
			const title = 'بازیابی رمز عبور';
			res.render('auth/admin/reset-password/reset', {
				recaptcha: this.recaptcha.render(),
				title,
				token: req.params.token,
			});
		} catch (error) {
			next(error);
		}
	}

	async resetPasswordProccess(req, res, next) {
		try {
			await this.recaptchaValidation(req, res);
			let result = await this.validationData(req);
			if (result) return this.resetPassword(req, res);
			return this.back(req, res);
		} catch (error) {
			next(error);
		}
	}

	async resetPassword(req, res) {
		let field = await this.model.PasswordReset.findOne({
			$and: [{ email: req.body.email }, { token: req.body.token }],
		});
		if (!field) {
			req.flash('errors', 'اطلاعات وارد شده صحیح نیست');
			return this.back(req, res);
		}
		if (field.use) {
			req.flash('errors', 'این لینک منقضی شده است');
			return this.back(req, res);
		}
		let user = await this.model.User.findOne({ email: field.email });
		user.$set({ password: user.hashPassword(req.body.password) });
		await user.save();
		if (!user) {
			req.flas('errors', 'بازیابی رمز انجام نشد');
			return this.back(req, res);
		}
		await field.updateOne({ use: true });
		return res.redirect('/auth/admin');
	}
}

module.exports = new resetPasswordController();
