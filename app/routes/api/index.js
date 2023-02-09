const express = require('express');
const router = express.Router();
const RateLimit = require('express-rate-limit');
const apiLimiter = new RateLimit({
	windowMs: 1000 * 60 * 5,
	max: 10,
	handler: function (req, res) {
		res.json({
			data:
				'تعداد درخواست های شما بیش از حد مجاز می باشد، لطفا 5 دقیقه ی دیگر دوباره تلاش نمایید',
			success: false,
		});
	},
});

//* Controllers
const userController = require('app/http/controllers/api/userController');
const adsController = require('app/http/controllers/api/adsController');

//* Middlewares
const convertFileToField = require('app/http/middlewares/convertFileToField');

//* Helpers
const upload = require('app/helpers/upload');

//* API Router
const apiRouter = express.Router();

//* User
apiRouter.post('/sendcode', userController.sendCode);
apiRouter.post('/validation', userController.validation);
apiRouter.post('/getstate', userController.getState);
apiRouter.post('/getcity', userController.getCity);
apiRouter.post('/getregion', userController.getRegion);
apiRouter.post(
	'/register/agent',
	upload.single('image'),
	convertFileToField.handleImage,
	userController.registerAgent,
);
apiRouter.post('/register/consultant', userController.registerConsultant);
apiRouter.post('/profile', userController.getUser);
apiRouter.put('/profile', userController.update);

//* Ads
apiRouter.post('/ads/filter', adsController.index);

router.use('/api', apiRouter);

module.exports = router;
