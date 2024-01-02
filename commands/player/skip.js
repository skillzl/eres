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

	/**
 * Handles the "skip" command when invoked by a user.
 * @param {Client} client - The Discord client object.
 * @param {Interaction} interaction - The interaction object representing the command interaction.
 */
	async run(client, interaction) {
		const player = Player.singleton();
		const queue = player.nodes.get(interaction.guild.id);

		// Check if there is any music currently playing
		if (!queue || !queue.isPlaying()) {
			return await interaction.reply(`${client.emoji.red_emoji} There isn't currently any music playing.`);
		}

		const usersInChannel = interaction.member.voice.channel.members.size;

		// Initialize the skipVotes set if it doesn't exist
		if (!skipVotes[interaction.guild.id]) {
			skipVotes[interaction.guild.id] = new Set();
		}

		// Add the user's vote to skip the track
		const skipVotesTotal = skipVotes[interaction.guild.id];
		skipVotesTotal.add(interaction.user.id);

		// Check if the number of skip votes reaches the required threshold
		if (skipVotesTotal.size >= Math.ceil(usersInChannel * 0.35)) {
			// Skip the current track and reset the skipVotes set
			queue.node.skip();
			skipVotes[interaction.guild.id] = new Set();
			return await interaction.reply(`${client.emoji.green_emoji} The track **${queue.currentTrack.title}** was skipped.`);
		}
		else {
			// Calculate the number of votes needed to skip the track
			const votesNeeded = Math.ceil(usersInChannel * 0.35) - skipVotesTotal.size - 1;
			return await interaction.reply(`You voted to skip. Required ${votesNeeded} more vote(s) needed to skip the track.`);
		}
	}
};
