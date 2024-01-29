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
			permissions: ['Use Application Commands', 'Send Messages'],
		});
	}
	/**
 * Runs the function.
 *
 * @param {Client} client - The client object.
 * @param {Interaction} interaction - The interaction object.
 * @return {Promise<void>} - A promise that resolves when the function is finished.
 */
	async run(client, interaction) {
		// Get the 'text' string from the interaction options
		const text = interaction.options.getString('text');

		// Generate ASCII art from the 'text' using the figlet library
		figlet.text(text, (error, asciiArt) => {
			// If there was an error generating the ASCII art, return
			if (error) {
				return;
			}

			// Reply to the interaction with the generated ASCII art
			interaction.reply(`\`\`\`${asciiArt.trimRight()}\`\`\``);
		});
	}
};