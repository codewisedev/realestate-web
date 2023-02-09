const jwt = require('jsonwebtoken');
const User = require('app/models/user');

module.exports = (req, res, next) => {
	let token = req.body.token || req.query.token || req.headers['x-token'];
	if (token) {
		return jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decode) => {
			if (err) {
				return res.json({
					success: false,
					data: 'Failed Token',
				});
			}
			User.findById(decode.user_id, (err, user) => {
				if (err) throw err;
				if (user) {
					user.token = token;
					req.user = user;
					next();
				} else
					return res.json({
						data: 'User Not Found',
						success: false,
					});
			});
		});
	}

	return res.status(403).json({
		data: 'No Token Provide',
		success: false,
	});
};
