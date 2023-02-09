const controller = require('app/http/controllers/controller');

class regionController extends controller {
	async index(req, res, next) {
		try {
			let cities = await this.model.City.find().sort({ createdAt: -1 });
			let regions = await this.model.Region.find().sort({ createdAt: -1 });
			const title = 'لیست ناحیه ها';
			res.render('admin/location/region', { title, cities, regions });
		} catch (error) {
			next(error);
		}
	}

	async store(req, res, next) {
		try {
			let { title, city } = req.body;
			if (!title) {
				this.toast(req, {
					text: 'فیلد عنوان خالی است',
					iconClass: 'toast-error',
				});
				return this.back(req, res);
			}
			let newRegion = new this.model.Region({
				title,
				city,
			});
			await newRegion.save(async (err, item) => {
				await this.model.City.updateOne(
					{ _id: req.body.city },
					{ $push: { region: item._id } },
				);
			});
			return res.redirect('/admin/location/region');
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
			await this.model.Region.findByIdAndUpdate(req.params.id, {
				$set: { title },
			});
			this.toast(req, {
				text: 'آیتم با موفقیت تغییر یافت',
				iconClass: 'toast-success',
			});
			return res.redirect('/admin/location/region');
		} catch (error) {
			next(error);
		}
	}

	async destroy(req, res, next) {
		try {
			let region = await this.model.Region.findById(req.params.id);
			if (!region) {
				this.toast(req, {
					text: 'چنین ناحیه ای یافت نشد',
					iconClass: 'toast-error',
				});
				return this.back(req, res);
			}
			await this.model.City.updateOne(
				{ _id: region.city },
				{ $pull: { region: region._id } },
			);
			region.remove();
			this.toast(req, {
				text: 'آیتم انتخابی حذف شد',
				iconClass: 'toast-success',
			});
			return res.redirect('/admin/location/region');
		} catch (error) {
			next(error);
		}
	}

	async conditionTrue(req, res, next) {
		try {
			await this.model.Region.findByIdAndUpdate(req.params.id, {
				$set: { condition: true },
			});
			this.toast(req, {
				text: 'آیتم انتخابی فعال شد',
				iconClass: 'toast-success',
			});
			return res.redirect('/admin/location/region');
		} catch (error) {
			next(error);
		}
	}

	async conditionFalse(req, res, next) {
		try {
			await this.model.Region.findByIdAndUpdate(req.params.id, {
				$set: { condition: false },
			});
			this.toast(req, {
				text: 'آیتم انتخابی غیرفعال شد',
				iconClass: 'toast-error',
			});
			return res.redirect('/admin/location/region');
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new regionController();
