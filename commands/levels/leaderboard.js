const Command = require('../../structures/CommandClass');
const userModel = require('../../database/userModel');

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = class Leaderboard extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('leaderboard')
				.setDescription('Shows top 10 users with the highest amount of XP')
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
				const user = client.users.cache.get(users[i].userId);
				if (user) {
					leaderboard.push(`**${i + 1}**. ${user.username} - ${users[i].xp} xp points`);
				}
			}
		}

		const embed = new EmbedBuilder()
			.setColor(0x36393e)
			.setTitle('<:star_emoji:1126279940321574913> Ranking Leaderboard')
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 128, format: 'png' }))
			.setDescription('You can easily earn xp points and achievements by texting on your favorite communities. Our text-based leveling system is global and will reward you at some accomplishments.\n\n' + leaderboard.join('\n'));

		await interaction.reply({ embeds: [embed] });
	}
};