const middleware = require('app/http/middlewares/middleware');

class convertFileToField extends middleware {
	handleImage(req, res, next) {
		try {
			if (!req.file) req.body.image = undefined;
			else req.body.image = req.file.filename;
			next();
		} catch (error) {
			next(error);
		}
	}

	async handleImages(req, res, next) {
		try {
			if (req.files == null) req.body.images = undefined;
			else {
				let array = [];
				await req.files.forEach((image) => {
					array.push(image.filename);
				});
				req.body.images = array;
			}
			next();
		} catch (error) {
			next(error);
		}
	}

	handleFile(req, res, next) {
		try {
			if (!req.file) req.body.image = undefined;
			else req.body.image = req.file.filename;
			next();
		} catch (error) {
			next(error);
		}
	}

	handleProfileAndLogo(req, res, next) {
		try {
			if (!req.files) {
				req.body.logo = undefined;
				req.body.profile = undefined;
			} else {
				if (req.files.logo) req.body.logo = req.files.logo[0].filename;
				if (req.files.profile) req.body.profile = req.files.profile[0].filename;
			}
			next();
		} catch (error) {
			next(error);
		}
	}

	async handleImagesAndFile(req, res, next) {
		try {
			if (!req.files) {
				req.body.file = undefined;
				req.body.images = undefined;
			} else {
				if (req.files.file) req.body.file = req.files.file[0].filename;
				if (req.files.images) {
					let array = [];
					await req.files.images.forEach((image) => {
						array.push(image.filename);
					});
					req.body.images = array;
				}
			}
			next();
		} catch (error) {
			next(error);
		}
	}
}
module.exports = new convertFileToField();
