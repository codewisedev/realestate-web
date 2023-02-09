const controller = require('app/http/controllers/controller');
const passport = require('passport');

class loginController extends controller {
	showLoginForm(req, res, next) {
		try {
			const title = 'ورود | ثبت نام';
			res.render('auth/agent', { title });
		} catch (error) {
			next(error);
		}
	}

	async loginProccess(req, res, next) {
		try {
			let result = await this.validationData(req);
			if (result) return this.login(req, res, next);
			return this.back(req, res);
		} catch (error) {
			next(error);
		}
	}

	login(req, res, next) {
		try {
			passport.authenticate('agent.login', async (err, user) => {
				if (!user) return res.redirect('/auth/agent');
				this.loginDevice(req, res, user);
				req.login(user, (err) => {
					if (err) throw err;
					user.setRememberToken(res);
					return res.redirect('/agent');
				});
			})(req, res, next);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new loginController();
