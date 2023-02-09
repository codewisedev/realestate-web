const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pageSchema = Schema({
	text: { type: String, required: true },
});

module.exports = mongoose.model('page', pageSchema);
