const Command = require('../../structures/CommandClass');
const userModel = require('../../database/userModel');

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = class Leaderboard extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('leaderboard')
				.setDescription('Shows top 10 users with the highest amount of XP.')
				.setDMPermission(false),
			usage: 'leaderboard',
			category: 'Levels',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {

		const users = await userModel.find({}).sort('-xp');
		const leaderboard = [];

		for (let i = 0; i < 10; i++) {
			if (users[i]) {
				leaderboard.push(`**${i + 1}**. ${client.users.cache.get(users[i].userId)} - ${users[i].xp} xp points`);
			}
		}

		const embed = new EmbedBuilder()
			.setColor(0x36393e)
			.setTitle(`Leaderboard in ${interaction.guild.name}`)
			.setDescription(leaderboard.join('\n'));

		await interaction.reply({ embeds: [embed] });
	}
};