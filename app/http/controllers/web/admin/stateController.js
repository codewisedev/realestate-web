const controller = require('app/http/controllers/controller');

class stateController extends controller {
	async index(req, res, next) {
		try {
			let states = await this.model.State.find()
				.populate('city')
				.sort({ createdAt: -1 });
			const title = 'لیست استان ها';
			res.render('admin/location/state', { title, states });
		} catch (error) {
			next(error);
		}
	}

	async store(req, res, next) {
		try {
			let { title } = req.body;
			if (!title) {
				this.toast(req, {
					text: 'فیلد عنوان خالی است',
					iconClass: 'toast-error',
				});
				return this.back(req, res);
			}
			await new this.model.State({
				title,
			}).save();
			return res.redirect('/admin/location/state');
		} catch (err) {
			next(err);
		}
	}

	async update(req, res, next) {
		try {
			let { title } = req.body;
			if (!title) {
				this.toast(req, {
					text: 'فیلد عنوان خالی است',
					iconClass: 'toast-error',
				});
				return this.back(req, res);
			}
			await this.model.State.findByIdAndUpdate(req.params.id, {
				$set: { title },
			});
			this.toast(req, {
				text: 'آیتم با موفقیت تغییر یافت',
				iconClass: 'toast-success',
			});
			return res.redirect('/admin/location/state');
		} catch (error) {
			next(error);
		}
	}

	async destroy(req, res, next) {
		try {
			let state = await this.model.State.findById(req.params.id);
			if (!state) {
				this.toast(req, {
					text: 'چنین استانی یافت نشد',
					iconClass: 'toast-error',
				});
				return this.back(req, res);
			}
			state.remove();
			this.toast(req, {
				text: 'آیتم انتخابی حذف شد',
				iconClass: 'toast-success',
			});
			return res.redirect('/admin/location/state');
		} catch (error) {
			next(error);
		}
	}

	async conditionTrue(req, res, next) {
		try {
			await this.model.State.findByIdAndUpdate(req.params.id, {
				$set: { condition: true },
			});
			this.toast(req, {
				text: 'آیتم انتخابی فعال شد',
				iconClass: 'toast-success',
			});
			return res.redirect('/admin/location/state');
		} catch (error) {
			next(error);
		}
	}

	async conditionFalse(req, res, next) {
		try {
			await this.model.State.findByIdAndUpdate(req.params.id, {
				$set: { condition: false },
			});
			this.toast(req, {
				text: 'آیتم انتخابی غیرفعال شد',
				iconClass: 'toast-error',
			});
			return res.redirect('/admin/location/state');
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new stateController();
