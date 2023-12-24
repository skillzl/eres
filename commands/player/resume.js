const Command = require('../../structures/CommandClass');
const { SlashCommandBuilder } = require('discord.js');

const { Player } = require('discord-player');

module.exports = class Resume extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('resume')
				.setDescription('Resumes the current track')
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

		if (!queue.node.isPaused()) {
			return await interaction.reply('<:red_emoji:1126936340022435963> The queue isn\'t currently paused.');
		}

		queue.node.setPaused(false);
		return await interaction.reply(`<:green_emoji:1126936345043030026> Successfully unpaused **${queue.currentTrack.title}**.`);
	}
};