const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
	commands_used: { type: Number, default: 0 },
	guilds: { type: Number, default: 0 },
	users: { type: Number, default: 0 },
});

module.exports = mongoose.model('analytics', analyticsSchema);