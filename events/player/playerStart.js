const { EmbedBuilder } = require('discord.js');

const db = require('../../database/manager');

module.exports = {
	name: 'playerStart',
	/**
 * Executes the given track in the specified queue.
 *
 * @param {Queue} queue - The queue to execute the track in.
 * @param {Track} track - The track to be executed.
 * @returns {Promise<void>} - A promise that resolves once the track has been executed.
 */
	async execute(queue, track, client) {
	// Increment the number of songs played in the database
		db.incrementSongsPlayed();

		// Create an embed with the track information and send it to the channel of the queue's metadata
		const embed = new EmbedBuilder()
			.setColor(0x2F3136)
			.setTitle(`${client.emoji.music} Now Playing`)
			.setDescription(`Song: **[${track.title}](${track.url})** by **${track.author}**.`);

		// If the track has a thumbnail, set it as the thumbnail of the embed
		if (track.thumbnail) {
			embed.setThumbnail(track.thumbnail);
		}

		// Send the embed to the channel of the queue's metadata
		queue.metadata.channel.send({ embeds: [embed] });
	},
};