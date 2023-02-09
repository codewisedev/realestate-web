const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const roleSchema = Schema(
	{
		title: { type: String, required: true },
		label: { type: String, required: true },
		permissions: [{ type: Schema.Types.ObjectId, ref: 'permission' }],
	},
	{ timestamps: { updatedAt: false } },
);

roleSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('role', roleSchema);
