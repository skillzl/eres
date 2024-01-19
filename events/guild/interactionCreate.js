const Event = require('../../structures/EventClass');
const db = require('../../database/manager');

const { Player, QueryType } = require('discord-player');
const { InteractionType } = require('discord.js');

module.exports = class InteractionCreate extends Event {
	constructor(client) {
		super(client, {
			name: 'interactionCreate',
			category: 'interactions',
		});
	}
	/**
 * Handles the interaction received by the bot.
 * @param {Interaction} interaction - The interaction object.
 */
	async run(interaction) {
		const client = this.client;
		const player = Player.singleton(client);

		// Handle application commands
		if (interaction.type === InteractionType.ApplicationCommand) {
			const command = client.commands.get(interaction.commandName);

			// Ignore interactions from bots
			if (interaction.user.bot) {
				return;
			}

			// Reply if the interaction is not in a guild
			if (!interaction.inGuild()) {
				return interaction.reply({
					content: 'You must be in a server to use commands.',
				});
			}

			// Handle unavailable command
			if (!command) {
				return interaction.reply({
					content: 'This command is unavailable. *Check back later.*',
					ephemeral: true,
				}) && client.commands.delete(interaction.commandName);
			}

			// Run the command and add value in database
			try {
				command.run(client, interaction);
				db.incrementCommandsUsed();
			}
			catch (e) {
				console.log(e);
				return interaction.reply({
					content: `An error has occurred.\n\n**\`${e.message}\`**`,
				});
			}
		}

		// Handle modal submit interactions
		if (!interaction.isAutocomplete()) return;
		if (interaction.commandName === 'play') {
			if (interaction.options.getString('song')) {

				// Perform the search operation here
				const results = await player.search(interaction.options.getString('song'));

				// Filter the results based on the search engine
				const resultsYouTube = await player.search(results, { searchEngine: QueryType.YOUTUBE });
				const resultsSpotify = await player.search(results, { searchEngine: QueryType.SPOTIFY_SEARCH });

				// Format the Youtube results
				const tracksYouTube = resultsYouTube.tracks.slice(0, 5).map((t) => ({
					name: `YouTube: ${`${t.title} - ${t.author} (${t.duration})`.length > 75 ? `${`${t.title} - ${t.author}`.substring(0, 75)}... (${t.duration})` : `${t.title} - ${t.author} (${t.duration})`}`,
					value: t.url,
				}));

				// Format the Spotify results
				const tracksSpotify = resultsSpotify.tracks.slice(0, 5).map((t) => ({
					name: `Spotify: ${`${t.title} - ${t.author} (${t.duration})`.length > 75 ? `${`${t.title} - ${t.author}`.substring(0, 75)}... (${t.duration})` : `${t.title} - ${t.author} (${t.duration})`}`,
					value: t.url,
				}));

				// Create an array of tracks
				const tracks = [];

				// Push the formatted results
				tracksYouTube.forEach((t) => tracks.push({ name: t.name, value: t.value }));
				tracksSpotify.forEach((t) => tracks.push({ name: t.name, value: t.value }));

				// Respond with the formatted results
				return interaction.respond(tracks);
			}
		}
	}
};