const Command = require('../../structures/CommandClass');
const db = require('../../database/manager');

const ms = require('ms');

const { SlashCommandBuilder } = require('discord.js');

module.exports = class Daily extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('daily')
				.setDescription('Get your daily bonus worth of coins')
				.setDMPermission(false),
			usage: 'daily',
			category: 'Economy',
			permissions: ['Use Application Commands', 'Send Messages'],
		});
	}
	/**
 * Asynchronously runs the function.
 *
 * @param {Client} client - The client object.
 * @param {Interaction} interaction - The interaction object.
 * @return {Promise<void>} - Returns nothing.
 */
	async run(client, interaction) {
		// Retrieve user from the database based on the interaction user id
		const { user } = await db.getUserById(interaction.user.id);

		// Set the timeout for daily rewards to 24 hours (86400000 milliseconds)
		const timeout = 86400000;

		// Generate a random amount between 1 and 500 for the daily reward
		const amount = Math.floor(Math.random() * 500) + 1;

		// Check if the user has already collected their daily reward
		if (user.daily_cooldown !== null && timeout - (Date.now() - user.daily_cooldown) > 0) {
			// Calculate the remaining time until the user can collect their next daily reward
			const time = ms(timeout - (Date.now() - user.daily_cooldown), {
				long: true,
			});

			// Reply to the interaction with a message indicating the remaining time
			interaction.reply(`You've already collected your daily reward recently, \`${time}\` remaining.`);
		}
		else {
			// Update the user's daily cooldown time and balance in the database
			db.updateUserById(interaction.user.id, {
				daily_cooldown: Date.now(),
				balance: user.balance + amount,
			});

			// Reply to the interaction with a message indicating the amount of coins collected
			interaction.reply(`${client.emoji.balance} ${interaction.user.username}, you collected your daily bonus worth of **${amount.toLocaleString()}** coins.`);
		}
	}
};