const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = Schema({
	name: { type: String, required: true },
	image: { type: Object, required: true },
	twitter: { type: String, required: false },
	instagram: { type: String, required: false },
	linkedin: { type: String, required: false },
});

module.exports = mongoose.model('team', teamSchema);
