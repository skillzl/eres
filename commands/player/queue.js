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
	async run(client, interaction) {
		const player = Player.singleton();
		const queue = player.nodes.get(interaction.guild.id);

		const embed = new EmbedBuilder()
			.setColor(0x2F3136);

		if (!queue || !queue.isPlaying()) {
			return await interaction.reply('<:red_emoji:1126936340022435963> There isn\'t currently any music playing.');
		}

		const queuedTracks = queue.tracks.toArray();

		if (!queuedTracks[0]) {
			return await interaction.reply('There aren\'t any other tracks in the queue. Use `/nowplaying` to show information about the current track.');
		}

		embed.setThumbnail(interaction.guild.iconURL({ size: 2048, dynamic: true }) || client.user.displayAvatarURL({ size: 2048, dynamic: true }));
		embed.setAuthor({ name: `Server Queue - ${interaction.guild.name}` });

		const tracks = queuedTracks.map((track, i) => {
			return `\`${i + 1}\` [${track.title}](${track.url}) by **${track.author}** (Requested by <@${track.requestedBy.id}>)`;
		});
		const songs = queuedTracks.length;
		const nextSongs = songs > 5 ? `And **${songs - 5}** other ${songs - 5 > 1 ? 'tracks' : 'track'} currently in queue.` : '';
		const progress = queue.node.createProgressBar();

		embed.setDescription(`**Current Track:** [${queue.currentTrack.title}](${queue.currentTrack.url}) by **${queue.currentTrack.author}**\n${progress}\n\n${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`);

		return await interaction.reply({ embeds: [embed] });
	}
};