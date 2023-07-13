const Command = require('../../structures/CommandClass');

const { SlashCommandBuilder } = require('discord.js');

module.exports = class Profile extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('profile')
				.setDescription('Fetch the current profile stats an user have.')
				.addUserOption(option => option.setName('target').setDescription('The user')
					.setRequired(false))
				.setDMPermission(false),
			usage: 'profile',
			category: 'Profile',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		const member = interaction.options.getUser('target') || interaction.user;

		interaction.reply('wip ' + member.username);
	}
};