const Event = require('../../structures/EventClass');
const db = require('../../database/manager');

module.exports = class guildDelete extends Event {
	constructor() {
		super({
			name: 'guildDelete', once: false,
		});
	}
	async run(guild) {
		if (guild.available) return; await db.removeServer(guild.id);
		console.log(`[Info]: Left guild: ${guild.name} ⬇️.`);
	}
};