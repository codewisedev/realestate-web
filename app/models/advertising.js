const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const random = require('mongoose-simple-random');

const advertisingSchema = Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
		agent: { type: Schema.Types.ObjectId, ref: 'agent', required: false },
		status: { type: Boolean, default: true },
		archived: { type: Boolean, default: false },
		priv: { type: Boolean, default: false },
		title: { type: String, required: true },
		slug: { type: String, required: true },
		images: { type: Array, required: false },
		transactionType: { type: Number, required: true },
		adsType: { type: Number, required: true },
		isEmpty: { type: Boolean, default: false },
		ownerName: { type: String, required: false },
		ownerMobile: { type: String, required: false },
		ownerTell: { type: String, required: false },
		desc: { type: String, required: false },
		privateDesc: { type: String, required: false },
		cooperation: { type: Boolean, default: false },
		cooperateDesc: { type: String, required: false },
		location: { type: Schema.Types.ObjectId, ref: 'location', required: true },
		material: { type: Schema.Types.ObjectId, ref: 'material', required: true },
		price: { type: Schema.Types.ObjectId, ref: 'price', required: true },
		possibilities: [{ type: Object, required: false }],
		heatingCooling: [{ type: Object, required: false }],
		vip: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

advertisingSchema.plugin(random);

module.exports = mongoose.model('advertising', advertisingSchema);
