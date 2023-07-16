const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
	serverId: { type:String },
	prefix: { type:String },
});

module.exports = mongoose.model('server', serverSchema);