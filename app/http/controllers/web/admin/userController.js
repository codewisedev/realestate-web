const controller = require('app/http/controllers/controller');
const Permission = require('app/models/permission');

class userController extends controller {
	async operator(req, res, next) {
		try {
			let operators = await this.model.User.find({ operator: true }).sort([
				['updatedAt', -1],
			]);
			res.render('admin/users/operator', {
				title: 'لیست اپراتورها',
				operators,
			});
		} catch (err) {
			next(err);
		}
	}

	async site(req, res, next) {
		try {
			let siteUsers = await this.model.User.find({
				admin: false,
				agent: false,
				operator: false,
				consultant: false,
			}).sort([['updatedAt', -1]]);
			res.render('admin/users/site', {
				title: 'لیست کاربران سایت',
				siteUsers,
			});
		} catch (err) {
			next(err);
		}
	}

	async create(req, res, next) {
		try {
			let roles = await this.model.Role.find({});
			res.render('admin/users/operator/create', {
				title: 'ایجاد کاربر جدید',
				roles,
			});
		} catch (err) {
			next(err);
		}
	}

	async store(req, res, next) {
		try {
			let status = await this.validationData(req);
			if (!status) return this.back(req, res);
			let role = await this.model.Role.findOne({ _id: req.body.role });
			let { name, email, avatar, mobile } = req.body;
			let password = '@Dr' + mobile;
			let newUser = await new this.model.User({
				operator: true,
				admin: true,
				name,
				email,
				mobile,
				avatar,
				password,
				role: role.title,
				permissions: role.permissions,
			}).save();
			await newUser.$set({ password: newUser.hashPassword(password) });
			return res.redirect('/admin/users/operator');
		} catch (err) {
			next(err);
		}
	}

	async destroy(req, res, next) {
		try {
			this.isMongoId(req.params.id);
			let user = await this.model.User.findById(req.params.id);
			if (!user) this.error('چنین کاربری وجود ندارد', 404);
			user.remove();
			return res.redirect('/admin/users/operator');
		} catch (err) {
			next(err);
		}
	}

	async toggleadmin(req, res, next) {
		try {
			this.isMongoId(req.params.id);
			let user = await this.model.User.findById(req.params.id);
			user.set({ admin: !user.admin });
			await user.save();
			return this.back(req, res);
		} catch (err) {
			next(err);
		}
	}

	async addrole(req, res, next) {
		try {
			this.isMongoId(req.params.id);
			let user = await this.model.User.findById(req.params.id);
			let permissions = await Permission.find({});
			if (!user) this.error('چنین کاربری وجود ندارد', 404);
			res.render('admin/users/operator/add-permission', { user, permissions });
		} catch (err) {
			next(err);
		}
	}

	async storeRoleForUser(req, res, next) {
		try {
			this.isMongoId(req.params.id);
			await this.model.User.updateOne(
				{ _id: req.params.id },
				{
					$set: {
						permissions: req.body.permissions,
					},
				},
			);
			res.redirect('/admin/users/operator');
		} catch (err) {
			next(err);
		}
	}
}

module.exports = new userController();
