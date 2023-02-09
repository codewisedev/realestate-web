const controller = require('app/http/controllers/controller');

class logController extends controller {
	async index(req, res, next) {
		try {
			let logs = await this.model.Device.find({ user: req.user._id }).sort({
				time: -1,
			});
			const title = 'گزارش ورود به پنل';
			res.render('admin/setting/log', { title, logs });
		} catch (error) {
			next(error);
		}
	}

	async conditionTrue(req, res, next) {
		try {
			await this.model.Device.findByIdAndUpdate(req.params.id, {
				$set: { status: true },
			});
			this.toast(req, {
				text: 'آدرس انتخابی مجاز شد',
				iconClass: 'toast-success',
			});
			return this.back(req, res);
		} catch (error) {
			next(error);
		}
	}

	async conditionFalse(req, res, next) {
		try {
			await this.model.Device.findByIdAndUpdate(req.params.id, {
				$set: { status: false },
			});

			this.toast(req, {
				text: 'آدرس انتخابی غیر مجاز شد',
				iconClass: 'toast-error',
			});
			return this.back(req, res);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new logController();
