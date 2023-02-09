const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const commentSchema = Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
		blog: { type: Schema.Types.ObjectId, ref: 'blog', default: undefined },
		parent: { type: Schema.Types.ObjectId, ref: 'comment', default: null },
		approved: { type: Boolean, default: false },
		content: { type: String, required: true },
	},
	{ timestamps: true, toJSON: { virtuals: true } },
);

commentSchema.plugin(mongoosePaginate);

commentSchema.virtual('comments', {
	ref: 'comment',
	localField: '_id',
	foreignField: 'parent',
});

const commentBelong = (doc) => {
	if (doc.blog) return 'blog';
};

commentSchema.virtual('belongTo', {
	ref: commentBelong,
	localField: (doc) => commentBelong(doc).toLowerCase(),
	foreignField: '_id',
	justOne: true,
});

module.exports = mongoose.model('comment', commentSchema);
