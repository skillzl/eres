const fs = require('fs');
const path = require('path');

const { Player } = require('discord-player');

/**
 * Registers player events for the client.
 * @param {Client} client - The client object.
 */
module.exports = (client) => {
	client.events.player = async () => {
		// Define the path to the directory containing player events
		const playerEventsPath = path.join(__dirname, '../events/player');

		// Get the list of player event files in the directory
		const playerEventFiles = fs.readdirSync(playerEventsPath).filter((file) => file.endsWith('.js'));

		// Get the singleton instance of the Player class
		const player = Player.singleton();

		// Iterate over each player event file
		for (const file of playerEventFiles) {
			// Get the path to the current event file
			const filePath = path.join(playerEventsPath, file);

			// Require the event file
			const event = require(filePath);

			// Register the event listener for the player event
			player.events.on(event.name, (...args) => event.execute(...args, client));
		}
	};
};
