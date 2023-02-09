const controller = require('app/http/controllers/controller');

class passwordController extends controller {
	async index(req, res, next) {
		try {
			const title = 'ویرایش رمز عبور';
			res.render('admin/setting/password', { title });
		} catch (error) {
			next(error);
		}
	}

	async change(req, res, next) {
		try {
			let status = await this.validationData(req);
			if (!status) return this.back(req, res);
			let { oldPassword, newPassword, repeatPassword } = req.body;
			if (!req.user.comparePassword(oldPassword))
				req.flash('errors', 'رمز عبور قبلی را اشتباه وارد کردید');
			else if (newPassword != repeatPassword)
				req.flash('errors', 'رمز عبور جدید و تکرار آن مطابقت ندارد');
			else {
				await req.user.updateOne({
					$set: { password: req.user.hashPassword(newPassword) },
				});
				this.toast(req, {
					iconClass: 'toast-success',
					text: 'رمز عبور با موفقیت تغییر یافت',
				});
			}
			return this.back(req, res);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new passwordController();
