const validator = require('./validator');
const { check } = require('express-validator');
const Blog = require('app/models/blog');
const path = require('path');

class blogValidator extends validator {
	handle() {
		return [
			check('title')
				.isLength({ min: 5 })
				.withMessage('فیلد عنوان نمی تواند کمتر از 5 حرف باشد'),
			check('title').custom(async (value, { req }) => {
				if (req.query._method === 'PUT') {
					let blog = await Blog.findById(req.params.id);
					if (blog.title === value) return;
				}
				let blog = await Blog.findOne({ slug: this.slug(value) });
				if (blog) {
					throw new Error('چنین مطلبی با این عنوان موجود است');
				}
			}),
			check('text')
				.isLength({ min: 150 })
				.withMessage('متن نمیتواند کمتر از 150 حرف باشد'),
			check('summary')
				.isLength({ min: 20 })
				.withMessage('خلاصه متن نمی تواند کمتر از 20 حرف باشد'),
			check('tags').not().isEmpty().withMessage('تگ ها نمی تواند خالی باشد'),
			check('image').custom(async (value, { req }) => {
				if (req.query._method === 'PUT' && value === undefined) return;
				if (!value) throw new Error('وارد کردن تصویر الزامی است');
				let fileExt = ['.png', '.jpg', '.jpeg'];
				if (!fileExt.includes(path.extname(req.file.originalname)))
					throw new Error('فایل وارد شده نا معتبر است');
			}),
		];
	}

	slug(title) {
		return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, '-');
	}
}

module.exports = new blogValidator();
