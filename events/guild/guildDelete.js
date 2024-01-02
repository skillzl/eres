const Event = require('../../structures/EventClass');
const db = require('../../database/manager');

module.exports = class guildDelete extends Event {
	constructor() {
		super({
			name: 'guildDelete', once: false,
		});
	}
	/**
 * Remove server from the database if guild is not available
 * @param {Guild} guild - The guild object
 */
	async run(guild) {
		// Check if the guild is available
		if (guild.available) {
			return;
		}

		// Remove the server from the database
		await db.removeServer(guild.id);

		// Log the information
		console.log(`[Info]: Left guild: ${guild.name} ⬇️.`);
	}
};