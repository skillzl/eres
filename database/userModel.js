const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	userId: { type: String },
	about: { type: String, default: 'mysterious person' },
	balance: { type: Number, default: 0 },
	reputation: { type: Number, default: 0 },
	xp: { type: Number, default: 0 },
	reputation_cooldown: { type: Number, default: null },
	daily_cooldown: { type: Number, default: null },
});

module.exports = mongoose.model('user', userSchema);