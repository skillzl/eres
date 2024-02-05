/* eslint-disable no-unused-vars */
const Command = require('../../structures/CommandClass');

const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = class Commands extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('commands')
				.setDescription('Fetches available commands')
				.addStringOption(option =>
					option.setName('command')
						.setDescription('Type a command to get specif usage help')
						.setRequired(false))
				.setDMPermission(false),
			usage: 'commands [commandName]',
			category: 'General',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	/**
 * Runs the command when invoked by a user.
 *
 * @param {Client} client - The Discord client.
 * @param {Interaction} interaction - The interaction object representing the command invocation.
 */
	async run(client, interaction) {
		// Get the i18n instance for the guild
		const i18n = await client.i18n.get(interaction.guild.id);

		// Categorize the commands
		const categorizedCommands = {};
		client.commands.forEach(command => {
			if (!categorizedCommands[command.category]) {
				categorizedCommands[command.category] = [];
			}
			categorizedCommands[command.category].push(command.name);
		});

		// Check if a specific command is requested
		const commandName = interaction.options.getString('command');
		if (commandName) {
			const command = client.commands.get(commandName);
			if (command) {
				const usage = command.usage;

				// Create an embed with the command usage
				const embed = new EmbedBuilder()
					.setColor(0x2B2D31)
					.setDescription(client.i18n.handle('GENERAL', 'COMMAND_USAGE', i18n).replace('{commandName}', commandName).replace('{commandUsage}', usage));

				// Reply to the interaction with the embed
				await interaction.reply({ embeds: [embed] });
				return;
			}
		}

		// Create the main embed with the list of commands
		const embed = new EmbedBuilder()
			.setAuthor({ name: `${client.user.username} • ${client.i18n.handle('GENERAL', 'COMMANDS', i18n)}`, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 2048, format: 'png' }) })
			.setColor(0x2B2D31)
			.setDescription(client.i18n.handle('GENERAL', 'COMMANDS_SUB', i18n))
			.setFooter({
				text: client.i18n.handle('GENERAL', 'COMMANDS_FOOTER', i18n),
			})
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 128, format: 'png' }));

		// Add fields to the embed for each category of commands
		for (const category in categorizedCommands) {
			const commandList = categorizedCommands[category].join(', ');
			embed.addFields(
				{ name: category, value: commandList, inline: true },
			);
		}

		// Reply to the interaction with the embed
		await interaction.reply({ embeds: [embed] });
	}
};