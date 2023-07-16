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
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		const { user } = await db.getUserById(interaction.user.id);

		const timeout = 86400000;
		const amount = Math.floor(Math.random() * 500) + 1;

		if (user.daily_cooldown !== null && timeout - (Date.now() - user.daily_cooldown) > 0) {
			const time = ms(timeout - (Date.now() - user.daily_cooldown), {
				long: true,
			});

			interaction.reply(`You've already collected your daily reward recently, \`${time}\` remaining.`);
		}
		else {
			db.updateUserById(interaction.user.id, {
				daily_cooldown: Date.now(),
				balance: user.balance + amount,
			});

			interaction.reply(`<:balance_emoji:1129875960188112966> ${interaction.user.username}, you collected your daily bonus worth of **${amount.toLocaleString()}** coins.`);
		}
	}
};