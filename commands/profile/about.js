const Command = require('../../structures/CommandClass');
const db = require('../../database/manager');

const { SlashCommandBuilder } = require('discord.js');

module.exports = class About extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('about')
				.setDescription('Customize your profile, by setting a new about me text')
				.addStringOption(option =>
					option.setName('input')
						.setDescription('Your new profile\'s description')
						.setRequired(true))
				.setDMPermission(false),
			usage: 'about',
			category: 'Profile',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		const input = interaction.options.getString('input');

		if (input) {
			db.updateUserById(interaction.user.id, {
				about: input,
			});

			await interaction.reply('<:green_emoji:1126936345043030026> Successfully updated your personal bio.');
		}
	}
};