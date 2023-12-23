const db = require('../../database/manager');

module.exports = {
	name: 'playerStart',
	async execute() {
		db.incrementSongsPlayed();
	},
};
