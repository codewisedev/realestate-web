const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propertySchema = Schema(
	{
		title: { type: String, required: true },
	},
	{ timestamps: { updatedAt: false } },
);

module.exports = mongoose.model('property', propertySchema);
