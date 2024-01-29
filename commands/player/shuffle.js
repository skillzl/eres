const Command = require('../../structures/CommandClass');
const { SlashCommandBuilder } = require('discord.js');

const { Player } = require('discord-player');

module.exports = class Shuffle extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('shuffle')
				.setDescription('Shuffles all tracks currently in the queue')
				.setDMPermission(false),
			usage: 'shuffle',
			category: 'Player',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	/**
 * Shuffles the tracks in the queue and sends a reply message.
 *
 * @param {Client} client - The Discord client.
 * @param {Interaction} interaction - The interaction object.
 */
	async run(client, interaction) {
		// Get the singleton instance of the Player class
		const player = Player.singleton();

		// Get the queue for the current guild
		const queue = player.nodes.get(interaction.guild.id);

		// Check if there is no queue or the queue is not playing
		if (!queue || !queue.isPlaying()) {
			// Send a reply message indicating no music is currently playing
			return await interaction.reply(`${client.emoji.red_emoji} There isn't currently any music playing.`);
		}

		// Check if there are no other tracks in the queue
		if (!queue.tracks.toArray()[0]) {
			// Send a reply message indicating there are no other tracks in the queue
			return await interaction.reply(`${client.emoji.red_emoji} There aren't any other tracks in the queue. Use \`/play\` to add some more.`);
		}

		// Shuffle the tracks in the queue
		queue.tracks.shuffle();

		// Send a reply message indicating the shuffle was successful
		return await interaction.reply(queue.tracks.length === 1 ? `${client.emoji.green_emoji} Successfully shuffled \`${queue.tracks.toArray().length}\` track.` : `${client.emoji.green_emoji} Successfully shuffled \`${queue.tracks.toArray().length}\` tracks.`);
	}
};