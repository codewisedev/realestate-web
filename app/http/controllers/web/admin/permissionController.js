const controller = require('app/http/controllers/controller');

class permissionController extends controller {
	async index(req, res, next) {
		try {
			let page = req.query.page || 1;
			let permissions = await this.model.Permission.paginate(
				{},
				{ page, sort: { createdAt: -1 }, limit: 5 },
			);
			res.render('admin/users/permissions', {
				title: 'مجوز ها',
				permissions,
			});
		} catch (err) {
			next(err);
		}
	}

	async create(req, res, next) {
		try {
			res.render('admin/users/permissions/create', {
				title: 'ایجاد مجوز جدید',
			});
		} catch (error) {
			next(error);
		}
	}

	async store(req, res, next) {
		try {
			let status = await this.validationData(req);
			if (!status) return this.back(req, res);
			let { label, desc } = req.body;
			let newPermission = new this.model.Permission({
				label,
				desc,
			});
			await newPermission.save();
			return res.redirect('/admin/users/permissions');
		} catch (err) {
			next(err);
		}
	}

	async edit(req, res, next) {
		try {
			this.isMongoId(req.params.id);
			let permission = await this.model.Permission.findById(req.params.id);
			if (!permission) this.error('چنین اجازه دسترسی وجود ندارد', 404);
			return res.render('admin/users/permissions/edit', { permission });
		} catch (err) {
			next(err);
		}
	}

	async update(req, res, next) {
		try {
			let status = await this.validationData(req);
			if (!status) return this.back(req, res);
			let { label, desc } = req.body;
			await this.model.Permission.findByIdAndUpdate(req.params.id, {
				$set: {
					label,
					desc,
				},
			});
			return res.redirect('/admin/users/permissions');
		} catch (err) {
			next(err);
		}
	}

	async destroy(req, res, next) {
		try {
			this.isMongoId(req.params.id);
			let permission = await this.model.Permission.findById(req.params.id);
			if (!permission) this.error('چنین اجازه دسترسی وجود ندارد', 404);
			permission.remove();
			return res.redirect('/admin/users/permissions');
		} catch (err) {
			next(err);
		}
	}
}

module.exports = new permissionController();
