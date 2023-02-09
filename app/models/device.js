const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceSchema = Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
		title: { type: String, required: true },
		host: { type: String, required: true },
		ip: { type: String, required: true },
		mac: { type: String, required: true },
		time: { type: Date, default: Date.now() },
		status: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

module.exports = mongoose.model('device', deviceSchema);
