const Command = require('../../structures/CommandClass');
const { SlashCommandBuilder } = require('discord.js');

const { Player } = require('discord-player');

module.exports = class Pause extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('pause')
				.setDescription('Pauses the current track')
				.setDMPermission(false),
			usage: 'resume',
			category: 'Player',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	/**
 * Runs the function with the given client and interaction parameters.
 *
 * @param {Client} client - The client object.
 * @param {Interaction} interaction - The interaction object.
 * @return {Promise} A Promise that resolves to a reply message.
 */
	async run(client, interaction) {
		// Get the singleton instance of the Player class
		const player = Player.singleton();

		// Get the queue for the current guild from the player nodes
		const queue = player.nodes.get(interaction.guild.id);

		// If there is no queue or the queue is not playing, return a message indicating no music is playing
		if (!queue || !queue.isPlaying()) {
			return await interaction.reply(`${client.emoji.red_emoji} There isn't currently any music playing.`);
		}

		// Toggle the pause state of the queue node
		queue.node.setPaused(!queue.node.isPaused());

		// Return a message indicating the success of pausing/unpausing the current track
		return await interaction.reply(`${client.emoji.green_emoji} Successfully ${queue.node.isPaused() === true ? 'paused' : 'unpaused'} **${queue.currentTrack.title}**.`);
	}
};