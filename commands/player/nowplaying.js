const Command = require('../../structures/CommandClass');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { Player } = require('discord-player');

module.exports = class Nowplaying extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('nowplaying')
				.setDescription('View information about the current track')
				.setDMPermission(false),
			usage: 'nowplaying',
			category: 'Player',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	/**
 * Runs the command when invoked by a user.
 * @param {Client} client - The Discord client.
 * @param {Interaction} interaction - The interaction object.
 * @returns {Promise<void>}
 */
	async run(client, interaction) {
		// Get the singleton instance of the Player class
		const player = Player.singleton();

		// Get the queue for the current guild
		const queue = player.nodes.get(interaction.guild.id);

		// Create a new EmbedBuilder instance
		const embed = new EmbedBuilder()
			.setTitle(`${client.emoji.music} Now Playing`)
			.setColor(0x2B2D31);

		// Check if there is no queue or the queue is not playing any music
		if (!queue || !queue.isPlaying()) {
			return await interaction.reply(`${client.emoji.red_emoji} There isn't currently any music playing.`);
		}

		// Create a progress bar using the current node
		const progress = queue.node.createProgressBar();

		// Set the description of the embed with the current track information
		embed.setDescription(`${progress}\n \n**[${queue.currentTrack.title}](${queue.currentTrack.url})** by **${queue.currentTrack.author}** is currently playing in **${interaction.guild.name}**. This track was requested by <@${queue.currentTrack.requestedBy.id}>.`);

		// Set the thumbnail of the embed to the guild's icon
		embed.setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 2048, extension: 'png' }));

		// Reply to the interaction with the embed
		return await interaction.reply({ embeds: [embed] });
	}
};