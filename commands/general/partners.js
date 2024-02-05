const Command = require('../../structures/CommandClass');

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = class Partners extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('partners')
				.setDescription('Returns the bot partners')
				.setDMPermission(false),
			usage: 'partners',
			category: 'General',
			permissions: ['Use Application Commands', 'Send Messages'],
		});
	}
	/**
 * Runs the partners command.
 *
 * @param {Client} client - The Discord client.
 * @param {Interaction} interaction - The interaction object.
 * @returns {Promise<Message>} - A promise that resolves to the message sent.
 */
	async run(client, interaction) {
		// Get the i18n instance for the guild
		const i18n = await client.i18n.get(interaction.guild.id);

		// Create the partners embed with the bot's partners
		const embed = new EmbedBuilder()
			.setTitle(`${client.emoji.partnered_badge} ${client.i18n.handle('GENERAL', 'PARTNERS', i18n)}`)
			.setColor(0x2B2D31)
			.setDescription(`${client.i18n.handle('GENERAL', 'PARTNERS_SUB', i18n).replace('{partner_name}', 'Poggy').replace('{partner_desc}', client.i18n.handle('PARTNERS', 'POGGY_DESC', i18n)).replace('{partner_link}', '[GitHub](https://github.com/hotsu0p/Pogy)')}`);

		// Send the partners embed as a reply to the interaction
		return await interaction.reply({ embeds: [embed] });
	}
};
