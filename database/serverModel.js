const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
	serverId: { type: String },
	prefix: { type: String },
	autorole: { type: String, default: null },
	welcome: { type: String, default: null },
	leave: { type: String, default: null },
});

module.exports = mongoose.model('server', serverSchema);