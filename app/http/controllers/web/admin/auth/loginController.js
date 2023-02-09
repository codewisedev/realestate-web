const controller = require('app/http/controllers/controller');
const passport = require('passport');
const os = require('os');
const dns = require('dns');
const macaddress = require('macaddress');

class loginController extends controller {
	showLoginForm(req, res, next) {
		try {
			const title = 'صفحه ورود';
			res.render('auth/admin/login', {
				recaptcha: this.recaptcha.render(),
				title,
			});
		} catch (error) {
			next(error);
		}
	}

	async loginProccess(req, res, next) {
		try {
			await this.recaptchaValidation(req, res);
			let result = await this.validationData(req);
			if (result) return this.login(req, res, next);
			return this.back(req, res);
		} catch (error) {
			next(error);
		}
	}

	login(req, res, next) {
		try {
			passport.authenticate('admin.login', async (err, user) => {
				if (!user) return res.redirect('/auth/admin');
				await dns.lookup(os.hostname(), async (err, ip) => {
					if (err) throw err;
					let device = await this.model.Device.findOne({
						ip,
						user: user._id,
					});
					if (!device) {
						let host = os.hostname() + '-' + os.platform();
						let title = req.device.type.toUpperCase();
						await macaddress.one((err, mac) => {
							if (err) throw err;
							new this.model.Device({
								ip,
								title,
								host,
								mac,
								user: user._id,
							}).save();
							this.notification(
								user._id,
								'گزارش ورود',
								`کاربری با آدرس ${ip} در تاریخ ${this.date(Date.now()).format(
									'jYYYY/jMM/jDD',
								)} و ساعت ${this.date(Date.now()).format(
									'HH:mm:ss',
								)} وارد سامانه شما شده است. در صورت ورود غیر مجاز آن را درمنوی گزارش ورود به پنل مسدود نمایید.`,
								config.alert.warning,
							);
						});
					} else if (!device.status) {
						this.alert(req, {
							title: 'اخطار',
							text: 'شما اجازه ی دسترسی به این پروفایل را ندارید',
							icon: 'error',
							button: 'بستن',
						});
						req.logout();
						res.clearCookie('remember_token');
						this.back(req, res);
					} else
						await this.model.Device.updateOne({ $set: { time: Date.now() } });
					await user.updateOne({ $set: { currentIp: ip } });
					req.login(user, (err) => {
						if (err) throw err;
						if (req.body.remember) user.setRememberToken(res);
						return res.redirect('/admin');
					});
				});
			})(req, res, next);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new loginController();
