const Command = require('../../structures/CommandClass');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { Player } = require('discord-player');

module.exports = class Queue extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('queue')
				.setDescription('Shows all tracks currently in the server queue')
				.setDMPermission(false),
			usage: 'queue',
			category: 'Player',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	/**
 * Runs the command when triggered by a user interaction.
 *
 * @param {Client} client - The Discord client instance.
 * @param {Interaction} interaction - The interaction object representing the user interaction.
 * @returns {Promise<void>} - A promise that resolves once the command has finished executing.
 */
	async run(client, interaction) {
		// Get the singleton instance of the Player class
		const player = Player.singleton();

		// Get the queue for the guild from the player's nodes
		const queue = player.nodes.get(interaction.guild.id);

		// Create an EmbedBuilder object
		const embed = new EmbedBuilder()
			.setColor(0x2F3136);

		// Check if there is no queue or if the queue is not playing any music
		if (!queue || !queue.isPlaying()) {
			return await interaction.reply(`${client.emoji.red_emoji} There isn't currently any music playing.`);
		}

		// Convert the queued tracks to an array
		const queuedTracks = queue.tracks.toArray();

		// Check if there are no other tracks in the queue
		if (!queuedTracks[0]) {
			return await interaction.reply('There aren\'t any other tracks in the queue. Use `/nowplaying` to show information about the current track.');
		}

		// Set the thumbnail for the embed using the guild's icon URL or the client's user display avatar URL
		embed.setThumbnail(interaction.guild.iconURL({ size: 2048, dynamic: true }) || client.user.displayAvatarURL({ size: 2048, dynamic: true }));

		// Set the author for the embed with the server queue name
		embed.setAuthor({ name: `Server Queue - ${interaction.guild.name}` });

		// Map the queued tracks to a formatted string with track information
		const tracks = queuedTracks.map((track, i) => {
			return `\`${i + 1}\` [${track.title}](${track.url}) by **${track.author}** (Requested by <@${track.requestedBy.id}>)`;
		});

		// Get the number of queued tracks
		const songs = queuedTracks.length;

		// Check if there are more than 5 queued tracks
		const nextSongs = songs > 5 ? `And **${songs - 5}** other ${songs - 5 > 1 ? 'tracks' : 'track'} currently in queue.` : '';

		// Create a progress bar using the queue's node
		const progress = queue.node.createProgressBar();

		// Set the description for the embed with the current track, progress bar, and queued tracks
		embed.setDescription(`**Current Track:** [${queue.currentTrack.title}](${queue.currentTrack.url}) by **${queue.currentTrack.author}**\n${progress}\n\n${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`);

		// Reply to the interaction with the embed
		return await interaction.reply({ embeds: [embed] });
	}
};