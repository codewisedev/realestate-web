const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const responseSchema = Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
		message: { type: Schema.Types.ObjectId, ref: 'message', required: true },
		content: { type: String, required: true },
	},
	{ timestamps: true },
);

module.exports = mongoose.model('response', responseSchema);
