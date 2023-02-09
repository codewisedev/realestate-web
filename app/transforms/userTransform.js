const transform = require('./transform');
const jwt = require('jsonwebtoken');

module.exports = class userTransform extends transform {
	transform(item, createToken = false) {
		this.createToken = createToken;
		return {
			id: item._id,
			name: item.name,
			email: item.email,
			mobile: item.mobile,
			condition: item.condition,
			...this.withToken(item),
		};
	}

	withToken(item) {
		if (item.token) return { token: item.token };
		if (this.createToken) {
			let token = jwt.sign(
				{ user_id: item._id },
				process.env.TOKEN_SECRET_KEY,
				{
					expiresIn: '168h',
				},
			);
			return { token };
		}
		return {};
	}
};
