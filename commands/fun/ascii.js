const Command = require('../../structures/CommandClass');

const figlet = require('figlet');

const { SlashCommandBuilder } = require('discord.js');

module.exports = class Ascii extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('ascii')
				.setDescription('Transform text to ascii.')
				.addStringOption(option =>
					option.setName('text')
						.setDescription('Type a text')
						.setRequired(true))
				.setDMPermission(false),
			usage: 'ascii [string]',
			category: 'Fun',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		const text = interaction.options.getString('text');

		figlet.text(text, (e, txt) => {
			if (e) return;
			interaction.reply(`\`\`\` ${txt.trimRight()} \`\`\``);
		});
	}
};