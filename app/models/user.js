const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueString = require('unique-string');
const bcrypt = require('bcrypt');

const userSchema = Schema(
	{
		admin: { type: Boolean, default: false },
		operator: { type: Boolean, default: false },
		agent: { type: Boolean, default: false },
		consultant: { type: Boolean, default: false },
		condition: { type: Boolean, default: true },
		name: { type: String, required: true },
		avatar: { type: String, required: false },
		mobile: { type: String, required: false, unique: true },
		email: { type: String, required: false },
		password: { type: String, required: true },
		rememberToken: { type: String, default: null },
		role: { type: String, required: false },
		permissions: [
			{ type: Schema.Types.ObjectId, ref: 'permission', required: false },
		],
		currentIp: { type: String, required: false },
		firstDevice: {
			type: Schema.Types.ObjectId,
			ref: 'device',
			required: false,
		},
		bookmark: [
			{ type: Schema.Types.ObjectId, ref: 'advertising', required: false },
		],
	},
	{ timestamps: true },
);

userSchema.methods.hashPassword = function (password) {
	let salt = bcrypt.genSaltSync(15);
	let hash = bcrypt.hashSync(password, salt);
	return hash;
};

userSchema.methods.comparePassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

userSchema.methods.hasPermission = function (permission) {
	return this.permissions.indexOf(permission) > -1;
};

userSchema.methods.setRememberToken = function (res) {
	const token = uniqueString();
	res.cookie('remember_token', token, {
		maxAge: 1000 * 60 * 60 * 24 * 30,
		httpOnly: true,
		signed: true,
	});
	this.updateOne({ rememberToken: token }, (err) => {
		if (err) throw err;
	});
};

module.exports = mongoose.model('user', userSchema);
