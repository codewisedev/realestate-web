const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agentValidSchema = Schema(
	{
		agent: { type: Schema.Types.ObjectId, ref: 'agent', required: true },
		permissionPic: { type: String, required: false },
		idCardPic: { type: String, required: false },
		message: [{ type: Array, required: false }],
		status: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

module.exports = mongoose.model('agentValid', agentValidSchema);
