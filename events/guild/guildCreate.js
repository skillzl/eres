const Event = require('../../structures/EventClass');
const db = require('../../database/manager');

module.exports = class guildCreate extends Event {
	constructor() {
		super({
			name: 'guildCreate', once: false,
		});
	}
	async run(guild) {
		if (!guild.available) return; await db.createServer(guild.id);
		console.log(`[Info]: Joined guild: ${guild.name} ⬆️.`);
	}
};