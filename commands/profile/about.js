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
			usage: 'about [string]',
			category: 'Profile',
			permissions: ['Use Application Commands', 'Send Messages'],
		});
	}
	/**
 * Updates the user's personal bio in the database.
 * @param {Client} client - The Discord client object.
 * @param {Interaction} interaction - The interaction object.
 */
	async run(client, interaction) {
		// Get the input from the interaction options
		const input = interaction.options.getString('input');

		if (input) {
			// Update the user's personal bio in the database
			db.updateUserById(interaction.user.id, {
				about: input,
			});

			// Send a reply to indicate successful update
			await interaction.reply(`${client.emoji.green_emoji} Successfully updated your personal bio.`);
		}
	}
};