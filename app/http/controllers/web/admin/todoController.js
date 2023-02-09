const controller = require('app/http/controllers/controller');

class todoController extends controller {
	async store(req, res, next) {
		try {
			if (!req.body.title) {
				this.toast(req, {
					text: 'عنوان یادداشت وارد نشده است!',
					iconClass: 'toast-error',
				});
				return this.back(req, res);
			}
			let { title } = req.body;
			let newTodo = new this.model.Todo({
				title,
				user: req.user._id,
			});
			await newTodo.save();
			return this.back(req, res);
		} catch (error) {
			next(error);
		}
	}

	async destroy(req, res, next) {
		try {
			let todo = await this.model.Todo.findById(req.params.id);
			todo.remove();
			return this.back(req, res);
		} catch (error) {
			next(error);
		}
	}

	async conditionTrue(req, res, next) {
		try {
			await this.model.Todo.findByIdAndUpdate(req.params.id, {
				$set: { status: true },
			});
			return this.back(req, res);
		} catch (error) {
			next(error);
		}
	}

	async conditionFalse(req, res, next) {
		try {
			await this.model.Todo.findByIdAndUpdate(req.params.id, {
				$set: { status: false },
			});
			return this.back(req, res);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new todoController();
