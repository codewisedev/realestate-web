const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const blogSchema = Schema(
	{
		title: { type: String, required: true },
		slug: { type: String, required: true },
		summary: { type: String, required: true },
		text: { type: String, required: true },
		image: { type: Object, required: true },
		tags: { type: Array, required: true },
		condition: { type: Boolean, default: true },
		like: { type: Number, default: 0 },
		viewCount: { type: Number, default: 0 },
		user: { type: Schema.Types.ObjectId, ref: 'user' },
	},
	{ timestamps: true },
);

blogSchema.plugin(mongoosePaginate);

blogSchema.methods.inc = async function (field, num = 1) {
	this[field] += num;
	await this.save();
};

blogSchema.virtual('comments', {
	ref: 'comment',
	localField: '_id',
	foreignField: 'blog',
});

module.exports = mongoose.model('blog', blogSchema);
