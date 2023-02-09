const controller = require('app/http/controllers/controller');

class commentController extends controller {
	async index(req, res, next) {
		try {
			let page = req.query.page || 1;
			let comments = await this.model.Comment.paginate(
				{ approved: true },
				{
					page,
					sort: { createdAt: -1 },
					limit: 20,
					populate: [
						{
							path: 'user',
							select: 'name',
						},
						'blog',
					],
				},
			);
			res.render('admin/comments', { title: 'لیست نظرات', comments });
		} catch (err) {
			next(err);
		}
	}

	async approved(req, res, next) {
		try {
			let page = req.query.page || 1;
			let comments = await this.model.Comment.paginate(
				{ approved: false },
				{
					page,
					sort: { createdAt: -1 },
					limit: 20,
					populate: [
						{
							path: 'user',
							select: 'name',
						},
						'blog',
					],
				},
			);
			res.render('admin/comments/approved', {
				title: 'لیست نظرات تایید نشده',
				comments,
			});
		} catch (err) {
			next(err);
		}
	}

	async update(req, res, next) {
		try {
			this.isMongoId(req.params.id);
			let comment = await this.model.Comment.findById(req.params.id)
				.populate('belongTo blog')
				.exec();
			if (!comment) this.error('چنین نظری وجود ندارد', 404);
			await comment.belongTo.inc('commentCount');
			comment.approved = true;
			await comment.save();
			this.notification(
				comment.user,
				'تایید دیدگاه',
				`دیدگاه شما برای مطلب <a target="_blank" href="/blog/${comment.blog.slug}"><b>"${comment.blog.title}"</b></a> تایید شد`,
				config.alert.success,
			);
			return this.back(req, res);
		} catch (err) {
			next(err);
		}
	}

	async destroy(req, res, next) {
		try {
			this.isMongoId(req.params.id);
			let comment = await this.model.Comment.findById(req.params.id).exec();
			if (!comment) this.error('چنین نظری وجود ندارد', 404);
			comment.remove();
			return this.back(req, res);
		} catch (err) {
			next(err);
		}
	}
}

module.exports = new commentController();
