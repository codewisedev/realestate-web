const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agentSchema = Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
		consultant: [
			{ type: Schema.Types.ObjectId, ref: 'consultant', required: false },
		],
		condition: { type: Boolean, default: true },
		logo: { type: Object, required: false },
		title: { type: String, required: true },
		slug: { type: String, required: true },
		ref: { type: String, required: true },
		tell: { type: String, required: false },
		location: { type: Schema.Types.ObjectId, ref: 'location', required: true },
		credit: { type: Date, default: Date.now() },
		coin: { type: Number, default: 0 },
		rank: { type: Number, default: 0 },
		agentValid: {
			type: Schema.Types.ObjectId,
			ref: 'agentValid',
			required: false,
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model('agent', agentSchema);
