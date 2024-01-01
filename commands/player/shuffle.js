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
	async run(client, interaction) {
		const player = Player.singleton();
		const queue = player.nodes.get(interaction.guild.id);

		if (!queue || !queue.isPlaying()) {
			return await interaction.reply(`${client.emoji.red_emoji} There isn't currently any music playing.`);
		}

		if (!queue.tracks.toArray()[0]) {
			return await interaction.reply(`${client.emoji.red_emoji} There aren't any other tracks in the queue. Use \`/play\` to add some more.`);
		}

		queue.tracks.shuffle();
		return await interaction.reply(queue.tracks.length === 1 ? `${client.emoji.green_emoji} Successfully shuffled \`${queue.tracks.toArray().length}\` track.` : `${client.emoji.green_emoji} Successfully shuffled \`${queue.tracks.toArray().length}\` tracks.`);
	}
};