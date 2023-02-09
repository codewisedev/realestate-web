const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Float = require('mongoose-float').loadType(mongoose, 15);

const locationSchema = Schema(
	{
		state: { type: Schema.Types.ObjectId, ref: 'state', required: false },
		city: { type: Schema.Types.ObjectId, ref: 'city', required: false },
		region: { type: Schema.Types.ObjectId, ref: 'region', required: false },
		address: { type: String, required: false },
		lat: { type: Float, required: false },
		lon: { type: Float, required: false },
	},
	{ timestamps: true },
);

module.exports = mongoose.model('location', locationSchema);
