const fs = require('fs');
const path = require('path');

const { Player } = require('discord-player');

module.exports = (client) => {
	client.events.player = async () => {
		const playerEventsPath = path.join(__dirname, '../events/player');
		const playerEventFiles = fs.readdirSync(playerEventsPath).filter((file) => file.endsWith('.js'));

		const player = Player.singleton();

		for (const file of playerEventFiles) {
			const filePath = path.join(playerEventsPath, file);
			const event = require(filePath);
			player.events.on(event.name, (...args) => event.execute(...args, client));
		}
	};
};