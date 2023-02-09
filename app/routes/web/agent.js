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
const indexController = require('app/http/controllers/web/agent/indexController');
const ticketController = require('app/http/controllers/web/agent/ticketController');
const logController = require('app/http/controllers/web/agent/logController');
const passwordController = require('app/http/controllers/web/agent/passwordController');
const todoController = require('app/http/controllers/web/agent/todoController');
const handleController = require('app/http/controllers/handleController');
const consultantController = require('app/http/controllers/web/agent/consultantController');
const ledgerbinderController = require('app/http/controllers/web/agent/ledgerbinderController');
const profileController = require('app/http/controllers/web/agent/profileController');
const adsController = require('app/http/controllers/web/agent/adsController');

//* Validators
const ticketValidator = require('app/http/validators/ticketValidator');
const changePasswordValidator = require('app/http/validators/changePasswordValidator');
const profileValidator = require('app/http/validators/agentProfileValidator');

//* Middlewares
const convertFileToField = require('app/http/middlewares/convertFileToField');

//* Helpers
const upload = require('app/helpers/upload');

router.use((req, res, next) => {
	res.locals.layout = 'agent/master';
	next();
});

router.use('*', handleController.message);
router.use('*', handleController.alert);

//* Main
router.get('/', indexController.index);

//* Support Routes
router.get('/ticket', ticketController.index);
router.get('/ticket/create', ticketController.create);
router.post(
	'/ticket/create',
	apiLimiter,
	upload.fields([
		{ name: 'images', maxCount: 3 },
		{ name: 'file', maxCount: 1 },
	]),
	convertFileToField.handleImagesAndFile,
	ticketValidator.handle(),
	ticketController.store,
);
router.get('/ticket/:id', ticketController.single);
router.post('/ticket/:id', apiLimiter, ticketController.response);

//* Security Routes
router.get('/log', logController.index);
router.put('/log/condition/true/:id', apiLimiter, logController.conditionTrue);
router.put(
	'/log/condition/false/:id',
	apiLimiter,
	logController.conditionFalse,
);
router.get('/password', passwordController.index);
router.post(
	'/password',
	apiLimiter,
	changePasswordValidator.handle(),
	passwordController.change,
);

//* Todo Routes
router.post('/todo/create', apiLimiter, todoController.store);
router.put(
	'/todo/condition/true/:id',
	apiLimiter,
	todoController.conditionTrue,
);
router.put(
	'/todo/condition/false/:id',
	apiLimiter,
	todoController.conditionFalse,
);
router.delete('/todo/:id', todoController.destroy);

//* Profile Routes
router.get('/profile', profileController.index);
router.put(
	'/profile/edit/:id',
	apiLimiter,
	profileValidator.handle(),
	profileController.update,
);

//* Consultant Routes
router.get('/consultant', consultantController.index);
router.get('/consultant/create', consultantController.create);
router.post('/consultant/sendcode', apiLimiter, consultantController.sendCode);
router.post('/consultant/verify', apiLimiter, consultantController.verify);
router.get('/consultant/register', consultantController.register);
router.post('/consultant/register', apiLimiter, consultantController.store);

//* Ads Routes
router.get('/ads/ledgerbinder', ledgerbinderController.index);
router.put(
	'/ads/archived/true/:id',
	apiLimiter,
	ledgerbinderController.archiveTrue,
);
router.put(
	'/ads/archived/false/:id',
	apiLimiter,
	ledgerbinderController.archiveFalse,
);
router.get('/ads/mark', adsController.mark);
router.get('/ads', adsController.index);
router.get('/ads/create', adsController.create);
router.post('/ads/create/city', adsController.getCity);
router.post('/ads/create/region', adsController.getRegion);
router.post(
	'/ads/create',
	apiLimiter,
	upload.array('images', 10),
	convertFileToField.handleImages,
	adsController.store,
);
router.get('/ads/edit/:id', adsController.edit);
router.put(
	'/ads/edit/:id',
	apiLimiter,
	upload.array('images', 10),
	convertFileToField.handleImages,
	adsController.update,
);
router.delete('/ads/delete/:id', adsController.destroy);
router.put('/ads/private/true/:id', apiLimiter, adsController.privateTrue);
router.put('/ads/private/false/:id', apiLimiter, adsController.privateFalse);

//* Logout Routes
router.get('/logout', (req, res) => {
	req.logout();
	res.clearCookie('remember_token');
	res.redirect('/auth/agent');
});

module.exports = router;
