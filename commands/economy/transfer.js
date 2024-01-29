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
	/**
 * Runs the function asynchronously.
 *
 * @param {Client} client - The client object.
 * @param {Interaction} interaction - The interaction object.
 * @returns {Promise} A Promise that resolves to nothing.
 */
	async run(client, interaction) {
		// Get the target user from the interaction options or default to the interaction user
		const member = interaction.options.getUser('target') || interaction.user;

		// Get the amount from the interaction options
		const amount = interaction.options.getNumber('amount');

		// Calculate the fee based on the amount
		const fee = Math.round(amount - amount * 0.729);

		// Get the receiver and sender user objects from the database
		const { user: receiver } = await db.getUserById(member.id);
		const { user: sender } = await db.getUserById(interaction.user.id);

		// Calculate the coins given (amount minus fee)
		const coinsGiven = amount - fee;

		// Check if the amount is less than 0 and return an error message
		if (amount < 0) {
			return interaction.reply('Make sure you enter a valid number.');
		}

		// Check if the sender has enough balance and return an error message
		if (amount > sender.balance) {
			return interaction.reply('Sorry, but you don\'t have that amount of coins.');
		}

		// Check if the amount is not a valid number and return an error message
		if (isNaN(amount)) {
			return interaction.reply('Make sure you enter a valid number.');
		}

		// Check if the amount is finite and return an error message
		if (!isFinite(amount)) {
			return interaction.reply('Make sure you enter a valid number.');
		}

		// Check if the receiver and sender are the same user and return an error message
		if (receiver.userId === sender.userId) {
			return interaction.reply('You cannot transfer coins to your own account.');
		}

		// Update the receiver's balance in the database
		await db.updateUserById(member.id, {
			balance: receiver.balance + coinsGiven,
		});

		// Update the sender's balance in the database
		await db.updateUserById(interaction.user.id, {
			balance: sender.balance - amount,
		});

		// Return a success message with the transfer details
		return interaction.reply(`${client.emoji.green_emoji} Successfully transfered \`${amount.toLocaleString()}\` coins to ${member.username}. \`fee: ${fee.toLocaleString()} (${Math.round((1 - 0.729) * 100)}%)\``);
	}
};