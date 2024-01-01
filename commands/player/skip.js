const Command = require('../../structures/CommandClass');
const { SlashCommandBuilder } = require('discord.js');

const { Player } = require('discord-player');

const skipVotes = new Map();

module.exports = class Skip extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('skip')
				.setDescription('Skips the current track')
				.setDMPermission(false),
			usage: 'skip',
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

		const usersInChannel = interaction.member.voice.channel.members.size;
		if (!skipVotes[interaction.guild.id]) {
			skipVotes[interaction.guild.id] = new Set();
		}
		const skipVotesTotal = skipVotes[interaction.guild.id];
		skipVotesTotal.add(interaction.user.id);

		if (skipVotesTotal.size >= Math.ceil(usersInChannel * 0.35)) {
			queue.node.skip();
			skipVotes[interaction.guild.id] = new Set();
			return await interaction.reply(`${client.emoji.green_emoji} The track **${queue.currentTrack.title}** was skipped.`);
		}
		else {
			return await interaction.reply(`You voted to skip. Required ${Math.ceil(usersInChannel * 0.35) - skipVotes.size - 1} more vote(s) needed to skip the track.`);
		}
	}
};
