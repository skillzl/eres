const db = require('../../database/manager');

module.exports = {
	name: 'playerStart',
	async execute(queue, track) {

		db.incrementSongsPlayed();
		queue.metadata.channel.send({ content: `<:music_emoji:1188172803934011442> Now playing **[${track.title}]** by **${track.author}**.` });
	},
};
