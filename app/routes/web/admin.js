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
const indexController = require('app/http/controllers/web/admin/indexController');
const profileController = require('app/http/controllers/web/admin/profileController');
const userController = require('app/http/controllers/web/admin/userController');
const permissionController = require('app/http/controllers/web/admin/permissionController');
const roleController = require('app/http/controllers/web/admin/roleController');
const passwordController = require('app/http/controllers/web/admin/passwordController');
const logController = require('app/http/controllers/web/admin/logController');
const estateController = require('app/http/controllers/web/admin/estateController');
const blogController = require('app/http/controllers/web/admin/blogController');
const messageController = require('app/http/controllers/web/admin/messageController');
const handleController = require('app/http/controllers/handleController');
const todoController = require('app/http/controllers/web/admin/todoController');
const commentController = require('app/http/controllers/web/admin/commentController');
const stateController = require('app/http/controllers/web/admin/stateController');
const cityController = require('app/http/controllers/web/admin/cityController');
const regionController = require('app/http/controllers/web/admin/regionController');
const pageController = require('app/http/controllers/web/admin/pageController');

//* Validators
const adminProfileValidator = require('app/http/validators/adminProfileValidator');
const operatorRegisterValidator = require('app/http/validators/operatorRegisterValidator');
const permissionValidator = require('app/http/validators/permissionValidator');
const roleValidator = require('app/http/validators/roleValidator');
const changePasswordValidator = require('app/http/validators/changePasswordValidator');
const blogValidator = require('app/http/validators/blogValidator');
const createEstateValidator = require('app/http/validators/createEstateValidator');

//* Middlewares
const convertFileToField = require('app/http/middlewares/convertFileToField');

//* Helpers
const gate = require('app/helpers/gate');
const upload = require('app/helpers/upload');

router.use((req, res, next) => {
	res.locals.layout = 'admin/master';
	next();
});

router.use('*', handleController.message);
router.use('*', handleController.alert);

//* Main
router.get('/', indexController.index);

//* Profile Routes
router.get('/profile', profileController.index);
router.put(
	'/profile/edit/:id',
	apiLimiter,
	upload.single('image'),
	convertFileToField.handleImage,
	adminProfileValidator.handle(),
	profileController.update,
);

//* User Routes
router.get(
	'/users/operator',
	gate.can('user-operator'),
	userController.operator,
);
router.get(
	'/users/operator/create',
	gate.can('user-operator'),
	userController.create,
);
router.post(
	'/users/operator/create',
	apiLimiter,
	gate.can('user-operator'),
	operatorRegisterValidator.handle(),
	userController.store,
);
router.delete(
	'/users/operator/:id',
	apiLimiter,
	gate.can('user-operator'),
	userController.destroy,
);
router.get(
	'/users/operator/toggleadmin/:id',
	gate.can('user-operator'),
	userController.toggleadmin,
);
router.get(
	'/users/operator/addrole/:id',
	gate.can('user-operator'),
	userController.addrole,
);
router.put(
	'/users/operator/addrole/:id',
	apiLimiter,
	gate.can('user-operator'),
	userController.storeRoleForUser,
);
router.get('/users/site', userController.site);

//* Permission Routes
router.get(
	'/users/permissions',
	gate.can('user-permissions'),
	permissionController.index,
);
router.get(
	'/users/permissions/create',
	gate.can('user-permissions'),
	permissionController.create,
);
router.post(
	'/users/permissions/create',
	apiLimiter,
	gate.can('user-permissions'),
	permissionValidator.handle(),
	permissionController.store,
);
router.get(
	'/users/permissions/:id/edit',
	gate.can('user-permissions'),
	permissionController.edit,
);
router.put(
	'/users/permissions/:id',
	apiLimiter,
	gate.can('user-permissions'),
	permissionValidator.handle(),
	permissionController.update,
);
router.delete(
	'/users/permissions/:id',
	apiLimiter,
	gate.can('user-permissions'),
	permissionController.destroy,
);

//* Role Routes
router.get('/users/roles', gate.can('user-roles'), roleController.index);
router.get(
	'/users/roles/create',
	gate.can('user-roles'),
	roleController.create,
);
router.post(
	'/users/roles/create',
	apiLimiter,
	gate.can('user-roles'),
	roleValidator.handle(),
	roleController.store,
);
router.get(
	'/users/roles/:id/edit',
	gate.can('user-roles'),
	roleController.edit,
);
router.put(
	'/users/roles/:id',
	apiLimiter,
	gate.can('user-roles'),
	roleValidator.handle(),
	roleController.update,
);
router.delete(
	'/users/roles/:id',
	apiLimiter,
	gate.can('user-roles'),
	roleController.destroy,
);

