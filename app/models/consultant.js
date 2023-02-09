const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consultantSchema = Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
		agent: { type: Schema.Types.ObjectId, ref: 'agent', required: false },
		forAgent: { type: Boolean, default: false },
		location: { type: Schema.Types.ObjectId, ref: 'location', required: true },
		condition: { type: Boolean, default: true },
		gender: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

module.exports = mongoose.model('consultant', consultantSchema);
