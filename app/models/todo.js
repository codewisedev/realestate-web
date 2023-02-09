const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = Schema(
	{
		user: [{ type: Schema.Types.ObjectId, ref: 'user' }],
		title: { type: String, required: true },
		status: { type: Boolean, default: true },
	},
	{ timestamps: { updatedAt: false } },
);

module.exports = mongoose.model('todo', todoSchema);
