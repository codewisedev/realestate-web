const controller = require('app/http/controllers/controller');

class messageController extends controller {
	async index(req, res, next) {
		try {
			let messages = await this.model.Message.find({})
				.sort({ updatedAt: -1 })
				.populate('user')
				.exec();
			const title = 'لیست پیام ها';
			res.render('admin/message', { title, messages });
		} catch (error) {
			next(error);
		}
	}

	async single(req, res, next) {
		try {
			await this.model.Message.updateOne(
				{ _id: req.params.id },
				{
					$addToSet: { studied: req.user._id },
				},
			);
			let message = await this.model.Message.findOne({ _id: req.params.id })
				.populate('user')
				.populate({
					path: 'response',
					populate: {
						path: 'user',
					},
				})
				.exec();
			const title = 'پیام';
			res.render('admin/message/response', { title, message });
		} catch (error) {
			next(error);
		}
	}

	async response(req, res, next) {
		try {
			await this.model.Message.updateOne(
				{ _id: req.params.id },
				{
					$set: { studied: req.user._id },
				},
			);
			let status = await this.validationData(req);
			if (!status) return this.back(req, res);
			new this.model.Response({
				user: req.user._id,
				message: req.params.id,
				content: req.body.response,
			}).save(async (err, item) => {
				await this.model.Message.updateOne(
					{ _id: req.params.id },
					{
						$push: { response: item._id },
					},
				);
				return res.json(item);
			});
		} catch (error) {
			next(error);
		}
	}

	async destroy(req, res, next) {
		try {
			let response = await this.model.Response.findById(req.body.id);
			response.remove();
			await this.model.Message.updateOne(
				{ _id: req.params.id },
				{
					$pullAll: { response: [req.body.id] },
				},
			);
			return true;
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new messageController();
