const controller = require('app/http/controllers/controller');

class estateController extends controller {
	async index(req, res, next) {
		try {
			let agents = await this.model.Agent.find({})
				.populate('user agentValid')
				.sort({ createdAt: -1 });
			const title = 'لیست مشاوران املاک';
			res.render('admin/estate', { title, agents });
		} catch (error) {
			next(error);
		}
	}

	async create(req, res, next) {
		try {
			let states = await this.model.State.find();
			const title = 'ایجاد املاکی جدید';
			res.render('admin/estate/create', {
				title,
				states,
			});
		} catch (error) {
			next(error);
		}
	}

	async store(req, res, next) {
		try {
			let status = await this.validationData(req);
			if (!status) return this.back(req, res);
			let { avatar, mobile, name, title, address, state, city } = req.body;
			mobile = this.trimSpace(mobile);
			let user = await this.model.User.findOne({ mobile });
			let password = '@Dr' + mobile;
			if (!user) {
				const newUser = new this.model.User({
					name,
					mobile,
					avatar,
					password,
					agent: true,
				});
				newUser.$set({ password: newUser.hashPassword(password) });
				await newUser.save().then(async (user) => {
					const newLoc = new this.model.Location({
						state,
						city,
						address,
					});
					await newLoc.save().then(async (location) => {
						const newAgent = new this.model.Agent({
							user: user._id,
							title,
							slug: this.slug(title),
							location,
							ref: this.createRefCode(mobile),
						});
						await newAgent.save().then(async (agent) => {
							const newAgentValid = new this.model.AgentValid({
								agent: agent,
							});
							await newAgentValid.save().then(async (agentValid) => {
								await this.model.Agent.updateOne(
									{ _id: agent._id },
									{ agentValid },
								);
							});
						});
					});
				});
			} else {
				req.flash('errors', 'کاربری با این شماره موبایل ثبت نام کرده است');
				return this.back(req, res);
			}
			return res.redirect('/admin/estate');
		} catch (error) {
			next(error);
		}
	}

	createRefCode(mobile) {
		let code = Math.floor(1000 + Math.random() * 9000);
		return 'DRT' + code + mobile;
	}

	async edit(req, res, next) {
		try {
			let agent = await this.model.Agent.findOne({
				_id: req.params.id,
			}).populate('user consultant location agentValid');
			let states = await this.model.State.find();
			let cities = await this.model.City.find({ state: agent.location.state });
			const title = 'جزئیات املاکی';
			res.render('admin/estate/edit', {
				title,
				agent,
				states,
				cities,
			});
		} catch (error) {
			next(error);
		}
	}

	async update(req, res) {}

	async getCity(req, res, next) {
		try {
			let cities = await this.model.City.find({ state: req.body.id });
			return res.json(cities);
		} catch (error) {
			next(error);
		}
	}

	async conditionTrue(req, res, next) {
		try {
			await this.model.Agent.findByIdAndUpdate(req.params.id, {
				$set: { condition: true },
			});
			this.toast(req, {
				text: 'آیتم انتخابی فعال شد',
				iconClass: 'toast-success',
			});
			return this.back(req, res);
		} catch (error) {
			next(error);
		}
	}

	async conditionFalse(req, res, next) {
		try {
			await this.model.Agent.findByIdAndUpdate(req.params.id, {
				$set: { condition: false },
			});
			this.toast(req, {
				text: 'آیتم انتخابی غیر فعال شد',
				iconClass: 'toast-error',
			});
			return this.back(req, res);
		} catch (error) {
			next(error);
		}
	}

	async validTrue(req, res, next) {
		try {
			await this.model.AgentValid.findOneAndUpdate(
				{ agent: req.params.id },
				{
					$set: { status: true },
				},
			);
			this.toast(req, {
				text: 'آیتم انتخابی مجاز شد',
				iconClass: 'toast-success',
			});
			return this.back(req, res);
		} catch (error) {
			next(error);
		}
	}

	async validFalse(req, res, next) {
		try {
			await this.model.AgentValid.findOneAndUpdate(
				{ agent: req.params.id },
				{
					$set: { status: false },
				},
			);
			this.toast(req, {
				text: 'آیتم انتخابی غیر مجاز شد',
				iconClass: 'toast-error',
			});
			return this.back(req, res);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new estateController();
