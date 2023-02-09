const controller = require('app/http/controllers/controller');

class indexController extends controller {
	async index(req, res) {
		const title = 'پنل مدیریت';
		let userCount = await this.model.User.countDocuments(
			{
				admin: false,
				agent: false,
				operator: false,
				consultant: false,
				condition: true,
			},
			(err, result) => {
				if (err) throw err;
				return result;
			},
		);
		let agentCount = await this.model.Agent.countDocuments(
			{ condition: true },
			(err, result) => {
				if (err) throw err;
				return result;
			},
		);
		let adsCount = await this.model.Advertising.countDocuments(
			{},
			(err, result) => {
				if (err) throw err;
				return result;
			},
		);
		let adsExpireCount = await this.model.Advertising.countDocuments(
			{ status: false },
			(err, result) => {
				if (err) throw err;
				return result;
			},
		);
		let todos = await this.model.Todo.find({ user: req.user }).sort({
			createdAt: -1,
		});
		let agents = await this.model.Agent.find({ condition: true })
			.sort({ createdAt: -1 })
			.limit(8);
		res.render('admin', {
			title,
			userCount,
			agentCount,
			adsCount,
			adsExpireCount,
			todos,
			agents,
		});
	}
}

module.exports = new indexController();
