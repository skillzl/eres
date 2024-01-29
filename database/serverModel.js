const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
	serverId: { type: String, required: true },
	autorole: { type: String, default: null },
	djrole : { type: String, default: null },
	welcome: { type: String, default: null },
	leave: { type: String, default: null },
	i18n: { type: String, default: 'en', required: true },
});

module.exports = mongoose.model('server', serverSchema);