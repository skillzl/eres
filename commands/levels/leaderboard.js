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
			permissions: ['Use Application Commands', 'Send Messages'],
		});
	}
	/**
 * Runs the leaderboard command.
 * @param {Client} client - The Discord client.
 * @param {Interaction} interaction - The interaction object.
 */
	async run(client, interaction) {
		// Retrieve the users from the database, sorted by xp in descending order
		const users = await userModel.find({}).sort('-xp');
		const leaderboard = [];

		// Iterate over the top 10 users
		for (let i = 0; i < 10; i++) {
			if (users[i]) {
				// Get the user object from the Discord cache
				const user = client.users.cache.get(users[i].userId);
				if (user) {
					// Add the user's rank, username, and xp to the leaderboard array
					leaderboard.push(`**${i + 1}**. ${user.username} - ${users[i].xp} xp points`);
				}
			}
		}

		// Create the embed object
		const embed = new EmbedBuilder()
			.setColor(0x2B2D31)
			.setTitle(`${client.emoji.star} Ranking Leaderboard`)
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 128, format: 'png' }))
			.setDescription(
				'You can easily earn xp points and achievements by texting on your favorite communities. Our text-based leveling system is global and will reward you at some accomplishments.\n\n' +
        leaderboard.join('\n'),
			);

		// Reply to the interaction with the embed
		await interaction.reply({ embeds: [embed] });
	}
};