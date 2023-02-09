const middleware = require('app/http/middlewares/middleware');

class redirectUser extends middleware {
	isAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
			if (req.user.admin) return res.redirect('/admin');
			else if (req.user.agent) return res.redirect('/agent');
			else return res.redirect('/');
		}
		next();
	}

	notAdmin(req, res, next) {
		if (req.isAuthenticated() && req.user.admin) return next();
		return res.redirect('/auth/admin');
	}

	notAgent(req, res, next) {
		if (req.isAuthenticated() && req.user.agent) return next();
		return res.redirect('/auth/agent');
	}
}

module.exports = new redirectUser();
