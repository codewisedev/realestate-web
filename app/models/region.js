const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const regionSchema = Schema(
	{
		title: { type: String, required: true },
		city: { type: Schema.Types.ObjectId, ref: 'city', required: true },
		condition: { type: Boolean, default: true },
	},
	{ timestamps: { updatedAt: false } },
);

module.exports = mongoose.model('region', regionSchema);
