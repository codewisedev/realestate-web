const controller = require('app/http/controllers/controller');
const fs = require('fs');

class blogController extends controller {
	async index(req, res, next) {
		try {
			let blogs = await this.model.Blog.find({}).sort({ createdAt: -1 });
			const title = 'مدیریت بلاگ ها';
			res.render('admin/blog', { title, blogs });
		} catch (error) {
			next(error);
		}
	}

	async create(req, res, next) {
		try {
			const title = 'بلاگ جدید';
			res.render('admin/blog/create', { title });
		} catch (error) {
			next(error);
		}
	}

	async store(req, res, next) {
		try {
			let status = await this.validationData(req);
			if (!status) {
				if (req.file) fs.unlinkSync(req.file.path);
				return this.back(req, res);
			}
			let { title, text, summary, tags } = req.body;
			let newBlog = new this.model.Blog({
				title,
				slug: this.slug(title),
				text,
				summary,
				tags,
				user: req.user._id,
				image: this.imageResize(req.file, [720, 480], true),
			});
			await newBlog.save();
			return res.redirect('/admin/blog');
		} catch (error) {
			next(error);
		}
	}

	async edit(req, res, next) {
		try {
			const title = 'ویرایش بلاگ';
			let blog = await this.model.Blog.findById(req.params.id);
			if (!blog) this.error('چنین مطلبی وجود ندارد', 404);
			return res.render('admin/blog/edit', { title, blog });
		} catch (error) {
			next(error);
		}
	}

	async update(req, res, next) {
		try {
			let status = await this.validationData(req);
			if (!status) {
				if (req.file) fs.unlinkSync(req.file.path);
				return this.back(req, res);
			}
			let objForUpdate = {};
			//Todo: Check Image is not empty
			if (req.file)
				objForUpdate.image = this.imageResize(req.file, [720, 480], true);
			objForUpdate.slug = this.slug(req.body.title);
			delete req.body.image;
			await this.model.Blog.findByIdAndUpdate(req.params.id, {
				$set: { ...req.body, ...objForUpdate },
			});
			return res.redirect('/admin/blog');
		} catch (error) {
			next(error);
		}
	}

	async destroy(req, res, next) {
		try {
			let blog = await this.model.Blog.findById(req.params.id);
			if (!blog) this.error('چنین مطلبی وجود ندارد', 404);
			//Todo: Delete Images
			Object.values(blog.image).forEach((image) =>
				fs.unlinkSync(`./public${image}`),
			);
			//Todo: Delete Blog
			blog.remove();
			return this.back(req, res);
		} catch (error) {
			next(error);
		}
	}

	async conditionTrue(req, res, next) {
		try {
			await this.model.Blog.findByIdAndUpdate(req.params.id, {
				$set: { condition: true },
			});
			return this.back(req, res);
		} catch (error) {
			next(error);
		}
	}

	async conditionFalse(req, res, next) {
		try {
			await this.model.Blog.findByIdAndUpdate(req.params.id, {
				$set: { condition: false },
			});
			return this.back(req, res);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new blogController();
