const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activeCodeSchema = Schema(
	{
		mobile: { type: String, required: true },
		code: { type: String, required: true },
		use: { type: Boolean, default: false },
		expire: { type: Date, required: true },
	},
	{ timestamps: true },
);

module.exports = mongoose.model('activeCode', activeCodeSchema);
