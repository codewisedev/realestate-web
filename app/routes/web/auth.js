const express = require('express');
const router = express.Router();
const RateLimit = require('express-rate-limit');
const apiLimiter = new RateLimit({
	windowMs: 1000 * 60 * 5,
	max: 10,
	handler: function (req, res) {
		res.render('errors/limit');
	},
});

//* Controllers
const adminLoginController = require('app/http/controllers/web/admin/auth/loginController');
const adminForgotPasswordController = require('app/http/controllers/web/admin/auth/forgotPasswordController');
const adminResetPasswordController = require('app/http/controllers/web/admin/auth/resetPasswordController');
const agentLoginController = require('app/http/controllers/web/agent/auth/loginController');
const agentRegisterController = require('app/http/controllers/web/agent/auth/registerController');
const agentResetController = require('app/http/controllers/web/agent/auth/resetPasswordController');

//* Validators
const adminLoginValidator = require('app/http/validators/adminLoginValidator');
const adminForgotPasswordValidator = require('app/http/validators/adminForgotPasswordValidator');
const adminResetPasswordValidator = require('app/http/validators/adminResetPasswordValidator');
const agentLoginValidator = require('app/http/validators/agentLoginValidator');
const agentRegisterValidator = require('app/http/validators/agentRegisterValidator');
const consoltantRegisterValidator = require('app/http/validators/consoltantRegisterValidator');
const agentResetPasswordValidator = require('app/http/validators/agentResetPasswordValidator');

//* Middlewares
const convertFileToField = require('app/http/middlewares/convertFileToField');
const redirectUser = require('app/http/middlewares/redirectUser');

//* Helpers
const upload = require('app/helpers/upload');

router.use((req, res, next) => {
	res.locals.layout = 'auth/master';
	next();
});

//* Admin Authenticate Routes
router.get(
	'/admin',
	redirectUser.isAuthenticated,
	adminLoginController.showLoginForm,
);
router.post(
	'/admin/login',
	apiLimiter,
	adminLoginValidator.handle(),
	adminLoginController.loginProccess,
);
router.get(
	'/admin/password/reset',
	adminForgotPasswordController.showForgotPassword,
);
router.post(
	'/admin/password/email',
	apiLimiter,
	adminForgotPasswordValidator.handle(),
	adminForgotPasswordController.sendPasswordResetLink,
);
router.get(
	'/admin/password/reset/:token',
	adminResetPasswordController.showResetPassword,
);
router.post(
	'/admin/password/reset',
	apiLimiter,
	adminResetPasswordValidator.handle(),
	adminResetPasswordController.resetPasswordProccess,
);

//* Agent Authenticate Routes
router.get(
	'/agent',
	redirectUser.isAuthenticated,
	agentLoginController.showLoginForm,
);
router.post(
	'/agent/login',
	apiLimiter,
	agentLoginValidator.handle(),
	agentLoginController.loginProccess,
);
router.post('/agent/sendcode', apiLimiter, agentRegisterController.sendCode);
router.get('/agent/verify', agentRegisterController.showVerifyForm);
router.post(
	'/agent/validation',
	apiLimiter,
	agentRegisterController.validation,
);
router.get('/agent/register', agentRegisterController.showRegsitrationForm);
router.post('/agent/city', agentRegisterController.getCity);
router.post('/agent/region', agentRegisterController.getRegion);
router.post(
	'/agent/register',
	apiLimiter,
	upload.fields([
		{ name: 'profile', maxCount: 1 },
		{ name: 'logo', maxCount: 1 },
	]),
	convertFileToField.handleProfileAndLogo,
	agentRegisterValidator.handle(),
	agentRegisterController.storeAgent,
);
router.post(
	'/agent/register/consoltant',
	apiLimiter,
	upload.single('image'),
	convertFileToField.handleImage,
	consoltantRegisterValidator.handle(),
	agentRegisterController.storeConsoltant,
);
router.get('/agent/password/reset', agentResetController.showForgotPassword);
router.post(
	'/agent/password/reset',
	apiLimiter,
	agentResetController.sendPasswordResetCode,
);
router.get(
	'/agent/password/reset/token',
	agentResetController.showResetPassword,
);
router.post(
	'/agent/password/reset/token',
	apiLimiter,
	agentResetPasswordValidator.handle(),
	agentResetController.resetPasswordProccess,
);

module.exports = router;
