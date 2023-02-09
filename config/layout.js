const expressLayouts = require('express-ejs-layouts');

module.exports = {
	public_dir: 'public',
	view_dir: 'views',
	view_engine: 'ejs',
	ejs: {
		expressLayouts,
		extractScripts: true,
		extractStyles: true,
		master: 'master',
	},
};
