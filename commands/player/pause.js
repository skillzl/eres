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
	async run(client, interaction) {
		const player = Player.singleton();
		const queue = player.nodes.get(interaction.guild.id);

		if (!queue || !queue.isPlaying()) {
			return await interaction.reply('<:red_emoji:1126936340022435963> There isn\'t currently any music playing.');
		}

		queue.node.setPaused(!queue.node.isPaused());
		return await interaction.reply(`<:green_emoji:1126936345043030026> Successfully ${queue.node.isPaused() === true ? 'paused' : 'unpaused'} **${queue.currentTrack.title}**.`);
	}
};