const controller = require('app/http/controllers/controller');

class indexController extends controller {
	async index(req, res, next) {
		try {
			let todos = await this.model.Todo.find({}).sort({ createdAt: -1 });
			const title = 'داشبورد';
			res.render('agent', { title, todos });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new indexController();
