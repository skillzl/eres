const Command = require('../../structures/CommandClass');

const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField } = require('discord.js');

module.exports = class Prefix extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('prefix')
				.setDescription('Sets a new bot prefix by filling out the modal')
				.setDMPermission(false),
			usage: 'prefix',
			category: 'Utils',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links', 'Manage Guild'],
		});
	}
	/**
 * This function runs when a client and interaction are provided.
 * It checks if the interaction member has the 'ManageGuild' permission.
 * If the permission is missing, it replies with an error message.
 * Otherwise, it creates a prefix modal and shows it to the interaction.
 * The modal allows the user to set a new bot prefix and provide an optional reason for the change.
 */
	async run(client, interaction) {
	// Check if the interaction member has the 'ManageGuild' permission
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
		// Reply with an error message if the permission is missing
			return await interaction.reply(`${client.emoji.red_emoji} You are missing \`MANAGE_GUILD\` permission.`);
		}

		// Create a prefix modal
		const prefixModal = new ModalBuilder()
			.setTitle('Set Bot Prefix')
			.setCustomId('prefixForm')
			.addComponents(
				new ActionRowBuilder()
					.addComponents(
					// Add a text input for the prefix
						new TextInputBuilder()
							.setLabel('Prefix')
							.setCustomId('prefix')
							.setStyle(TextInputStyle.Short)
							.setMinLength(1)
							.setMaxLength(5)
							.setRequired(true)
							.setPlaceholder('Enter a new prefix. Make sure it\'s easy to remember!'),
					),
				new ActionRowBuilder()
					.addComponents(
					// Add a text input for the reason
						new TextInputBuilder()
							.setLabel('Reason')
							.setCustomId('reason')
							.setStyle(TextInputStyle.Paragraph)
							.setMaxLength(1000)
							.setRequired(false)
							.setPlaceholder('Enter a reason for the change. This is optional.'),
					),
			);

		// Show the prefix modal to the interaction
		await interaction.showModal(prefixModal);
	}
};