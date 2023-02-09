const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
		title: { type: String, required: true },
		content: { type: String, required: true },
		images: { type: Array, required: false },
		file: { type: String, required: false },
		response: [
			{ type: Schema.Types.ObjectId, ref: 'response', required: false },
		],
		studied: [{ type: Schema.Types.ObjectId, ref: 'user', required: false }],
	},
	{ timestamps: true },
);

module.exports = mongoose.model('message', messageSchema);
