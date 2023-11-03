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
	async run(client, interaction) {
		const owner = 'skillzl';
		const repo = 'eres';
		const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`;

		try {
			const response = await fetch(url);
			const data = await response.json();

			if (data.length === 0) {
				interaction.reply('No commits found.');
				return;
			}


			const commits = data.map((commit) => {

				const isoDate = commit.commit.author.date;
				const unixTimestamp = Date.parse(isoDate) / 1000;
				const commitSha = commit.sha;

				return `[\`${commitSha.substring(0, 7)}\`](https://github.com/${owner}/${repo}/commit/${commitSha})\n<t:${unixTimestamp}:R> ${commit.commit.message}`;
			});

			const embed = new EmbedBuilder()
				.setColor(0x36393e)
				.setTitle('<:ticket_emoji:1170117538433212538> GitHub Commits')
				.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 128, format: 'png' }))
				.setDescription(`Last **5** fetched commits from the public reporitory [github.com/${owner}/${repo}](https://github.com/${owner}/${repo}). Use this information to know what's up with the client's journey.\n\n` + commits.join('\n'));

			await interaction.reply({ embeds: [embed] });

		}
		catch (err) {
			console.error(err.message);
		}
	}
};