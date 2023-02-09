const controller = require('app/http/controllers/controller');
const fs = require('fs');

class profileController extends controller {
	async index(req, res, next) {
		try {
			const title = 'پروفایل کاربری';
			let myAlerts = await this.model.Alert.find({
				$and: [{ user: req.user._id }],
			}).sort([['createdAt', -1]]);
			await this.model.Alert.updateMany(
				{ user: req.user._id },
				{ $set: { status: true } },
			);
			res.render('admin/profile', { title, myAlerts });
		} catch (error) {
			next(error);
		}
	}

	async update(req, res, next) {
		try {
			let status = await this.validationData(req);
			if (!status) {
				if (req.file) fs.unlinkSync(req.file.path);
				return this.back(req, res);
			}
			let objForUpdate = {};
			//Todo: Check Image is not empty
			if (req.file) {
				delete req.body.avatar;
				objForUpdate.avatar = this.getImageAddress(req.file);
			}
			delete req.body.image;
			await this.model.User.updateOne(
				{ _id: req.params.id },
				{ $set: { ...req.body, ...objForUpdate } },
			);
			return res.redirect('/admin/profile');
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new profileController();
