const Command = require('../../structures/CommandClass');
const { SlashCommandBuilder } = require('discord.js');

const db = require('../../database/manager');

module.exports = class Database extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('database')
				.setDescription('Change mongoose database values')
				.addUserOption(option => option.setName('target').setDescription('The user')
					.setRequired(true))
				.addStringOption(option =>
					option.setName('type')
						.setDescription('Database field (e.g. xp, balance, reputation)')
						.setRequired(true))
				.addNumberOption((option) =>
					option.setName('value')
						.setDescription('Data value (min: 1 max: 9999999)')
						.setMinValue(1)
						.setMaxValue(9999999)
						.setRequired(true))
				.setDMPermission(false),
			usage: 'database [user] [string] [number]',
			category: 'Developer',
			permissions: ['Use Application Commands', 'Send Messages'],
		});
	}
	/**
 * Runs the function with the given client and interaction parameters.
 *
 * @param {Client} client - The Discord client object.
 * @param {Interaction} interaction - The interaction object representing the interaction with the user.
 * @return {Promise<void>} - A promise that is resolved when the function has completed.
 */
	async run(client, interaction) {
		// Check if the user is authorized
		if (interaction.user.id !== process.env.DEVELOPER_ID) {
			return interaction.reply(`${client.emoji.red_emoji} Missing \`DEVELOPER\` permission.`);
		}

		const member = interaction.options.getUser('target');
		const type = interaction.options.getString('type');
		const value = interaction.options.getNumber('value');

		switch (type) {
		case 'xp': {
			// Get the user from the database
			const { user } = await db.getUserById(member.id);

			// Update the user's xp
			await db.updateUserById(member.id, {
				xp: user.xp + Number(value),
			});

			return interaction.reply(
				`${client.emoji.green_emoji} Successfully added \`${value}\` xp to ${member.username}.`,
			);
		}
		case 'balance': {
			// Get the user from the database
			const { user } = await db.getUserById(member.id);

			// Update the user's balance
			await db.updateUserById(member.id, {
				balance: user.balance + Number(value),
			});

			return interaction.reply(
				`${client.emoji.green_emoji} Successfully added \`${value}\` coins to ${member.username}.`,
			);
		}
		case 'reputation': {
			// Get the user from the database
			const { user } = await db.getUserById(member.id);

			// Update the user's reputation
			await db.updateUserById(member.id, {
				reputation: user.reputation + Number(value),
			});

			return interaction.reply(
				`${client.emoji.green_emoji} Successfully added \`${value}\` reputation points to ${member.username}.`,
			);
		}
		default: {
			return interaction.reply(`${client.emoji.red_emoji} Error: \`${type}\` is not a valid type.`);
		}
		}
	}
};