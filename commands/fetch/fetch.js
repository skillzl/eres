const Command = require('../../structures/CommandClass');

const { SlashCommandBuilder } = require('discord.js');

module.exports = class Fetch extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('fetch')
				.setDescription('Customize your profile, by setting a new about me text')
				.setDMPermission(false),
			usage: 'fetch',
			category: 'Fetch',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		interaction.reply('<:balance_emoji:1129875960188112966>');
	}
};