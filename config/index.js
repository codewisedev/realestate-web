const database = require('config/database');
const layout = require('config/layout');
const session = require('config/session');
const service = require('config/service');
const cors = require('config/cors');
const alert = require('config/alert');

module.exports = {
	database,
	layout,
	session,
	service,
	cors,
	alert,
	port: process.env.SERVER_PORT,
	cookie_secretkey: process.env.COOKIE_SECRET_KEY,
	debug: true,
	siteurl: process.env.WEBSITE_URL,
};
