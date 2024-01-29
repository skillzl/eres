const Command = require('../../structures/CommandClass');

const fetch = require('node-fetch');

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = class Commits extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('commits')
				.setDescription('Shows last 5 commits pushed on main branch')
				.setDMPermission(false),
			usage: 'commits',
			category: 'App',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	/**
 * Asynchronously runs the function.
 *
 * @param {Client} client - The client object.
 * @param {Interaction} interaction - The interaction object.
 * @return {Promise<void>} Returns a promise that resolves to nothing.
 */
	async run(client, interaction) {
		// Set owner and repo variables
		const owner = 'skillzl';
		const repo = 'eres';

		// Construct the URL for fetching commits
		const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`;

		try {
			// Fetch the commits
			const response = await fetch(url);
			const data = await response.json();

			// If no commits found, reply and return
			if (data.length === 0) {
				interaction.reply('No commits found.');
				return;
			}

			// Map the commits to a formatted string
			const commits = data.map((commit) => {
				const isoDate = commit.commit.author.date;
				const unixTimestamp = Date.parse(isoDate) / 1000;
				const commitSha = commit.sha;

				return `[\`${commitSha.substring(0, 7)}\`](https://github.com/${owner}/${repo}/commit/${commitSha})\n<t:${unixTimestamp}:R> ${commit.commit.message}`;
			});

			// Create an embed with the fetched commits
			const embed = new EmbedBuilder()
				.setColor(0x2B2D31)
				.setTitle(`${client.emoji.ticket} GitHub Commits`)
				.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 128, format: 'png' }))
				.setDescription(`Last **5** fetched commits from the public repository [github.com/${owner}/${repo}](https://github.com/${owner}/${repo}). Use this information to know what's up with the client's journey.\n\n` + commits.join('\n'));

			// Reply with the embed
			await interaction.reply({ embeds: [embed] });
		}
		catch (err) {
			console.error(err.message);
		}
	}
};