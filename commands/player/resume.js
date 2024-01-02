const Command = require('../../structures/CommandClass');
const { SlashCommandBuilder } = require('discord.js');

const { Player } = require('discord-player');

module.exports = class Resume extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('resume')
				.setDescription('Resumes the current track')
				.setDMPermission(false),
			usage: 'resume',
			category: 'Player',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		/**
		 * Resumes the music playback in the queue if it is paused.
		 *
		 * @param {Client} client - The Discord client object.
		 * @param {Interaction} interaction - The interaction object representing the command.
		 */

		// Get the player singleton instance
		const player = Player.singleton();

		// Get the queue for the guild from the player
		const queue = player.nodes.get(interaction.guild.id);

		// Check if there is a queue or if the queue is currently playing
		if (!queue || !queue.isPlaying()) {
			return await interaction.reply(`${client.emoji.red_emoji} There isn't currently any music playing.`);
		}

		// Check if the queue is paused
		if (!queue.node.isPaused()) {
			return await interaction.reply(`${client.emoji.red_emoji} The queue isn't currently paused.`);
		}

		// Set the queue to unpaused
		queue.node.setPaused(false);

		// Reply with a success message
		return await interaction.reply(`${client.emoji.green_emoji} Successfully unpaused **${queue.currentTrack.title}**.`);
	}
};