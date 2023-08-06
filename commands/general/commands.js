const Command = require('../../structures/CommandClass');

const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = class Commands extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('commands')
				.setDescription('Fetches available commands')
				.setDMPermission(false),
			usage: 'commands',
			category: 'General',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {

		const embed = new EmbedBuilder()
			.setAuthor({ name: 'Eres • Commands', iconURL: interaction.guild.iconURL({ dynamic: true, size: 2048, extension: 'png' }) })
			.setColor(0x36393e)
			.setDescription('Before using any of these commands you are welcomed with a guide.')
			.addFields(
				{ name: 'Developer', value: 'database, eval' },
				{ name: 'Economy', value: 'balance, daily, fish, hunt, slots, transfer' },
				{ name: 'General', value: 'avatar, commands, ping, select' },
				{ name: 'Levels', value: 'leaderboard, rank, xp' },
				{ name: 'Profile', value: 'about, profile, rep' },
			)
			.setFooter({
				text: 'You are experiencing a beta version of this application that may suffer some unfinished features!',
			})
			.setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 2048, extension: 'png' }));

		await interaction.reply({ embeds: [embed] });
	}
};