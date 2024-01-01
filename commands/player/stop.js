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
	async run(client, interaction) {
		const player = Player.singleton();
		const queue = player.nodes.get(interaction.guild.id);

		if (!queue || !queue.isPlaying()) {
			return await interaction.reply(`${client.emoji.red_emoji} There isn't currently any music playing.`);
		}
		else {
			queue.delete();
			return await interaction.reply(`${client.emoji.green_emoji} The music has been stopped.`);
		}
	}
};