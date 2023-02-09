const express = require('express');
const router = express.Router();
const csurf = require('csurf');
const csrf = csurf({ cookie: true });

//* Middlewares
const redirectUser = require('app/http/middlewares/redirectUser');
const errorHandler = require('app/http/middlewares/errorHandler');
const csrfErrorHandler = require('app/http/middlewares/csrfErrorHandler');

//* Controllers
const handleController = require('app/http/controllers/handleController');

//* Helpers
const upload = require('app/helpers/upload');

//* CSRF Token Error Handler
router.use(csrfErrorHandler.handle);

//* Auth Router
const authRouter = require('app/routes/web/auth');
router.use('/auth', csrf, redirectUser.isAuthenticated, authRouter);

//* Admin Router
const adminRouter = require('app/routes/web/admin');
router.use('/admin', csrf, redirectUser.notAdmin, adminRouter);

//* Agent Router
const agentRouter = require('app/routes/web/agent');
router.use('/agent', csrf, redirectUser.notAgent, agentRouter);

//* Site Router
const siteRouter = require('app/routes/web/site');
router.use('/', csrf, siteRouter);

//* CKEditor Upload
router.post(
	'/upload-image',
	upload.single('upload'),
	handleController.uploadImage,
);

//* Handle Errors
router.all('*', errorHandler.error404);
router.use(errorHandler.handler);

module.exports = router;
