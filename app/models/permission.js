const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const permissionSchema = Schema(
	{
		label: { type: String, required: true },
		desc: { type: String, required: true },
	},
	{ timestamps: { updatedAt: false }, toJSON: { virtuals: true } },
);

permissionSchema.plugin(mongoosePaginate);

permissionSchema.virtual('users', {
	ref: 'user',
	localField: '_id',
	foreignField: 'permissions',
});

module.exports = mongoose.model('permission', permissionSchema);
