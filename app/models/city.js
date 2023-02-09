const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const citySchema = Schema(
	{
		title: { type: String, required: true },
		state: { type: Schema.Types.ObjectId, ref: 'state', required: true },
		region: [{ type: Schema.Types.ObjectId, ref: 'region', required: false }],
		condition: { type: Boolean, default: true },
	},
	{ timestamps: { updatedAt: false } },
);

module.exports = mongoose.model('city', citySchema);
