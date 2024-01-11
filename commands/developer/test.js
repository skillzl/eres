const Command = require('../../structures/CommandClass');
const { SlashCommandBuilder } = require('discord.js');

module.exports = class Test extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('test')
				.setDescription('Test command')
				.setDMPermission(false),
			usage: 'test',
			category: 'Developer',
			permissions: ['Use Application Commands', 'Send Messages'],
		});
	}
	/**
 * Runs the function asynchronously.
 *
 * @param {Client} client - The client object.
 * @param {Interaction} interaction - The interaction object.
 * @return {Promise<void>} - Returns a Promise that resolves to nothing.
 */
	async run(client, interaction) {
		// Check if the user is authorized to run the function
		if (interaction.user.id !== process.env.DEVELOPER_ID) {
			// If not authorized, reply with an error message
			return interaction.reply(`${client.emoji.red_emoji} Missing \`DEVELOPER\` permission.`);
		}

		// Get the i18n instance for the guild
		const i18n = await client.i18n.get(interaction.guild.id);

		// Reply to the interaction with the success message
		interaction.reply({ content: `${client.i18n.handle('GENERAL', 'TEST', i18n)}\n${client.emoji.green_emoji} ${client.i18n.handle('GLOBAL', 'SUCCESS', i18n) ? client.i18n.handle('GLOBAL', 'SUCCESS', i18n) : client.i18n.handle('GLOBAL', 'ERROR', i18n)}` });
	}
};