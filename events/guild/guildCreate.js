const Event = require('../../structures/EventClass');
const db = require('../../database/manager');

module.exports = class guildCreate extends Event {
	constructor() {
		super({
			name: 'guildCreate', once: false,
		});
	}
	/**
 * Runs the provided guild.
 *
 * @param {Guild} guild - The guild object.
 */
	async run(guild) {
		// Check if the guild is available
		if (!guild.available) {
			return;
		}

		// Create a server in the database for the guild
		await db.createServer(guild.id);

		// Log a message indicating the guild has been joined
		console.log(`[Info]: Joined guild: ${guild.name} ⬆️.`);
	}
};