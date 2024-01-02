const Command = require('../../structures/CommandClass');
const { SlashCommandBuilder } = require('discord.js');

const { Player } = require('discord-player');

module.exports = class Stop extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('stop')
				.setDescription('Stops the current track and clears the queue')
				.setDMPermission(false),
			usage: 'stop',
			category: 'Player',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	/**
 * Runs the command when a user interacts with it.
 * @param {Client} client - The Discord client.
 * @param {Interaction} interaction - The user interaction.
 */
	async run(client, interaction) {
		// Get the singleton instance of the Player class
		const player = Player.singleton();

		// Get the queue for the guild from the player nodes
		const queue = player.nodes.get(interaction.guild.id);

		// Check if there is a queue and if it is currently playing
		if (!queue || !queue.isPlaying()) {
			// Reply with a message indicating that there is no music currently playing
			return await interaction.reply(`${client.emoji.red_emoji} There isn't currently any music playing.`);
		}
		else {
			// Delete the queue
			queue.delete();
			// Reply with a message indicating that the music has been stopped
			return await interaction.reply(`${client.emoji.green_emoji} The music has been stopped.`);
		}
	}
};