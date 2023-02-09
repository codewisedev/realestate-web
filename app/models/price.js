const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const priceSchema = Schema(
	{
		price: { type: Number, required: true },
		rent: { type: Number, required: false },
		exchangeable: { type: Boolean, required: false },
		loanCheck: { type: Boolean, required: false },
		loan: { type: Number, required: false },
		installment: { type: Number, required: false },
		exchange: { type: String, required: false },
		deliveredMonth: { type: String, required: false },
		deliveredYear: { type: String, required: false },
	},
	{ timestamps: { updatedAt: false } },
);

module.exports = mongoose.model('price', priceSchema);
