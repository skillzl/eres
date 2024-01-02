const Command = require('../../structures/CommandClass');

const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = class Clear extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('clear')
				.setDescription('Deletes a bulk of specified messages')
				.addNumberOption((option) =>
					option.setName('number')
						.setDescription('Messages count (min: 2 max: 100)')
						.setMinValue(2)
						.setMaxValue(100)
						.setRequired(true))
				.setDMPermission(false),
			usage: 'clear [number]',
			category: 'Utils',
			permissions: ['Use Application Commands', 'Send Messages', 'Manage Messages'],
		});
	}
	/**
 * Runs the command when the corresponding slash command is used.
 *
 * @param {Client} client - The Discord client instance.
 * @param {Interaction} interaction - The interaction object representing the slash command.
 */
	async run(client, interaction) {
		// Check if the user has the 'MANAGE_MESSAGES' permission
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
			// If not, reply with an error message
			return await interaction.reply(`${client.emoji.red_emoji} You are missing \`MANAGE_MESSAGES\` permission.`);
		}

		// Get the value of the 'number' option from the interaction
		const number = interaction.options.getNumber('number');

		// Fetch the specified number of messages from the channel
		const fetched = await interaction.channel.messages.fetch({ limit: number });

		// Bulk delete the fetched messages
		await interaction.channel.bulkDelete(fetched).then(interaction.reply(`${client.emoji.green_emoji} Deleted ${number} messages.`).then(reply => {
			// Delete the success message after 2 seconds
			setTimeout(() => {
				reply.delete();
			}, 2000);
		}));
	}
};