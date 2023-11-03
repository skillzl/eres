const Command = require('../../structures/CommandClass');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = class Test extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('test')
				.setDescription('Test')
				.setDMPermission(false),
			usage: 'test',
			category: 'Developer',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		if (interaction.user.id !== process.env.DEVELOPER_ID) return interaction.reply('Missing `DEVELOPER` permission.');

		const categorizedCommands = {};
		client.commands.forEach(command => {
			if (!categorizedCommands[command.category]) {
				categorizedCommands[command.category] = [];
			}
			categorizedCommands[command.category].push(command.name);
		});

		const embed = new EmbedBuilder()
			.setColor(0x36393e)
			.setTitle('<:star_emoji:1126279940321574913> Commands')
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 128, format: 'png' }));

		for (const category in categorizedCommands) {
			const commandList = categorizedCommands[category].join(', ');
			embed.addFields(
				{ name: category, value: commandList },
			);
		}

		await interaction.reply({ embeds: [embed] });

	}
};