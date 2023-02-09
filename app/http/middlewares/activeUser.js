const middleware = require('app/http/middlewares/middleware');

class activeUser extends middleware {
	handle(req, res, next) {
		if (req.isAuthenticated()) {
			if (req.user.condition) return next();
			this.alert(req, {
				title: 'توجه',
				text: 'اکانت شما غیر فعال می باشد، می توانید به پشتیبانی گزارش دهید',
				icon: 'error',
				button: 'بستن',
			});
			req.logout();
			res.clearCookie('remember_token');
			this.back(req, res);
		} else {
			next();
		}
	}
}

module.exports = new activeUser();
