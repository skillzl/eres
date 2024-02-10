const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

const fs = require('fs');
require('dotenv').config();

/**
 * Deploys the slash commands for the application.
 */
const deploy = async () => {
	// Array to store the command data
	const commandData = [];

	// Read the categories in the 'commands' directory
	fs.readdirSync('./commands/').forEach(async (category) => {
		// Get the commands in each category
		const commands = fs
			.readdirSync(`./commands/${category}/`)
			.filter((cmd) => cmd.endsWith('.js'));

		for (const command of commands) {
			// Import the command class
			const Command = require(`./commands/${category}/${command}`);

			// Create an instance of the command
			const cmd = new Command();

			// Convert the command data to JSON and add it to the array
			const cmdData = cmd.data.toJSON();
			commandData.push(cmdData);
		}
	});

	// Create a REST client with the specified version and token
	const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

	try {
		// Get the client ID from the environment variables
		const clientId = process.env.CLIENT_ID;

		console.log('[Deploy]: Started refreshing Slash Commands... ⏳');

		// Deploy the slash commands
		await rest.put(Routes.applicationCommands(clientId), { body: commandData }).then(() => {
			console.log('[Deploy]: Slash Commands have now been deployed 📈.');
		});
	}
	catch (e) {
		console.error(e);
	}
};

deploy();