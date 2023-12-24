const { EmbedBuilder } = require('discord.js');

const db = require('../../database/manager');

module.exports = {
	name: 'playerStart',
	async execute(queue, track) {

		db.incrementSongsPlayed();
		const embed = new EmbedBuilder()
			.setColor(0x2F3136)
			.setTitle('<:music_emoji:1188172803934011442> Now Playing')
			.setDescription(`Song: **[${track.title}](${track.url})** by **${track.author}**.`);

		if (track.thumbnail) {
			embed.setThumbnail(track.thumbnail);
		}

		queue.metadata.channel.send({ embeds: [embed] });
	},
};