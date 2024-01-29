const Command = require('../../structures/CommandClass');
const db = require('../../database/manager');

const { SlashCommandBuilder } = require('discord.js');

module.exports = class Balance extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('balance')
				.setDescription('Customize your profile, by setting a new about me text')
				.addUserOption(option => option.setName('target').setDescription('The user')
					.setRequired(false))
				.setDMPermission(false),
			usage: 'balance [user]',
			category: 'Economy',
			permissions: ['Use Application Commands', 'Send Messages'],
		});
	}
	/**
 * Retrieves the user's balance asynchronously and sends a reply with the balance information.
 *
 * @param {Client} client - The client object representing the Discord bot.
 * @param {Interaction} interaction - The interaction object representing the command interaction.
 * @return {Promise<void>} This function does not return anything.
 */
	async run(client, interaction) {
		// Get the target user from the interaction options, or use the interaction user as the default
		const member = interaction.options.getUser('target') || interaction.user;

		// Retrieve the user's data from the database
		const { user } = await db.getUserById(member.id);

		// Send a reply with the user's balance information
		interaction.reply(`${client.emoji.balance} ${member.username} has **${user.balance.toLocaleString()}** coins in total.`);
	}
};