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
	async run(client, interaction) {
		const player = Player.singleton();
		const queue = player.nodes.get(interaction.guild.id);

		const embed = new EmbedBuilder()
			.setTitle('<:music_emoji:1188172803934011442> Now Playing')
			.setColor(0x2B2D31);

		if (!queue || !queue.isPlaying()) {
			return await interaction.reply('<:red_emoji:1126936340022435963> There isn\'t currently any music playing.');
		}

		const progress = queue.node.createProgressBar();
		embed.setDescription(`${progress}\n \n**[${queue.currentTrack.title}](${queue.currentTrack.url})** by **${queue.currentTrack.author}** is currently playing in **${interaction.guild.name}**. This track was requested by <@${queue.currentTrack.requestedBy.id}>.`);
		embed.setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 2048, extension: 'png' }));

		return await interaction.reply({ embeds: [embed] });
	}
};
