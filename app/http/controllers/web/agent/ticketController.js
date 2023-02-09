const controller = require('app/http/controllers/controller');
const fs = require('fs');

class ticketController extends controller {
	async index(req, res, next) {
		try {
			let messages = await this.model.Message.find({ user: req.user._id })
				.sort([['updatedAt', -1]])
				.populate('user')
				.exec();
			const title = 'لیست تیکت های ارسالی';
			res.render('agent/ticket', { title, messages });
		} catch (error) {
			next(error);
		}
	}

	async create(req, res, next) {
		try {
			const title = 'ارسال تیکت';
			res.render('agent/ticket/create', { title });
		} catch (error) {
			next(error);
		}
	}

	async store(req, res, next) {
		try {
			let status = await this.validationData(req);
			if (!status) {
				if (req.files) {
					if (req.files.images) {
						req.files.images.forEach((image) => {
							fs.unlinkSync(image.path);
						});
					}
					if (req.files.file) {
						fs.unlinkSync(req.files.file[0].path);
					}
				}
				return this.back(req, res);
			}
			let file = null;
			let images = [];
			let imageAddress = [];
			if (req.files.images) {
				await req.files.images.forEach((image) => {
					images.push(image);
				});
				await images.forEach((image) => {
					imageAddress.push(this.getImageAddress(image));
				});
			}
			if (req.files.file) file = await this.getFileAddress(req.files.file[0]);
			let { title, content } = req.body;
			await new this.model.Message({
				user: req.user,
				title,
				content,
				images: imageAddress,
				file,
				studied: [req.user._id],
			}).save();
			return res.redirect('/agent/ticket');
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
			const title = message.title;
			res.render('agent/ticket/response', { title, message });
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
}

module.exports = new ticketController();
