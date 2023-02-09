const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = Schema(
	{
		name: { type: String, required: false },
		email: { type: String, required: false },
		phone: { type: String, required: false },
		subject: { type: String, required: true },
		message: { type: Boolean, default: true },
	},
	{ timestamps: { updatedAt: false } },
);

module.exports = mongoose.model('contact', contactSchema);
