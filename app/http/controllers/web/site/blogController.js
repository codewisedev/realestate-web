const controller = require('app/http/controllers/controller');

class blogController extends controller {
	async index(req, res, next) {
		try {
			let query = {};
			let { search } = req.query;
			if (search) {
				query.title = new RegExp(search, 'gi');
			}
			let page = req.query.page || 1;
			let blogs = await this.model.Blog.paginate(
				{ ...query },
				{ page, sort: { createdAt: -1 }, limit: 10 },
			);
			const title = 'لیست بلاگ';
			res.render('site/blog-grid', { title, blogs });
		} catch (error) {
			next(error);
		}
	}

	async single(req, res, next) {
		try {
			let blog = await this.model.Blog.findOneAndUpdate(
				{ slug: req.params.slug },
				{ $inc: { viewCount: 1 } },
			).populate([
				{
					path: 'comments',
					match: {
						parent: null,
						approved: true,
					},
					populate: [
						{
							path: 'user',
							select: 'name',
						},
						{
							path: 'comments',
							match: {
								approved: true,
							},
							populate: { path: 'user', select: 'name' },
						},
					],
				},
			]);
			let ads = await this.model.Advertising.findRandom(
				{},
				{},
				{ limit: 3 },
				function (err, results) {
					if (!err) return results;
					else next(err);
				},
			);
			const title = blog.title;
			res.render('site/blog-single', { title, blog, ads });
		} catch (error) {
			next(error);
		}
	}

	async comment(req, res, next) {
		try {
			let status = await this.validationData(req);
			if (!status) return this.back(req, res);

			let newComment = new this.model.Comment({
				user: req.user.id,
				...req.body,
			});

			await newComment.save();

			return this.back(req, res);
		} catch (err) {
			next(err);
		}
	}
}

module.exports = new blogController();
