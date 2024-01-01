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
	async run(client, interaction) {
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return await interaction.reply(`${client.emoji.red_emoji} You are missing \`MANAGE_GUILD\` permission.`);

		const prefixModal = new ModalBuilder()
			.setTitle('Set Bot Prefix')
			.setCustomId('prefixForm')
			.addComponents(
				new ActionRowBuilder()
					.addComponents(
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
						new TextInputBuilder()
							.setLabel('Reason')
							.setCustomId('reason')
							.setStyle(TextInputStyle.Paragraph)
							.setMaxLength(1000)
							.setRequired(false)
							.setPlaceholder('Enter a reason for the change. This is optional.'),
					),
			);

		await interaction.showModal(prefixModal);
	}
};