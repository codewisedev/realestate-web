const controller = require('app/http/controllers/controller');

class cityController extends controller {
	async index(req, res, next) {
		try {
			let states = await this.model.State.find().sort({ createdAt: -1 });
			let cities = await this.model.City.find()
				.populate('region')
				.sort({ createdAt: -1 });
			const title = 'لیست شهر ها';
			res.render('admin/location/city', { title, states, cities });
		} catch (error) {
			next(error);
		}
	}

	async store(req, res, next) {
		try {
			let { title, state } = req.body;
			if (!title) {
				this.toast(req, {
					text: 'فیلد عنوان خالی است',
					iconClass: 'toast-error',
				});
				return this.back(req, res);
			}
			let newCity = new this.model.City({
				title,
				state,
			});
			await newCity.save(async (err, item) => {
				await this.model.State.updateOne(
					{ _id: req.body.state },
					{ $push: { city: item._id } },
				);
			});
			return res.redirect('/admin/location/city');
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
			await this.model.City.findByIdAndUpdate(req.params.id, {
				$set: { title },
			});
			this.toast(req, {
				text: 'آیتم با موفقیت تغییر یافت',
				iconClass: 'toast-success',
			});
			return res.redirect('/admin/location/city');
		} catch (error) {
			next(error);
		}
	}

	async destroy(req, res, next) {
		try {
			let city = await this.model.City.findById(req.params.id);
			if (!city) {
				this.toast(req, {
					text: 'چنین شهری یافت نشد',
					iconClass: 'toast-error',
				});
				return this.back(req, res);
			}
			await this.model.State.updateOne(
				{ _id: city.state },
				{ $pull: { city: city._id } },
			);
			city.remove();
			this.toast(req, {
				text: 'آیتم انتخابی حذف شد',
				iconClass: 'toast-success',
			});
			return res.redirect('/admin/location/city');
		} catch (error) {
			next(error);
		}
	}

	async conditionTrue(req, res, next) {
		try {
			await this.model.City.findByIdAndUpdate(req.params.id, {
				$set: { condition: true },
			});
			this.toast(req, {
				text: 'آیتم انتخابی فعال شد',
				iconClass: 'toast-success',
			});
			return res.redirect('/admin/location/city');
		} catch (error) {
			next(error);
		}
	}

	async conditionFalse(req, res, next) {
		try {
			await this.model.City.findByIdAndUpdate(req.params.id, {
				$set: { condition: false },
			});
			this.toast(req, {
				text: 'آیتم انتخابی غیرفعال شد',
				iconClass: 'toast-error',
			});
			return res.redirect('/admin/location/city');
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new cityController();
