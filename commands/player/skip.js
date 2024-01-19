const Command = require('../../structures/CommandClass');
const { SlashCommandBuilder } = require('discord.js');
const { Collection } = require('discord.js');

const db = require('../../database/manager');
const { Player } = require('discord-player');

const skipVotes = new Collection();

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
		// Get the player singleton instance and the queue for the current guild
		const player = Player.singleton();
		const queue = player.nodes.get(interaction.guild.id);
		const database = await db.findServer(interaction.guild.id);

		// Check if there is any music currently playing
		if (!queue || !queue.isPlaying()) {
			return await interaction.reply(`${client.emoji.red_emoji} There isn't currently any music playing.`);
		}

		// Get the number of users in the voice channel
		const usersInChannel = interaction.member.voice.channel.members.filter(member => !member.user.bot).size;

		// Get the DJ role from the database
		const djRole = database?.djrole;

		// Initialize the skipVotes set if it doesn't exist
		if (!skipVotes.has(interaction.guild.id)) {
			skipVotes.set(interaction.guild.id, new Set());
		}

		// Add the user's vote to skip the track
		const skipVotesTotal = skipVotes.get(interaction.guild.id);
		skipVotesTotal.add(interaction.user.id);

		// Check if the number of skip votes reaches the required threshold
		if (skipVotesTotal.size >= usersInChannel / 2) {
			// Skip the current track and reset the skipVotes set
			queue.node.skip();
			skipVotes.delete(interaction.guild.id);
			return await interaction.reply(`${client.emoji.green_emoji} The track **${queue.currentTrack.title}** was skipped.`);
		}
		else if (interaction.member.roles.cache.has(djRole)) {
			queue.node.skip();
			return await interaction.reply(`${client.emoji.green_emoji} The track **${queue.currentTrack.title}** was skipped.`);
		}
		else {
			// Calculate the number of votes needed to skip the track
			const votesNeeded = usersInChannel / 2;
			return await interaction.reply(`You voted to skip. Required ${Math.round(votesNeeded - 1)} more vote(s) needed to skip the track.`);
		}
	}
};