//* Security Routes
router.get('/password', passwordController.index);
router.post(
	'/password',
	apiLimiter,
	changePasswordValidator.handle(),
	passwordController.change,
);
router.get('/log', logController.index);
router.put('/log/condition/true/:id', apiLimiter, logController.conditionTrue);
router.put(
	'/log/condition/false/:id',
	apiLimiter,
	logController.conditionFalse,
);

//* Todo Routes
router.post('/todo/create', todoController.store);
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

//* Message Routes
router.get('/message', messageController.index);
router.get('/message/:id', messageController.single);
router.post('/message/:id', apiLimiter, messageController.response);
router.delete('/message/:id', apiLimiter, messageController.destroy);

//* Setting Routes
router.get('/setting/page/about', pageController.aboutPage);
router.post('/setting/page/about', apiLimiter, pageController.storeAbout);
router.get('/setting/page/team', pageController.teamPage);
router.get('/setting/page/team/create', pageController.createTeam);
router.post(
	'/setting/page/team/create',
	apiLimiter,
	upload.single('image'),
	convertFileToField.handleImage,
	pageController.storeTeam,
);
router.get('/setting/page/team/edit/:id', pageController.editTeam);
router.put(
	'/setting/page/team/edit/:id',
	apiLimiter,
	upload.single('image'),
	convertFileToField.handleImage,
	pageController.updateTeam,
);
router.delete('/setting/page/team/:id', apiLimiter, pageController.destroyTeam);

//* Location Routes
router.get('/location/state', stateController.index);
router.post('/location/state', apiLimiter, stateController.store);
router.put('/location/state/edit/:id', apiLimiter, stateController.update);
router.put(
	'/location/state/condition/true/:id',
	apiLimiter,
	stateController.conditionTrue,
);
router.put(
	'/location/state/condition/false/:id',
	apiLimiter,
	stateController.conditionFalse,
);
router.delete('/location/state/:id', apiLimiter, stateController.destroy);
router.get('/location/city', cityController.index);
router.post('/location/city', apiLimiter, cityController.store);
router.put('/location/city/edit/:id', apiLimiter, cityController.update);
router.put(
	'/location/city/condition/true/:id',
	apiLimiter,
	cityController.conditionTrue,
);
router.put(
	'/location/city/condition/false/:id',
	apiLimiter,
	cityController.conditionFalse,
);
router.delete('/location/city/:id', apiLimiter, cityController.destroy);
router.get('/location/region', regionController.index);
router.post('/location/region', apiLimiter, regionController.store);
router.put('/location/region/edit/:id', apiLimiter, regionController.update);
router.put(
	'/location/region/condition/true/:id',
	apiLimiter,
	regionController.conditionTrue,
);
router.put(
	'/location/region/condition/false/:id',
	apiLimiter,
	regionController.conditionFalse,
);
router.delete('/location/region/:id', apiLimiter, regionController.destroy);

//* Blog Routes
router.get('/blog', blogController.index);
router.get('/blog/create', blogController.create);
router.get('/blog/edit/:id', blogController.edit);
router.post(
	'/blog/create',
	apiLimiter,
	upload.single('image'),
	convertFileToField.handleImage,
	blogValidator.handle(),
	blogController.store,
);
router.put(
	'/blog/:id',
	apiLimiter,
	upload.single('image'),
	convertFileToField.handleImage,
	blogValidator.handle(),
	blogController.update,
);
router.delete('/blog/:id', apiLimiter, blogController.destroy);
router.put(
	'/blog/condition/true/:id',
	apiLimiter,
	blogController.conditionTrue,
);
router.put(
	'/blog/condition/false/:id',
	apiLimiter,
	blogController.conditionFalse,
);

//* Comment Routes
router.get('/comments', commentController.index);
router.get('/comments/approved', commentController.approved);
router.put('/comments/:id/approved', apiLimiter, commentController.update);
router.delete('/comments/:id', apiLimiter, commentController.destroy);

//* Estate Routes
router.get('/estate', estateController.index);
router.get('/estate/create', estateController.create);
router.post(
	'/estate/create',
	apiLimiter,
	createEstateValidator.handle(),
	estateController.store,
);
router.post('/estate/create/city', apiLimiter, estateController.getCity);
router.get('/estate/details/:id', estateController.edit);
router.put('/estate/details/:id', apiLimiter, estateController.update);
router.put('/estate/valid/true/:id', apiLimiter, estateController.validTrue);
router.put('/estate/valid/false/:id', apiLimiter, estateController.validFalse);
router.put(
	'/estate/condition/true/:id',
	apiLimiter,
	estateController.conditionTrue,
);
router.put(
	'/estate/condition/false/:id',
	apiLimiter,
	estateController.conditionFalse,
);

//* Logout Routes
router.get('/logout', (req, res) => {
	req.logout();
	res.clearCookie('remember_token');
	res.redirect('/auth/admin');
});

module.exports = router;
