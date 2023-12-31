const Command = require('../../structures/CommandClass');
const db = require('../../database/manager');

const { SlashCommandBuilder } = require('discord.js');

module.exports = class Transfer extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('transfer')
				.setDescription('Transfer coins to another user')
				.addUserOption(option => option.setName('target').setDescription('The user')
					.setRequired(true))
				.addNumberOption((option) =>
					option.setName('amount')
						.setDescription('Amount of coins (min: 1 max: 9999999)')
						.setMinValue(1)
						.setMaxValue(9999999)
						.setRequired(true))
				.setDMPermission(false),
			usage: 'transfer [user] [number]',
			category: 'Economy',
			permissions: ['Use Application Commands', 'Send Messages'],
		});
	}
	async run(client, interaction) {
		const member = interaction.options.getUser('target') || interaction.user;
		const amount = interaction.options.getNumber('amount');

		const fee = Math.round(amount - amount * 0.729);
		const { user: receiver } = await db.getUserById(member.id);
		const { user: sender } = await db.getUserById(interaction.user.id);

		const coinsGiven = amount - fee;

		if (amount < 0) return interaction.reply('Make sure you enter a valid number.');
		if (amount > sender.balance) return interaction.reply('Sorry, but you don\'t have that amount of coins.');
		if (isNaN(amount)) return interaction.reply('Make sure you enter a valid number.');
		if (!isFinite(amount)) interaction.reply('Make sure you enter a valid number.');

		if (receiver.userId === sender.userId) return interaction.reply('You cannot transfer coins to your own account.');

		await db.updateUserById(member.id, {
			balance: receiver.balance + coinsGiven,
		});

		await db.updateUserById(interaction.user.id, {
			balance: sender.balance - amount,
		});

		return interaction.reply(`<:green_emoji:1126936345043030026> Successfully transfered \`${amount.toLocaleString()}\` coins to ${member.username}. \`fee: ${fee.toLocaleString()} (${Math.round((1 - 0.729) * 100)}%)\``);
	}
};