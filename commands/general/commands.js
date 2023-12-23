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
	async run(client, interaction) {
		const categorizedCommands = {};
		client.commands.forEach(command => {
			if (!categorizedCommands[command.category]) {
				categorizedCommands[command.category] = [];
			}
			categorizedCommands[command.category].push(command.name);
		});

		const commandName = interaction.options.getString('command');
		if (commandName) {
			const command = client.commands.get(commandName);
			if (command) {
				const usage = command.usage;
				const embed = new EmbedBuilder()
					.setColor(0x2B2D31)
					.setDescription(`Usage for command ${commandName}: ${usage}`);
				await interaction.reply({ embeds: [embed] });
				return;
			}
		}


		const embed = new EmbedBuilder()
			.setAuthor({ name: `${client.user.username} • Commands`, iconURL: interaction.guild.iconURL({ dynamic: true, size: 2048, extension: 'png' }) })
			.setColor(0x2B2D31)
			.setDescription('Before using any of these commands you are welcomed with a guide.')
			.setFooter({
				text: 'You are experiencing a beta version of this application that may suffer some unfinished features!',
			})
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 128, format: 'png' }));

		for (const category in categorizedCommands) {
			const commandList = categorizedCommands[category].join(', ');
			embed.addFields(
				{ name: category, value: commandList, inline: true },
			);
		}

		await interaction.reply({ embeds: [embed] });
	}
};