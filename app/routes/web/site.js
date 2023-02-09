const express = require('express');
const router = express.Router();
const passport = require('passport');
const RateLimit = require('express-rate-limit');
const apiLimiter = new RateLimit({
	windowMs: 1000 * 60 * 5,
	max: 10,
	handler: function (req, res) {
		res.render('errors/limit');
	},
});

//* Controllers
const indexController = require('app/http/controllers/web/site/indexController');
const loginController = require('app/http/controllers/web/site/auth/loginController');
const registerController = require('app/http/controllers/web/site/auth/registerController');
const resetController = require('app/http/controllers/web/site/auth/resetPasswordController');
const blogController = require('app/http/controllers/web/site/blogController');
const adsController = require('app/http/controllers/web/site/adsController');

//* Validators
const registerValidator = require('app/http/validators/userRegisterValidator');
const loginValidator = require('app/http/validators/userLoginValidator');
const resetValidator = require('app/http/validators/userResetPasswordValidator');
const changPassValidator = require('app/http/validators/userChangePasswordValidator');

//* Middlewares
const redirectUser = require('app/http/middlewares/redirectUser');

router.use((req, res, next) => {
	res.locals.layout = 'site/master';
	next();
});

//* Main
router.get('/', indexController.index);

//* Site Authenticate Routes
router.get(
	'/login',
	redirectUser.isAuthenticated,
	loginController.showLoginForm,
);
router.post(
	'/login',
	apiLimiter,
	loginValidator.handle(),
	loginController.loginProccess,
);
router.get(
	'/register',
	redirectUser.isAuthenticated,
	registerController.showRegisterForm,
);
router.post(
	'/register',
	apiLimiter,
	registerValidator.handle(),
	registerController.registerProccess,
);
router.get('/password', resetController.showForgotPassword);
router.post(
	'/password',
	resetValidator.handle(),
	resetController.sendPasswordResetCode,
);
router.get('/password/reset', resetController.showResetPassword);
router.post(
	'/password/reset',
	changPassValidator.handle(),
	resetController.resetPasswordProccess,
);
router.get('/logout', (req, res) => {
	req.logout();
	res.clearCookie('remember_token');
	res.redirect('/');
});
router.get(
	'/google',
	passport.authenticate('google', { scope: ['profile', 'email'] }),
);
router.get(
	'/google/callback',
	passport.authenticate('google', {
		successRedirect: '/',
		failureRedirect: '/register',
	}),
);

//* Profile
router.get('/profile', indexController.profile);

//* Blog
router.get('/blog', blogController.index);
router.get('/blog/:slug', blogController.single);
router.post('/comment', apiLimiter, blogController.comment);

//* Ads
router.get('/ads', adsController.index);
router.post('/ads', adsController.moreAds);
router.get('/ads/:id', adsController.single);
router.put('/ads/bookmark/true/:id', apiLimiter, adsController.bookmarkTrue);
router.put('/ads/bookmark/false/:id', apiLimiter, adsController.bookmarkFalse);
router.post('/city', adsController.getCity);
router.post('/region', adsController.getRegion);

//* About
router.get('/about', indexController.about);

//* Contact
router.get('/contact', indexController.contact);

//* Agent
router.get('/agencies', indexController.agent);
router.get('/agencies/:slug', indexController.agentSingle);

//* Consultant
router.get('/consultant', indexController.consultant);
router.get('/consultant/:id', indexController.consultantSingle);

//* FAQS
router.get('/faqs', indexController.faqs);

module.exports = router;
